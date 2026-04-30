// src/pages/api/pdf/test-mapper.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import React from 'react';
import QRCode from 'qrcode';
import { pdf } from '@react-pdf/renderer';
import { LabReportPDF } from '@/components/pdf/lab/LabReportPDF';
import { vmToLabReportData } from '@/lib/pdf/lab/mappers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Dados de teste simples sem usar derive
    const vm = {
      meta: { id: 'test' },
      basics: { firstName: 'João', sex: 'M', age: 34, bmi: 24.2 },
      triage: 'gastro',
      score: { now: 72 },
      context: { redFlags: [] },
      createdAt: new Date().toISOString(),
    };

    const data = vmToLabReportData(vm as any);

    // QR: cria Data URI a partir da URL do relatório
    const qrDataUri = await QRCode.toDataURL(data.meta.qrUrl, { margin: 0, scale: 4 });

    // Render principal
    const buffer = await pdf(React.createElement(LabReportPDF, { data, qrDataUri })).toBuffer();

    // Sugere nome de arquivo coerente
    const date = new Date().toISOString().slice(0, 10);
    const filename = `Laudo-${data.meta.triageSlug}-${data.patient.firstName}-${date}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('x-adapter', 'pdf-test-mapper');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(buffer);
  } catch (error) {
    console.error('Mapper test error:', error);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('x-adapter', 'pdf-test-error');
    return res.status(500).json({ error: String(error) });
  }
}
