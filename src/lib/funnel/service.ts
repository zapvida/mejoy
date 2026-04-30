/**
 * Serviço centralizado de avanço de etapas do funil.
 * Usar APENAS advanceLead() para atualizar lead_funnel_steps.
 */

import { supabaseAdmin } from '@/lib/supabaseAdmin';

const STEP_ORDER = [
  'visited',
  'triage_started',
  'triage_completed',
  'report_ready',
  'checkout_started',
  'paid',
  'support',
  'nps',
  'opted_out',
  'no_response',
  'abandoned',
] as const;

function stepIndex(step: string): number {
  const i = STEP_ORDER.indexOf(step as (typeof STEP_ORDER)[number]);
  return i >= 0 ? i : STEP_ORDER.length;
}

export interface AdvanceLeadParams {
  profileId: string;
  productSlug?: string;
  triageSlug?: string;
  step: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Avança o lead para uma etapa do funil.
 * Se a etapa for mais avançada que a atual, atualiza. Caso contrário, ignora.
 */
export async function advanceLead(params: AdvanceLeadParams): Promise<void> {
  const { profileId, productSlug, triageSlug, step, source, metadata } = params;
  const productKey = productSlug || 'geral';
  const now = new Date().toISOString();

  const { data: existing } = await supabaseAdmin
    .from('lead_funnel_steps')
    .select('current_step')
    .eq('profile_id', profileId)
    .eq('product_slug', productKey)
    .maybeSingle();

  const currentIdx = existing
    ? stepIndex((existing as { current_step?: string })?.current_step || '')
    : -1;
  const newIdx = stepIndex(step);

  if (newIdx <= currentIdx) return;

  await supabaseAdmin.from('lead_funnel_steps').upsert(
    {
      profile_id: profileId,
      product_slug: productKey,
      triage_slug: triageSlug || null,
      current_step: step,
      source: source || null,
      updated_at: now,
      metadata: metadata ?? {},
    },
    {
      onConflict: 'profile_id,product_slug',
    }
  );
}
