-- ============================================
-- VERIFICAÇÃO COMPLETA DAS TABELAS
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. Verificar se todas as 4 tabelas foram criadas
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'triage_sessions', 'triage_reports', 'triage_steps')
ORDER BY table_name;

-- 2. Verificar estrutura de cada tabela

-- Profiles
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Triage Sessions (você já verificou esta ✅)
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'triage_sessions'
ORDER BY ordinal_position;

-- Triage Reports
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'triage_reports'
ORDER BY ordinal_position;

-- Triage Steps
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'triage_steps'
ORDER BY ordinal_position;

-- 3. Verificar índices criados
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'triage_sessions', 'triage_reports', 'triage_steps')
ORDER BY tablename, indexname;

-- 4. Verificar RLS policies
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'triage_sessions', 'triage_reports', 'triage_steps')
ORDER BY tablename, policyname;

