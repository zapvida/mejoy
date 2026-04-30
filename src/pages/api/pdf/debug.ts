// src/pages/api/pdf/debug.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { deriveReport } from '@/lib/report/derive';
import { vmToLabReportData } from '@/lib/pdf/lab/mappers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('[PDF Debug] Starting debug request...');
    
    // Teste 1: getVM
    const id = (req.query.id || req.query.reportId) as string | undefined;
    console.log('[PDF Debug] ID:', id);
    
    let vm;
    if (id) {
      console.log('[PDF Debug] Calling deriveReport...');
      vm = await deriveReport({ reportId: id }, { persist: false });
      console.log('[PDF Debug] deriveReport result:', vm ? 'success' : 'failed');
    } else {
      console.log('[PDF Debug] Using demo data...');
      vm = {
        meta: { id: 'demo' },
        patient: { firstName: 'João', sex: 'M', age: 34, bmi: 24.2 },
        triage: { slug: 'gastro', redFlags: [] },
        score: { now: 72 },
        gi: { bristol: 5, bowelPerDay: 2, waterLiters: 1.8, fiberGrams: 18 },
        lifestyle: { sleepHours: 6.5, stress: 2 },
        meds: { recentAntibiotic: false, nsaids: false, ibp: true },
        answers: {},
      };
    }
    
    // Teste 2: vmToLabReportData
    console.log('[PDF Debug] Calling vmToLabReportData...');
    const data = vmToLabReportData(vm as any);
    console.log('[PDF Debug] vmToLabReportData result:', data ? 'success' : 'failed');
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('x-adapter', 'pdf-debug');
    return res.status(200).json({ 
      success: true, 
      vm: vm ? 'success' : 'failed',
      data: data ? 'success' : 'failed',
      dataMeta: data?.meta,
      dataPatient: data?.patient
    });
  } catch (error) {
    console.error('[PDF Debug] Error:', error);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('x-adapter', 'pdf-debug-error');
    return res.status(500).json({ 
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
