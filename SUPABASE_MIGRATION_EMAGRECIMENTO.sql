-- ============================================
-- MIGRAÇÃO SUPABASE - FLUXO EMAGRECIMENTO
-- Execute no Supabase SQL Editor
-- ============================================

-- Tabela de perfis (clientes)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT UNIQUE,
  name TEXT,
  sex TEXT,
  whatsapp TEXT,
  email TEXT,
  birth_date DATE,
  weight_kg NUMERIC,
  height_cm NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para perfis
CREATE INDEX IF NOT EXISTS idx_profiles_client_id ON profiles(client_id);

-- Tabela de sessões de triagem
CREATE TABLE IF NOT EXISTS triage_sessions (
  triage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  triage_slug TEXT NOT NULL,
  answers JSONB DEFAULT '{}',
  profile_snapshot JSONB,
  progress_percent INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para sessões
CREATE INDEX IF NOT EXISTS idx_triage_sessions_client_id ON triage_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_triage_sessions_slug ON triage_sessions(triage_slug);
CREATE INDEX IF NOT EXISTS idx_triage_sessions_completed ON triage_sessions(completed_at);

-- Tabela de relatórios (triage_reports - nome usado pelo código)
-- O código usa 'report_data' ao inserir em finalize.ts linha 121
CREATE TABLE IF NOT EXISTS triage_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  triage_id UUID UNIQUE REFERENCES triage_sessions(triage_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  sections JSONB,
  report_data JSONB,
  summary TEXT,
  audio_url TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para relatórios
CREATE INDEX IF NOT EXISTS idx_triage_reports_status ON triage_reports(status);
CREATE INDEX IF NOT EXISTS idx_triage_reports_triage_id ON triage_reports(triage_id);

-- Tabela de steps da triagem (opcional, para histórico)
CREATE TABLE IF NOT EXISTS triage_steps (
  triage_id UUID REFERENCES triage_sessions(triage_id) ON DELETE CASCADE,
  step_key TEXT NOT NULL,
  answer JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (triage_id, step_key)
);

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_steps ENABLE ROW LEVEL SECURITY;

-- Política para profiles: Service role pode tudo
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
CREATE POLICY "Service role can manage profiles"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role');

-- Política para triage_sessions: Service role pode tudo
DROP POLICY IF EXISTS "Service role can manage triage_sessions" ON triage_sessions;
CREATE POLICY "Service role can manage triage_sessions"
  ON triage_sessions FOR ALL
  USING (auth.role() = 'service_role');

-- Política para triage_reports: Service role pode tudo
DROP POLICY IF EXISTS "Service role can manage triage_reports" ON triage_reports;
CREATE POLICY "Service role can manage triage_reports"
  ON triage_reports FOR ALL
  USING (auth.role() = 'service_role');

-- Política para triage_steps: Service role pode tudo
DROP POLICY IF EXISTS "Service role can manage triage_steps" ON triage_steps;
CREATE POLICY "Service role can manage triage_steps"
  ON triage_steps FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Verificar se as tabelas foram criadas
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'triage_sessions', 'triage_reports', 'triage_steps')
ORDER BY table_name;

-- Verificar estrutura das tabelas criadas
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'triage_sessions'
ORDER BY ordinal_position;

