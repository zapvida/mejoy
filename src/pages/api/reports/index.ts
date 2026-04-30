import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getProfileFromRequest } from '@/lib/api/auth-helper';

type Report = {
  id: string;
  triageId: string;
  triageSlug: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  summary: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Report[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Buscar Profile do usuário autenticado
    const profile = await getProfileFromRequest(req);

    if (!profile) {
      // Se não houver profile, retornar array vazio
      return res.status(200).json([]);
    }

    // Buscar triage_sessions do profile com seus relatórios
    const { data: sessions, error } = await supabaseAdmin
      .from('triage_sessions')
      .select(`
        triage_id,
        triage_slug,
        completed_at,
        created_at,
        reports (
          id,
          status,
          summary,
          created_at
        )
      `)
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[reports] Error fetching sessions:', error);
      return res.status(500).json({ error: 'Erro ao buscar relatórios' });
    }

    // Transformar dados para o formato esperado
    const reports: Report[] = [];
    
    if (sessions) {
      for (const session of sessions) {
        const sessionReports = session.reports as any[];
        
        if (sessionReports && Array.isArray(sessionReports) && sessionReports.length > 0) {
          // Se houver relatórios, criar um item para cada
          for (const report of sessionReports) {
            reports.push({
              id: report.id,
              triageId: session.triage_id,
              triageSlug: session.triage_slug,
              status: report.status || 'pending',
              createdAt: session.created_at,
              completedAt: report.created_at || session.completed_at,
              summary: report.summary || null,
            });
          }
        } else {
          // Se não houver relatório ainda, criar item com status pending
          reports.push({
            id: `pending-${session.triage_id}`,
            triageId: session.triage_id,
            triageSlug: session.triage_slug,
            status: session.completed_at ? 'pending' : 'in_progress',
            createdAt: session.created_at,
            completedAt: session.completed_at,
            summary: null,
          });
        }
      }
    }

    return res.status(200).json(reports);
  } catch (error: any) {
    console.error('[reports] Error:', error);
    return res.status(500).json({ error: 'Erro ao buscar relatórios' });
  }
}

