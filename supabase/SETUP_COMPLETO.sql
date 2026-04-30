-- ============================================
-- SETUP COMPLETO SUPABASE - ZAPFARM
-- Execute este SQL completo no Supabase SQL Editor
-- ============================================

-- 1. Criar tabela profiles (Perfis de usuários)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text UNIQUE,
  name text,
  email text,
  whatsapp text,
  sex text CHECK (sex IN ('male','female','undisclosed')),
  birth_date date,
  weight_kg numeric,
  height_cm numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Criar tabela triage_sessions (Sessões de triagem)
CREATE TABLE IF NOT EXISTS public.triage_sessions (
  triage_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  triage_slug text NOT NULL,
  answers jsonb DEFAULT '{}'::jsonb,
  profile_snapshot jsonb,
  progress_percent integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Criar índices para triage_sessions
CREATE INDEX IF NOT EXISTS triage_sessions_client_idx ON public.triage_sessions(client_id);
CREATE INDEX IF NOT EXISTS triage_sessions_slug_idx ON public.triage_sessions(triage_slug);
CREATE INDEX IF NOT EXISTS triage_sessions_completed_idx ON public.triage_sessions(completed_at) WHERE completed_at IS NOT NULL;

-- 4. Criar tabela triage_steps (Passos individuais da triagem)
CREATE TABLE IF NOT EXISTS public.triage_steps (
  triage_id uuid REFERENCES public.triage_sessions(triage_id) ON DELETE CASCADE,
  step_key text,
  answer jsonb,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (triage_id, step_key)
);

-- 5. Criar tabela reports (Relatórios - compatibilidade)
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  triage_id uuid UNIQUE REFERENCES public.triage_sessions(triage_id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending','running','completed','failed')) DEFAULT 'pending',
  sections jsonb,
  summary text,
  audio_url text,
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reports_status_idx ON public.reports(status);
CREATE INDEX IF NOT EXISTS reports_triage_id_idx ON public.reports(triage_id);

-- 6. Criar tabela triage_reports (Relatórios - usado pelo código atual)
CREATE TABLE IF NOT EXISTS public.triage_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  triage_id uuid UNIQUE REFERENCES public.triage_sessions(triage_id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending','running','completed','failed')) DEFAULT 'pending',
  sections jsonb,
  summary text,
  audio_url text,
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS triage_reports_status_idx ON public.triage_reports(status);
CREATE INDEX IF NOT EXISTS triage_reports_triage_id_idx ON public.triage_reports(triage_id);

-- 7. Criar tabela lgpd_consents (Consentimentos LGPD)
CREATE TABLE IF NOT EXISTS public.lgpd_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  consent_at timestamptz NOT NULL,
  policy_version text NOT NULL,
  ip_hash text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lgpd_consents_user_id_idx ON public.lgpd_consents(user_id);
CREATE INDEX IF NOT EXISTS lgpd_consents_consent_at_idx ON public.lgpd_consents(consent_at);

-- ============================================
-- VALIDAÇÃO - Verificar se tudo foi criado
-- ============================================

-- Verificar tabelas criadas
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports', 'lgpd_consents')
ORDER BY table_name;

-- Verificar índices criados
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports', 'lgpd_consents')
ORDER BY tablename, indexname;

-- Verificar constraints (foreign keys)
SELECT
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public'
  AND tc.table_name IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports')
ORDER BY tc.table_name, tc.constraint_type;

