-- ============================================
-- VALIDAÇÃO COMPLETA - Verificar Setup
-- Execute este SQL após o SETUP_COMPLETO.sql
-- ============================================

-- 1. Verificar se todas as tabelas foram criadas
SELECT 
  '✅ Tabelas criadas:' as status,
  COUNT(*) as total_tabelas
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports', 'lgpd_consents');

-- 2. Listar todas as tabelas e suas colunas principais
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports', 'lgpd_consents')
ORDER BY table_name, ordinal_position;

-- 3. Verificar índices criados
SELECT 
  '✅ Índices criados:' as status,
  COUNT(*) as total_indices
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports', 'lgpd_consents');

-- 4. Verificar foreign keys (relacionamentos)
SELECT 
  '✅ Foreign Keys:' as status,
  COUNT(*) as total_fks
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
  AND table_schema = 'public'
  AND table_name IN ('triage_sessions', 'triage_steps', 'reports', 'triage_reports');

-- 5. Testar inserção de dados de exemplo (opcional - pode deletar depois)
-- Descomente as linhas abaixo para testar:

/*
-- Teste 1: Inserir perfil
INSERT INTO public.profiles (client_id, name, sex, weight_kg, height_cm)
VALUES ('test-client-123', 'Joana Teste', 'female', 85, 155)
RETURNING id, name, weight_kg, height_cm;

-- Teste 2: Inserir sessão de triagem
INSERT INTO public.triage_sessions (client_id, triage_slug, answers, profile_snapshot)
VALUES (
  'test-client-123',
  'emagrecimento',
  '{"peso": 85, "altura": 155, "name": "Joana Teste"}'::jsonb,
  '{"name": "Joana Teste", "weight_kg": 85, "height_cm": 155, "sex": "female"}'::jsonb
)
RETURNING triage_id, triage_slug, profile_snapshot;

-- Limpar dados de teste (execute depois de verificar)
-- DELETE FROM public.triage_sessions WHERE client_id = 'test-client-123';
-- DELETE FROM public.profiles WHERE client_id = 'test-client-123';
*/

-- 6. Resumo final
SELECT 
  '🎯 RESUMO FINAL' as titulo,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports', 'lgpd_consents')) as tabelas_criadas,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND tablename IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports', 'lgpd_consents')) as indices_criados,
  (SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public' AND table_name IN ('triage_sessions', 'triage_steps', 'reports', 'triage_reports')) as foreign_keys;

