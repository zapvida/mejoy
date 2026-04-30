-- Eventos de handoff MeJoy -> ZapVida para rastreabilidade clínica-operacional

CREATE TABLE IF NOT EXISTS public.handoff_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handoff_id text NOT NULL,
  status text NOT NULL,
  event_name text,
  triage_id text NOT NULL,
  report_id text,
  order_id text,
  patient_id text,
  program_slug text NOT NULL DEFAULT 'emagrecimento',
  recommended_queue text,
  source_system text NOT NULL DEFAULT 'mejoy',
  target_system text NOT NULL DEFAULT 'zapvida',
  consent_status text,
  utm jsonb NOT NULL DEFAULT '{}'::jsonb,
  identity jsonb NOT NULL DEFAULT '{}'::jsonb,
  envelope jsonb NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_handoff_events_handoff_id
  ON public.handoff_events(handoff_id);

CREATE INDEX IF NOT EXISTS idx_handoff_events_status
  ON public.handoff_events(status);

CREATE INDEX IF NOT EXISTS idx_handoff_events_created_at
  ON public.handoff_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_handoff_events_program_slug
  ON public.handoff_events(program_slug);

COMMENT ON TABLE public.handoff_events IS 'Rastreamento de handoff entre MeJoy, ZapVida e etapas pós-clínicas';
