// src/pages/api/pdf/test-simple.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Teste simples sem dependências externas
    const testData = {
      meta: { id: 'test', qrUrl: 'https://example.com/test' },
      patient: { firstName: 'João', sex: 'M', age: 34, bmi: 24.2 },
      triage: { slug: 'gastro', redFlags: [] },
      score: { now: 72 },
      gi: { bristol: 5, bowelPerDay: 2, waterLiters: 1.8, fiberGrams: 18 },
      lifestyle: { sleepHours: 6.5, stress: 2 },
      meds: { recentAntibiotic: false, nsaids: false, ibp: true },
      answers: {},
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('x-adapter', 'test-simple');
    return res.status(200).json({ success: true, data: testData });
  } catch (error) {
    console.error('Test error:', error);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('x-adapter', 'test-error');
    return res.status(500).json({ error: String(error) });
  }
}
