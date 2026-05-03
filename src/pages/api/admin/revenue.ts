// src/pages/api/admin/revenue.ts
// API de dados de receita - dados reais

import type { NextApiRequest, NextApiResponse } from 'next';

import { ensureRole, UnauthorizedError } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

function parsePeriod(period: string): { from: Date; todayStart: Date } {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const from = new Date(now);
  if (period === 'today') from.setTime(todayStart.getTime());
  else if (period === '7d') from.setDate(from.getDate() - 7);
  else from.setDate(from.getDate() - 30);
  return { from, todayStart };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    ensureRole(req, ['admin', 'analyst']);

    const period = (req.query.period as string) || '30d';
    const { from, todayStart } = parsePeriod(period);

    const yearStart = new Date();
    yearStart.setMonth(0, 1);
    yearStart.setHours(0, 0, 0, 0);

    let revenueToday = 0;
    let revenueThisWeek = 0;
    let revenueThisMonth = 0;
    let revenueThisYear = 0;
    try {
      const [today, week, month, year] = await Promise.all([
        prisma.zapfarmOrder.aggregate({ _sum: { amount: true }, where: { status: 'PAID', createdAt: { gte: todayStart } } }),
        prisma.zapfarmOrder.aggregate({ _sum: { amount: true }, where: { status: 'PAID', createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
        prisma.zapfarmOrder.aggregate({ _sum: { amount: true }, where: { status: 'PAID', createdAt: { gte: from } } }),
        prisma.zapfarmOrder.aggregate({ _sum: { amount: true }, where: { status: 'PAID', createdAt: { gte: yearStart } } }),
      ]);
      revenueToday = (today._sum?.amount ?? 0) / 100;
      revenueThisWeek = (week._sum?.amount ?? 0) / 100;
      revenueThisMonth = (month._sum?.amount ?? 0) / 100;
      revenueThisYear = (year._sum?.amount ?? 0) / 100;
    } catch {
      /* DB indisponível: usar zeros */
    }

    return res.status(200).json({
      period,
      revenueToday,
      revenueThisWeek,
      revenueThisMonth,
      revenueThisYear,
      basicMonthly: 0,
      plusMonthly: 0,
      basicYearly: 0,
      plusYearly: 0,
      stripeRevenue: revenueThisMonth,
      projectedMonthlyRevenue: revenueThisMonth,
      projectedYearlyRevenue: revenueThisYear,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }
    console.warn('[admin/revenue] Error:', (error as Error)?.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
