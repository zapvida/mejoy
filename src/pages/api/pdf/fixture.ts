// src/pages/api/pdf/fixture.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import React from 'react';
import QRCode from 'qrcode';
import { pdf } from '@react-pdf/renderer';
import { LabReportPDF } from '@/components/pdf/lab/LabReportPDF';
import { vmToLabReportData } from '@/lib/pdf/lab/mappers';
import { renderWithMinSize, MIN_PDF_BYTES } from '@/lib/pdf/lab/size';

// Fixture de dados para teste sem fallback
const FIXTURE_DATA = {
  meta: { id: 'fixture-test' },
  basics: { 
    firstName: 'João', 
    sex: 'M', 
    age: 34, 
    bmi: 24.2 
  },
  triage: 'gastro',
  score: { now: 72 },
  context: { 
    redFlags: [],
    mainGoal: 'melhorar_saude_intestinal'
  },
  createdAt: new Date().toISOString(),
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'HEAD') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('x-adapter', 'pdf-fixture');
    return res.status(200).end();
  }
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    console.log('[PDF Fixture] Starting fixture test...');
    
    const data = vmToLabReportData(FIXTURE_DATA as any);
    console.log('[PDF Fixture] Data mapped successfully');

    // QR: cria Data URI a partir da URL do relatório
    const qrDataUri = await QRCode.toDataURL(data.meta.qrUrl, { margin: 0, scale: 4 });
    console.log('[PDF Fixture] QR generated successfully');

    // Render principal
    let buffer = await pdf(React.createElement(LabReportPDF, { data, qrDataUri })).toBuffer();
    console.log('[PDF Fixture] PDF rendered, size:', buffer.length);
    
    if (buffer.length < MIN_PDF_BYTES) {
      console.log('[PDF Fixture] PDF too small, using renderWithMinSize...');
      buffer = await renderWithMinSize(data);
      console.log('[PDF Fixture] Min size PDF rendered, size:', buffer.length);
    }

    // Sugere nome de arquivo coerente
    const date = new Date().toISOString().slice(0, 10);
    const filename = `Laudo-Fixture-${data.patient.firstName}-${date}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('x-adapter', 'pdf-fixture');
    res.setHeader('Cache-Control', 'no-store');
    
    console.log('[PDF Fixture] Sending PDF, size:', buffer.length);
    return res.status(200).send(buffer);
  } catch (error) {
    console.error('[PDF Fixture] Error:', error);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('x-adapter', 'pdf-fixture-error');
    return res.status(500).json({ 
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
