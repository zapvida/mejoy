// src/pages/api/admin/activities.ts
// Atividades recentes para o dashboard admin

import type { NextApiRequest, NextApiResponse } from 'next';

import { ensureRole, UnauthorizedError } from '@/lib/rbac';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    ensureRole(req, ['admin', 'analyst']);

    const limit = Math.min(20, Math.max(5, parseInt(String(req.query.limit || 10), 10)));

    const { data: sessions } = await supabaseAdmin
      .from('triage_sessions')
      .select('triage_id, triage_slug, completed_at, updated_at, profile_snapshot')
      .not('updated_at', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(limit);

    const PRODUCT_LABELS: Record<string, string> = {
      emagrecimento: 'Emagrecimento',
      calvicie: 'Calvície',
      sono: 'Sono',
      ansiedade: 'Ansiedade',
      intestino: 'Intestino',
      figado: 'Fígado',
      'libido-masculina': 'Libido',
      menopausa: 'Menopausa',
      articulacoes: 'Articulações',
      imunidade: 'Imunidade',
      geral: 'Geral',
    };

    const activities = (sessions ?? []).map((s: any) => {
      const snap = s.profile_snapshot || {};
      const name = (snap.name || 'Lead').toString().split(' ')[0] || 'Lead';
      const slug = s.triage_slug || 'geral';
      const productLabel = PRODUCT_LABELS[slug] || slug;
      const completed = !!s.completed_at;
      return {
        id: s.triage_id,
        type: 'triage' as const,
        title: `${name} • ${productLabel}`,
        status: completed ? 'completed' : 'started',
        statusLabel: completed ? 'Concluído' : 'Em andamento',
        at: s.updated_at,
      };
    });

    const top = activities.slice(0, limit);

    return res.status(200).json({
      activities: top,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }
    console.warn('[admin/activities] Error:', (error as Error)?.message);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
