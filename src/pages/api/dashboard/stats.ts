import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@/lib/prisma-client';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getProfileFromRequest } from '@/lib/api/auth-helper';

const prisma = new PrismaClient();

type DashboardStats = {
  totalTriagens: number;
  totalRelatorios: number;
  totalPedidos: number;
  scoreMedio: number | null;
  ultimaAtividade: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardStats | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Buscar Profile do usuário autenticado
    const profile = await getProfileFromRequest(req);

    if (!profile) {
      // Profile não encontrado, retornar zeros
      return res.status(200).json({
        totalTriagens: 0,
        totalRelatorios: 0,
        totalPedidos: 0,
        scoreMedio: null,
        ultimaAtividade: null,
      });
    }

    // Contar triagens do profile
    const { count: triagensCount } = await supabaseAdmin
      .from('triage_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id);

    // Contar relatórios do profile (via triage_sessions)
    const { data: sessionsWithReports } = await supabaseAdmin
      .from('triage_sessions')
      .select('triage_id, reports(id)')
      .eq('profile_id', profile.id);

    const relatoriosCount = sessionsWithReports?.filter(
      (s: any) => s.reports && Array.isArray(s.reports) && s.reports.length > 0
    ).length || 0;

    // Contar pedidos do usuário (Zapfarm + Store V2)
    const userEmail = profile.email?.toLowerCase();
    const [zapfarmCount, storeV2Count] = await Promise.all([
      prisma.zapfarmOrder.count({
        where: {
          OR: [
            ...(userEmail ? [{ customerEmail: userEmail }] : []),
            { profileId: profile.id },
          ],
        },
      }),
      prisma.order.count({
        where: {
          OR: [
            ...(userEmail ? [{ customerEmail: userEmail }] : []),
            { profileId: profile.id },
          ],
        },
      }),
    ]);
    const pedidosCount = zapfarmCount + storeV2Count;

    // Calcular score médio dos relatórios
    let scoreMedio: number | null = null;
    if (sessionsWithReports && sessionsWithReports.length > 0) {
      const scores: number[] = [];
      for (const session of sessionsWithReports) {
        if (session.reports && Array.isArray(session.reports) && session.reports.length > 0) {
          // Tentar extrair score do report (pode estar em sections ou summary)
          // Por enquanto, vamos usar um valor padrão ou buscar de outra forma
          // TODO: Extrair score real dos relatórios quando disponível
        }
      }
      if (scores.length > 0) {
        scoreMedio = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      }
    }

    // Buscar última atividade (mais recente entre triagens, relatórios e pedidos)
    const { data: ultimaTriagem } = await supabaseAdmin
      .from('triage_sessions')
      .select('updated_at')
      .eq('profile_id', profile.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const [ultimoZapfarm, ultimoStoreV2] = await Promise.all([
      prisma.zapfarmOrder.findFirst({
        where: {
          OR: [
            ...(userEmail ? [{ customerEmail: userEmail }] : []),
            { profileId: profile.id },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      prisma.order.findFirst({
        where: {
          OR: [
            ...(userEmail ? [{ customerEmail: userEmail }] : []),
            { profileId: profile.id },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    const atividades: string[] = [];
    if (ultimaTriagem?.updated_at) atividades.push(ultimaTriagem.updated_at);
    if (ultimoZapfarm?.createdAt) atividades.push(ultimoZapfarm.createdAt.toISOString());
    if (ultimoStoreV2?.createdAt) atividades.push(ultimoStoreV2.createdAt.toISOString());

    const ultimaAtividade = atividades.length > 0
      ? atividades.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
      : null;

    return res.status(200).json({
      totalTriagens: triagensCount || 0,
      totalRelatorios: relatoriosCount,
      totalPedidos: pedidosCount,
      scoreMedio,
      ultimaAtividade,
    });
  } catch (error: any) {
    console.error('[dashboard/stats] Error:', error);
    return res.status(500).json({ error: 'Erro ao buscar estatísticas do dashboard' });
  }
}
