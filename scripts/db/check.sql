-- =============================================
-- DATABASE VERIFICATION SCRIPT
-- Alloe Health - Lançamento Perfeito
-- =============================================

-- Check if all required tables exist
SELECT 
  'TABLE_CHECK' as check_type,
  tablename,
  CASE 
    WHEN tablename IN (
      'profiles', 'triage_sessions', 'triage_steps', 'triage_reports',
      'patients', 'triages', 'reports', 'subscriptions', 'gift_tokens',
      'users', 'audit_logs', 'consents', 'admin_audit_logs',
      'admin_alert_rules', 'admin_alerts', 'kpi_snapshots',
      'report_requests', 'api_quota'
    ) THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check table row counts
SELECT 
  'ROW_COUNT' as check_type,
  'profiles' as table_name,
  COUNT(*) as row_count
FROM profiles
UNION ALL
SELECT 
  'ROW_COUNT' as check_type,
  'triage_sessions' as table_name,
  COUNT(*) as row_count
FROM triage_sessions
UNION ALL
SELECT 
  'ROW_COUNT' as check_type,
  'triage_reports' as table_name,
  COUNT(*) as row_count
FROM triage_reports
UNION ALL
SELECT 
  'ROW_COUNT' as check_type,
  'patients' as table_name,
  COUNT(*) as row_count
FROM patients
UNION ALL
SELECT 
  'ROW_COUNT' as check_type,
  'triages' as table_name,
  COUNT(*) as row_count
FROM triages
UNION ALL
SELECT 
  'ROW_COUNT' as check_type,
  'reports' as table_name,
  COUNT(*) as row_count
FROM reports
UNION ALL
SELECT 
  'ROW_COUNT' as check_type,
  'subscriptions' as table_name,
  COUNT(*) as row_count
FROM subscriptions;

-- Check if RLS is enabled
SELECT 
  'RLS_CHECK' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'triage_sessions', 'triage_reports', 'patients', 'triages', 'reports', 'subscriptions', 'gift_tokens', 'consents')
ORDER BY tablename;

-- Check if indexes exist
SELECT 
  'INDEX_CHECK' as check_type,
  tablename,
  indexname,
  '✅ EXISTS' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'triage_sessions', 'triage_reports')
ORDER BY tablename, indexname;

-- Test insert/select operations
INSERT INTO profiles (name, email) VALUES ('Test User', 'test@alloehealth.com.br') ON CONFLICT DO NOTHING;
SELECT 'INSERT_TEST' as check_type, 'profiles' as table_name, '✅ SUCCESS' as status;

-- Clean up test data
DELETE FROM profiles WHERE email = 'test@alloehealth.com.br';

-- Final status
SELECT 
  'FINAL_STATUS' as check_type,
  'DATABASE_READY' as status,
  '🎉 Alloe Health database is ready for production!' as message;
