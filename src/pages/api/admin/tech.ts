// src/pages/api/admin/tech.ts
// API de dados técnicos

import type { NextApiRequest, NextApiResponse } from 'next';

import { ensureRole, UnauthorizedError } from '@/lib/rbac';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Verificar autorização
    ensureRole(req, ['admin', 'analyst']);

    const p = { uptime: 99.9, avgResponseTime: 150, errorRate: 0.01 };
    const db = { connections: 12, queryTime: 25, size: 2.4 * 1024 * 1024 * 1024 };

    return res.status(200).json({
      apiUptime: p.uptime,
      avgResponseTime: p.avgResponseTime,
      errorRate: p.errorRate,
      dbConnections: db.connections,
      dbResponseTime: db.queryTime,
      dbSize: db.size,
      openaiStatus: 'healthy',
      stripeStatus: 'healthy',
      supabaseStatus: 'healthy',
      lighthouseScore: 94,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }
    
    console.warn('[admin] Error:', error?.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
