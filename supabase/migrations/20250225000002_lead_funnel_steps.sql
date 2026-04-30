-- Tabela lead_funnel_steps para rastreamento "onde entrou / onde parou"
-- Usado no admin para métricas de funil por produto

CREATE TABLE IF NOT EXISTS public.lead_funnel_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  product_slug text NOT NULL DEFAULT 'geral',
  triage_slug text,
  current_step text NOT NULL,
  source text,
  entered_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Índice único por profile + product para upsert
CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_funnel_profile_product
  ON public.lead_funnel_steps(profile_id, product_slug);

CREATE INDEX IF NOT EXISTS idx_lead_funnel_step ON public.lead_funnel_steps(current_step);
CREATE INDEX IF NOT EXISTS idx_lead_funnel_entered ON public.lead_funnel_steps(entered_at);
CREATE INDEX IF NOT EXISTS idx_lead_funnel_product ON public.lead_funnel_steps(product_slug);

COMMENT ON TABLE public.lead_funnel_steps IS 'Etapas do funil por lead para admin e métricas';
