// src/pages/api/admin/funnel-by-product.ts
// Funil por produto: chegada → início triagem → triagem preenchida → compra

import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureRole, UnauthorizedError } from '@/lib/rbac';
import { getMockFunnelsByProduct } from '@/lib/admin-mocks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    ensureRole(req, ['admin', 'analyst']);
    const period = (req.query.period as string) || '30d';
    const data = getMockFunnelsByProduct(period);
    return res.status(200).json({
      period,
      funnels: data,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }
    console.warn('[admin/funnel-by-product] Error:', (error as Error)?.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
