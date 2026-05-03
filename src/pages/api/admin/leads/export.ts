// src/pages/api/admin/leads/export.ts
// Export CSV de leads

import type { NextApiRequest, NextApiResponse } from 'next';

import { ensureRole, UnauthorizedError } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function escapeCsv(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const user = ensureRole(req, ['admin', 'analyst']);

    const productSlug = req.query.productSlug as string | undefined;
    const currentStep = req.query.currentStep as string | undefined;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const includePII = req.query.includePII === 'true' || req.query.includePII === '1';

    let steps: Array<{ profile_id?: string; product_slug?: string; current_step?: string; entered_at?: string; updated_at?: string }> = [];

    try {
      let query = supabaseAdmin.from('lead_funnel_steps').select(`
        profile_id,
        product_slug,
        current_step,
        entered_at,
        updated_at
      `);
      if (productSlug) query = query.eq('product_slug', productSlug);
      if (currentStep) query = query.eq('current_step', currentStep);
      if (from) query = query.gte('updated_at', from);
      if (to) query = query.lte('updated_at', to);
      query = query.order('updated_at', { ascending: false }).limit(5000);
      const { data } = await query;
      steps = data ?? [];
      if (steps.length === 0 && !productSlug && !currentStep) {
        const { data: sessions } = await supabaseAdmin
          .from('triage_sessions')
          .select('profile_id, triage_slug, completed_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(5000);
        steps = (sessions ?? []).map((s: any) => ({
          profile_id: s.profile_id,
          product_slug: s.triage_slug || 'geral',
          current_step: s.completed_at ? 'report_ready' : 'triage_started',
          entered_at: s.updated_at,
          updated_at: s.updated_at,
        }));
      }
    } catch {
      const { data: sessions } = await supabaseAdmin
        .from('triage_sessions')
        .select('profile_id, triage_slug, completed_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5000);
      steps = (sessions ?? []).map((s: any) => ({
        profile_id: s.profile_id,
        product_slug: s.triage_slug || 'geral',
        current_step: s.completed_at ? 'report_ready' : 'triage_started',
        entered_at: s.updated_at,
        updated_at: s.updated_at,
      }));
    }

    const profileIds = [...new Set((steps ?? []).map((s: { profile_id?: string }) => s.profile_id).filter(Boolean))];

    let profiles: Record<string, { name?: string; email?: string; whatsapp?: string }> = {};
    if (profileIds.length > 0) {
      const { data: profs } = await supabaseAdmin
        .from('profiles')
        .select('id, name, email, whatsapp')
        .in('id', profileIds);
      for (const p of profs ?? []) {
        profiles[(p as { id?: string }).id || ''] = {
          name: (p as { name?: string }).name || '',
          email: (p as { email?: string }).email || '',
          whatsapp: (p as { whatsapp?: string }).whatsapp || '',
        };
      }
    }

    const mask = (v: string | undefined) => {
      if (!includePII || !v) return v ? `${v.substring(0, 2)}***` : '-';
      return v || '-';
    };

    const rows = (steps ?? []).map((s: { profile_id?: string; product_slug?: string; current_step?: string; entered_at?: string; updated_at?: string }) => {
      const p = profiles[s.profile_id || ''] || {};
      return {
        name: mask(p.name),
        email: includePII ? (p.email || '-') : mask(p.email),
        whatsapp: includePII ? (p.whatsapp || '-') : mask(p.whatsapp),
        productSlug: s.product_slug || 'geral',
        currentStep: s.current_step || '-',
        updatedAt: s.updated_at || '-',
      };
    });

    const header = 'Nome,Email,WhatsApp,Produto,Etapa,Atualizado';
    const csv = [header, ...rows.map((r) => [r.name, r.email, r.whatsapp, r.productSlug, r.currentStep, r.updatedAt].map(escapeCsv).join(','))].join('\n');

    if (includePII) {
      try {
        await prisma.adminAuditLog.create({
          data: {
            actorUserId: user.id,
            action: 'EXPORT_CSV',
            target: 'leads',
            metadata: { includePII: true, count: rows.length },
          },
        });
      } catch {
        // AdminAuditLog pode não existir
      }
    }

    const filename = `leads-mejoy-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send('\ufeff' + csv);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }
    console.warn('[admin/leads/export] Error:', (error as Error)?.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
