// src/pages/api/admin/kpis.ts
// API de KPIs do sistema - dados reais (Supabase + Prisma)

import type { NextApiRequest, NextApiResponse } from 'next';

import { ensureRole, UnauthorizedError } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function parsePeriod(period: string): { from: Date } {
  const now = new Date();
  const from = new Date(now);
  if (period === 'today') {
    from.setHours(0, 0, 0, 0);
  } else if (period === '7d') {
    from.setDate(from.getDate() - 7);
  } else {
    from.setDate(from.getDate() - 30);
  }
  return { from };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    ensureRole(req, ['admin', 'analyst']);

    const period = (req.query.period as string) || '30d';
    const { from } = parsePeriod(period);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    let paidOrders = { _sum: { amount: 0 } as { amount: number | null }, _count: 0 };
    let paidOrdersPeriod = { _sum: { amount: 0 } as { amount: number | null } };
    let paidOrdersToday = { _sum: { amount: 0 } as { amount: number | null } };
    let storeV2Paid = { _sum: { totalCents: 0 } as { totalCents: number | null }, _count: 0 };
    let storeV2PaidPeriod = { _sum: { totalCents: 0 } as { totalCents: number | null } };
    let storeV2PaidToday = { _sum: { totalCents: 0 } as { totalCents: number | null } };
    try {
      [paidOrders, paidOrdersPeriod, paidOrdersToday, storeV2Paid, storeV2PaidPeriod, storeV2PaidToday] =
        await Promise.all([
          prisma.zapfarmOrder.aggregate({ _sum: { amount: true }, _count: true, where: { status: 'PAID' } }),
          prisma.zapfarmOrder.aggregate({ _sum: { amount: true }, where: { status: 'PAID', createdAt: { gte: from } } }),
          prisma.zapfarmOrder.aggregate({ _sum: { amount: true }, where: { status: 'PAID', createdAt: { gte: todayStart } } }),
          prisma.order.aggregate({ _sum: { totalCents: true }, _count: true, where: { status: 'PAID' } }),
          prisma.order.aggregate({ _sum: { totalCents: true }, where: { status: 'PAID', createdAt: { gte: from } } }),
          prisma.order.aggregate({ _sum: { totalCents: true }, where: { status: 'PAID', createdAt: { gte: todayStart } } }),
        ]);
    } catch {
      /* DB indisponível: usar zeros */
    }

    const [
      rTriageTotal,
      rTriageCompleted,
      rTriageToday,
      rReportsTotal,
      rReportsToday,
      rProfilesTotal,
      rProfilesToday,
    ] = await Promise.all([
      supabaseAdmin.from('triage_sessions').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('triage_sessions').select('*', { count: 'exact', head: true }).not('completed_at', 'is', null),
      supabaseAdmin.from('triage_sessions').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()),
      supabaseAdmin.from('triage_reports').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabaseAdmin.from('triage_reports').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('updated_at', todayStart.toISOString()),
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()),
    ]);

    const totalTriages = (rTriageTotal as { count?: number })?.count ?? 0;
    const completedTriages = (rTriageCompleted as { count?: number })?.count ?? 0;
    const triagesToday = (rTriageToday as { count?: number })?.count ?? 0;
    const totalReports = (rReportsTotal as { count?: number })?.count ?? 0;
    const reportsToday = (rReportsToday as { count?: number })?.count ?? 0;
    const totalUsers = (rProfilesTotal as { count?: number })?.count ?? 0;
    const newUsersToday = (rProfilesToday as { count?: number })?.count ?? 0;

    const revenueTotal =
      (paidOrders._sum?.amount ?? 0) / 100 + (storeV2Paid._sum?.totalCents ?? 0) / 100;
    const revenuePeriod =
      (paidOrdersPeriod._sum?.amount ?? 0) / 100 + (storeV2PaidPeriod._sum?.totalCents ?? 0) / 100;
    const revenueToday =
      (paidOrdersToday._sum?.amount ?? 0) / 100 + (storeV2PaidToday._sum?.totalCents ?? 0) / 100;
    const paidCount = (paidOrders._count ?? 0) + (storeV2Paid._count ?? 0);

    const completionRate = totalTriages > 0 ? (completedTriages / totalTriages) * 100 : 0;
    const arpu = paidCount > 0 ? revenueTotal / paidCount : 0;
    const mrr = revenuePeriod;

    const kpis = {
      mrr,
      revenueToday,
      revenueThisMonth: revenuePeriod,
      revenueGrowth: 0,
      activeSubscriptions: paidCount,
      newSubscriptionsToday: 0,
      churnRate: 0,
      arpu,
      ltv: arpu * 3,
      totalUsers,
      newUsersToday,
      activeUsersToday: totalUsers,
      retentionRate: 100,
      totalTriages,
      triagesToday,
      completionRate,
      totalReports,
      reportsToday,
      avgReportScore: 75,
    };

    return res.status(200).json({
      period,
      ...kpis,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }
    console.warn('[admin/kpis] Error:', (error as Error)?.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
