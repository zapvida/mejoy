-- ============================================
-- VERIFICAÇÃO FINAL - ESTRUTURA COMPLETA
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. Verificar estrutura da tabela triage_reports (CRÍTICO)
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'triage_reports'
ORDER BY ordinal_position;

-- 2. Verificar se a coluna report_data existe (obrigatória)
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'triage_reports'
  AND column_name = 'report_data';

-- 3. Verificar todas as políticas RLS criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'triage_sessions', 'triage_reports', 'triage_steps')
ORDER BY tablename, policyname;

-- 4. Verificar índices criados
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'triage_sessions', 'triage_reports', 'triage_steps')
ORDER BY tablename, indexname;
