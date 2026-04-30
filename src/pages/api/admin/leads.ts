// src/pages/api/admin/leads.ts
// API de leads unificados - lead_funnel_steps com fallback para triage_sessions

import type { NextApiRequest, NextApiResponse } from 'next';

import { ensureRole, UnauthorizedError, maskPII } from '@/lib/rbac';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const PRODUCT_LABELS: Record<string, string> = {
  emagrecimento: 'Emagrecimento',
  calvicie: 'Calvície',
  sono: 'Sono',
  ansiedade: 'Ansiedade',
  intestino: 'Intestino',
  figado: 'Fígado',
  'libido-masculina': 'Libido Masculina',
  menopausa: 'Menopausa',
  articulacoes: 'Articulações',
  imunidade: 'Imunidade',
  geral: 'Geral',
};

const STEP_LABELS: Record<string, string> = {
  visited: 'Visitou',
  triage_started: 'Triagem iniciada',
  triage_completed: 'Triagem concluída',
  report_ready: 'Relatório pronto',
  checkout_started: 'Checkout iniciado',
  paid: 'Pago',
};

async function getLeadsFromFunnel(
  productSlug?: string,
  currentStep?: string,
  from?: string,
  to?: string,
  page: number = 1,
  pageSize: number = 20
) {
  let query = supabaseAdmin
    .from('lead_funnel_steps')
    .select('profile_id, product_slug, current_step, entered_at, updated_at', { count: 'exact' });

  if (productSlug) query = query.eq('product_slug', productSlug);
  if (currentStep) query = query.eq('current_step', currentStep);
  if (from) query = query.gte('updated_at', from);
  if (to) query = query.lte('updated_at', to);

  query = query.order('updated_at', { ascending: false });
  query = query.range((page - 1) * pageSize, page * pageSize - 1);

  const { data: steps, count, error } = await query;
  if (error) throw error;
  return { steps: steps ?? [], count: count ?? 0 };
}

async function getLeadsFromTriageSessions(
  productSlug?: string,
  page: number = 1,
  pageSize: number = 20
) {
  let query = supabaseAdmin
    .from('triage_sessions')
    .select('triage_id, profile_id, client_id, triage_slug, completed_at, updated_at, profile_snapshot', {
      count: 'exact',
    })
    .order('updated_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (productSlug) query = query.eq('triage_slug', productSlug);

  const { data: sessions, count, error } = await query;
  if (error) throw error;

  const steps = (sessions ?? []).map((s: any) => {
    const snap = s.profile_snapshot || {};
    return {
      profile_id: s.profile_id || s.client_id || s.triage_id,
      product_slug: s.triage_slug || 'geral',
      current_step: s.completed_at ? 'report_ready' : 'triage_started',
      entered_at: s.updated_at,
      updated_at: s.updated_at,
      _snapshot: snap,
    };
  });

  return { steps, count: count ?? 0, useSnapshot: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    ensureRole(req, ['admin', 'analyst']);

    const productSlug = req.query.productSlug as string | undefined;
    const currentStep = req.query.currentStep as string | undefined;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const page = Math.max(1, parseInt(String(req.query.page || 1), 10));
    const pageSize = Math.min(50, Math.max(10, parseInt(String(req.query.pageSize || 20), 10)));

    let steps: Array<{
      profile_id?: string;
      product_slug?: string;
      current_step?: string;
      entered_at?: string;
      updated_at?: string;
    }> = [];
    let count = 0;

    try {
      const result = await getLeadsFromFunnel(productSlug, currentStep, from, to, page, pageSize);
      steps = result.steps;
      count = result.count;
      if (steps.length === 0 && !productSlug && !currentStep) {
        const fallback = await getLeadsFromTriageSessions(undefined, page, pageSize);
        steps = fallback.steps;
        count = fallback.count;
      }
    } catch (err) {
      const fallback = await getLeadsFromTriageSessions(productSlug, page, pageSize);
      steps = fallback.steps;
      count = fallback.count;
    }

    const profileIds = [...new Set(steps.map((s) => s.profile_id).filter(Boolean))];

    let profiles: Record<string, { name?: string; email?: string; whatsapp?: string }> = {};
    if (profileIds.length > 0) {
      const { data: profs } = await supabaseAdmin
        .from('profiles')
        .select('id, name, email, whatsapp')
        .in('id', profileIds);
      for (const p of profs ?? []) {
        const id = (p as { id?: string }).id || '';
        profiles[id] = {
          name: (p as { name?: string }).name,
          email: (p as { email?: string }).email,
          whatsapp: (p as { whatsapp?: string }).whatsapp,
        };
      }
    }

    const leads = steps.map((s: any) => {
      const p = profiles[s.profile_id || ''] || {};
      const snap = s._snapshot || {};
      return {
        profileId: s.profile_id,
        name: maskPII(p.name || snap.name) || '-',
        email: maskPII(p.email || snap.email) || '-',
        whatsapp: maskPII(p.whatsapp || snap.whatsapp) || '-',
        productSlug: s.product_slug || 'geral',
        productLabel: PRODUCT_LABELS[s.product_slug || 'geral'] || s.product_slug,
        currentStep: s.current_step,
        currentStepLabel: STEP_LABELS[s.current_step || ''] || s.current_step,
        enteredAt: s.entered_at,
        updatedAt: s.updated_at,
      };
    });

    return res.status(200).json({
      leads,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }
    console.warn('[admin/leads] Error:', (error as Error)?.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
