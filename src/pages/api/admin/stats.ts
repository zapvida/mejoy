// src/pages/api/admin/stats.ts
// API de estatísticas para admin

import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificação básica de autenticação (em produção, usar auth mais robusta)
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    if (!prisma) {
      return res.status(503).json({ error: "Database not available" });
    }

    // Buscar estatísticas
    const [
      totalUsers,
      totalTriages,
      totalReports,
      totalSubscriptions,
      totalGifts,
      revenueData
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.triage.count(),
      prisma.report.count(),
      prisma.subscription.count({
        where: { status: 'active' }
      }),
      // TODO(backcompat-2025-10-23) - Proteger com GIFT_ENABLED
      process.env.GIFT_ENABLED === '1' ? (prisma as any).gift.count() : Promise.resolve(0),
      prisma.subscription.aggregate({
        _sum: { amount: true },
        where: { status: 'active' }
      })
    ]);

    const stats = {
      totalUsers,
      totalTriages,
      totalReports,
      totalSubscriptions,
      totalGifts,
      revenue: revenueData._sum.amount || 0
    };

    return res.status(200).json(stats);

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
