// src/pages/api/pdf/report.ts
import type { NextApiRequest, NextApiResponse } from 'next';
export const config = { api: { bodyParser: false } };

import React from 'react';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import { pdf } from '@react-pdf/renderer';
import { LabReportPDF } from '@/components/pdf/lab/LabReportPDF';
import { vmToLabReportData } from '@/lib/pdf/lab/mappers';
import { renderWithMinSize, MIN_PDF_BYTES } from '@/lib/pdf/lab/size';
import { deriveReport } from '@/lib/report/derive';
import type { ReportViewModel } from '@/lib/report/derive';

function tinyFallback(): Buffer {
  const text = 'Me Joy - PDF fallback (emergencial).';
  const base = Buffer.from(
    `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids [3 0 R]>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
4 0 obj<</Length ${text.length + 50}>>stream
BT /F1 12 Tf 50 780 Td (${text}) Tj ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000070 00000 n 
0000000125 00000 n 
0000000271 00000 n 
0000000000 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
400
%%EOF`,
    'utf-8'
  );
  return base;
}

async function getVM(req: NextApiRequest): Promise<ReportViewModel & { answers?: Record<string, unknown> }> {
  const id = (req.query.id || req.query.reportId) as string | undefined;
  if (!id) {
    return buildDemoVM();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return buildDemoVM();
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: sessionRow, error: sessionError } = await supabase
    .from('triage_sessions')
    .select(`
      profile_snapshot,
      answers,
      triage_slug,
      triage_reports(status, sections)
    `)
    .eq('triage_id', id)
    .single();

  if (sessionError || !sessionRow) {
    return buildDemoVM();
  }

  const reportRow = Array.isArray(sessionRow.triage_reports)
    ? sessionRow.triage_reports[0]
    : sessionRow.triage_reports;
  const answers = (sessionRow.answers || {}) as Record<string, unknown>;

  // Usar cache quando disponível (evita deriveReport)
  if (reportRow?.status === 'completed' && reportRow?.sections && typeof reportRow.sections === 'object') {
    const cached = reportRow.sections as ReportViewModel;
    if (cached?.id && cached?.basics && cached?.content) {
      return { ...cached, answers } as ReportViewModel & { answers: Record<string, unknown> };
    }
  }

  const snap = sessionRow.profile_snapshot || {};
  const profile = {
    name: snap.name || 'Paciente',
    sex: snap.sex || 'M',
    age: snap.age ?? null,
    birthDate: snap.birthDate || snap.dob || snap.birth_date || null,
    bmi: snap.bmi ?? null,
    whatsapp: snap.whatsapp || '',
    weightKg: snap.weightKg ?? snap.weight ?? null,
    heightCm: snap.heightCm ?? snap.height ?? null,
  };

  const vm = await deriveReport({
    triageId: id,
    sessionData: {
      answers,
      profile,
      triageSlug: sessionRow.triage_slug || 'geral',
    },
    options: { includeAudio: false },
  }, { persist: false });

  (vm as any).answers = answers;
  return vm;
}

function buildDemoVM(): ReportViewModel & { answers: Record<string, unknown> } {
  const vm = {
    id: 'demo',
    triageId: 'demo',
    triage: 'gastro' as const,
    greeting: 'Olá!',
    basics: { name: 'João', firstName: 'João', age: 34, sex: 'M', bmi: 24.2, bmiCategory: 'Peso normal' },
    score: 72,
    palette: { primary: '#3b82f6', secondary: '#8b5cf6' },
    interpretation: 'Avaliação padrão',
    gradient: 'from-blue-600 to-purple-600',
    icon: '📋',
    context: { redFlags: [] },
    content: {
      executiveSummary: [],
      todayPlan: [],
      shortTermPlan: [],
      longTermPlan: [],
      nonMedicalAdvice: [],
      whenToSeekMedical: [],
      scientificEvidence: [],
      toneAdvice: '',
    },
    aiGenerated: false,
    icd10Candidates: [],
    createdAt: new Date().toISOString(),
  } as ReportViewModel;
  (vm as any).answers = {};
  return vm as ReportViewModel & { answers: Record<string, unknown> };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'HEAD') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('x-adapter', 'pdf-report');
    return res.status(200).end();
  }
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const vm = await getVM(req);
    const answers = (vm as any).answers;
    const data = vmToLabReportData(vm, answers ? { answers } : undefined);
    // QR: cria Data URI a partir da URL do relatório
    const qrDataUri = await QRCode.toDataURL(data.meta.qrUrl, { margin: 0, scale: 4 });

    // Render principal
    let buffer = await pdf(React.createElement(LabReportPDF, { data, qrDataUri })).toBuffer();
    if (buffer.length < MIN_PDF_BYTES) {
      buffer = await renderWithMinSize(data);
    }

    // Sugere nome de arquivo coerente
    const date = new Date().toISOString().slice(0, 10);
    const filename = `Laudo-${data.meta.triageSlug}-${data.patient.firstName}-${date}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('x-adapter', 'pdf-report');
    res.setHeader('Cache-Control', 'no-store');

    // Disparar evento PDF_GENERATED para GHL (apenas se não for fallback)
    if (buffer.length >= MIN_PDF_BYTES) {
      try {
        const reportId = vm.id || (req.query.id || req.query.reportId) as string;
        const reportUrl = reportId 
          ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zapfarm.com.br'}/report/${reportId}`
          : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zapfarm.com.br'}/dashboard`;
        
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'PDF_GENERATED',
            payload: { 
              name: data.patient?.firstName ? `${data.patient.firstName} ${data.patient.lastName || ''}`.trim() : undefined,
              email: data.patient?.email,
              phone: data.patient?.whatsapp,
              reportId: reportId,
              triageType: data.meta?.triageSlug || vm.triage?.slug
            }
          })
        });
      } catch (ghlError) {
        console.error('[PDF_GENERATED] GHL event failed:', ghlError);
        // Não falhar a requisição se o evento GHL falhar
      }
    }

    return res.status(200).send(buffer.length >= MIN_PDF_BYTES ? buffer : tinyFallback());
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[PDF Report] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
    }
    const fb = tinyFallback();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('x-adapter', 'pdf-report-fallback');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(fb);
  }
}