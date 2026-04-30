-- =============================================
-- SUPABASE SCHEMA INITIALIZATION SCRIPT
-- Alloe Health - Lançamento Perfeito
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CORE TABLES
-- =============================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id TEXT UNIQUE,
  name TEXT,
  email TEXT,
  whatsapp TEXT,
  sex TEXT CHECK (sex IN ('male', 'female', 'undisclosed')),
  birth_date TIMESTAMPTZ,
  weight_kg DECIMAL(6,2),
  height_cm DECIMAL(6,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triage Sessions table
CREATE TABLE IF NOT EXISTS triage_sessions (
  triage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id TEXT,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  triage_slug TEXT NOT NULL,
  answers JSONB DEFAULT '{}'::jsonb,
  profile_snapshot JSONB,
  progress_percent INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triage Steps table
CREATE TABLE IF NOT EXISTS triage_steps (
  triage_id UUID REFERENCES triage_sessions(triage_id) ON DELETE CASCADE,
  step_key TEXT NOT NULL,
  answer JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (triage_id, step_key)
);

-- Triage Reports table (renamed from reports to avoid conflicts)
CREATE TABLE IF NOT EXISTS triage_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  triage_id UUID UNIQUE REFERENCES triage_sessions(triage_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  sections JSONB,
  summary TEXT,
  audio_url TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- LEGACY COMPATIBILITY TABLES
-- =============================================

-- Patients table (legacy)
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY DEFAULT 'cuid()',
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  whatsapp TEXT,
  birthdate TIMESTAMPTZ,
  sex TEXT,
  height_cm INTEGER,
  weight_kg DECIMAL(6,2),
  imc DECIMAL(4,1),
  session_id TEXT UNIQUE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triages table (legacy)
CREATE TABLE IF NOT EXISTS triages (
  id TEXT PRIMARY KEY DEFAULT 'cuid()',
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  form_data JSONB,
  status TEXT DEFAULT 'draft',
  nome TEXT,
  user_id TEXT,
  deleted_at TIMESTAMPTZ,
  session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table (legacy)
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY DEFAULT 'cuid()',
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  triage_id TEXT REFERENCES triages(id),
  type TEXT NOT NULL,
  score INTEGER,
  score_future INTEGER,
  summary JSONB,
  plan JSONB,
  raw_free TEXT,
  raw_premium TEXT,
  timeline JSONB,
  status TEXT DEFAULT 'active',
  user_id TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  markdown TEXT,
  audio_script TEXT,
  summary_text TEXT,
  red_flags JSONB,
  icd10_candidates JSONB,
  kind TEXT DEFAULT 'gastro',
  UNIQUE(triage_id)
);

-- =============================================
-- SUBSCRIPTION & PAYMENT TABLES
-- =============================================

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY DEFAULT 'cuid()',
  user_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('self', 'gift')),
  active_from TIMESTAMPTZ NOT NULL,
  active_until TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'cancelled')),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  amount DECIMAL(10,2),
  cancelled_at TIMESTAMPTZ,
  plan_type TEXT CHECK (plan_type IN ('monthly', 'yearly')),
  plan_price TEXT CHECK (plan_price IN ('29', '49')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gift Tokens table
CREATE TABLE IF NOT EXISTS gift_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issuer_user_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'issued' CHECK (status IN ('issued', 'redeemed', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  redeemed_by_user_id TEXT REFERENCES patients(id),
  redeemed_at TIMESTAMPTZ,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ADMIN & AUDIT TABLES
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT 'cuid()',
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY DEFAULT 'cuid()',
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consent table
CREATE TABLE IF NOT EXISTS consents (
  id TEXT PRIMARY KEY DEFAULT 'cuid()',
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('marketing', 'analytics', 'essential')),
  granted BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Audit Log table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id TEXT PRIMARY KEY DEFAULT 'cuid()',
  at TIMESTAMPTZ DEFAULT NOW(),
  actor_user_id TEXT NOT NULL,
  ip_hash TEXT,
  action TEXT NOT NULL,
  target TEXT,
  metadata JSONB
);

-- Admin Alert Rules table
CREATE TABLE IF NOT EXISTS admin_alert_rules (
  id TEXT PRIMARY KEY DEFAULT 'cuid()',
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  threshold FLOAT NOT NULL,
  window_min INTEGER NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('console', 'email', 'slack', 'whatsapp')),
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Alerts table
CREATE TABLE IF NOT EXISTS admin_alerts (
  id TEXT PRIMARY KEY DEFAULT 'cuid()',
  rule_id TEXT NOT NULL REFERENCES admin_alert_rules(id) ON DELETE CASCADE,
  at TIMESTAMPTZ DEFAULT NOW(),
  severity TEXT NOT NULL CHECK (severity IN ('P0', 'P1')),
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'acked', 'closed')),
  metadata JSONB
);

-- KPI Snapshots table
CREATE TABLE IF NOT EXISTS kpi_snapshots (
  id TEXT PRIMARY KEY DEFAULT 'cuid()',
  day TIMESTAMPTZ NOT NULL UNIQUE,
  mrr FLOAT NOT NULL,
  active_subs INTEGER NOT NULL,
  churn_30d FLOAT NOT NULL,
  arpu FLOAT NOT NULL,
  ltv FLOAT NOT NULL
);

-- =============================================
-- UTILITY TABLES
-- =============================================

-- Report Requests table
CREATE TABLE IF NOT EXISTS report_requests (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Quota table
CREATE TABLE IF NOT EXISTS api_quota (
  id BIGSERIAL PRIMARY KEY,
  client_id TEXT NOT NULL,
  route TEXT NOT NULL,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_client_id ON profiles(client_id);

-- Triage Sessions indexes
CREATE INDEX IF NOT EXISTS idx_triage_sessions_client_id ON triage_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_triage_sessions_triage_slug ON triage_sessions(triage_slug);
CREATE INDEX IF NOT EXISTS idx_triage_sessions_profile_id ON triage_sessions(profile_id);

-- Triage Reports indexes
CREATE INDEX IF NOT EXISTS idx_triage_reports_status ON triage_reports(status);
CREATE INDEX IF NOT EXISTS idx_triage_reports_triage_id ON triage_reports(triage_id);

-- Legacy tables indexes
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_deleted_at ON patients(deleted_at);
CREATE INDEX IF NOT EXISTS idx_triages_patient_id_type ON triages(patient_id, type);
CREATE INDEX IF NOT EXISTS idx_triages_user_id ON triages(user_id);
CREATE INDEX IF NOT EXISTS idx_triages_deleted_at ON triages(deleted_at);
CREATE INDEX IF NOT EXISTS idx_triages_session_id ON triages(session_id);
CREATE INDEX IF NOT EXISTS idx_reports_patient_id_created_at ON reports(patient_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_deleted_at ON reports(deleted_at);

-- Subscription indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id_status ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active_until ON subscriptions(active_until);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

-- Gift Tokens indexes
CREATE INDEX IF NOT EXISTS idx_gift_tokens_issuer_user_id ON gift_tokens(issuer_user_id);
CREATE INDEX IF NOT EXISTS idx_gift_tokens_status ON gift_tokens(status);
CREATE INDEX IF NOT EXISTS idx_gift_tokens_expires_at ON gift_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_gift_tokens_redeemed_at ON gift_tokens(redeemed_at);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Audit Log indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Consent indexes
CREATE INDEX IF NOT EXISTS idx_consents_user_id ON consents(user_id);
CREATE INDEX IF NOT EXISTS idx_consents_type ON consents(type);

-- Admin Audit Log indexes
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_actor_user_id ON admin_audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_at ON admin_audit_logs(at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON admin_audit_logs(action);

-- Admin Alert Rules indexes
CREATE INDEX IF NOT EXISTS idx_admin_alert_rules_key ON admin_alert_rules(key);
CREATE INDEX IF NOT EXISTS idx_admin_alert_rules_enabled ON admin_alert_rules(enabled);

-- Admin Alerts indexes
CREATE INDEX IF NOT EXISTS idx_admin_alerts_rule_id ON admin_alerts(rule_id);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_status ON admin_alerts(status);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_at ON admin_alerts(at);

-- KPI Snapshots indexes
CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_day ON kpi_snapshots(day);

-- API Quota indexes
CREATE INDEX IF NOT EXISTS idx_api_quota_window ON api_quota(client_id, route, occurred_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on sensitive tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE triages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access (server-side operations)
CREATE POLICY "Service role can do everything" ON profiles FOR ALL USING (true);
CREATE POLICY "Service role can do everything" ON triage_sessions FOR ALL USING (true);
CREATE POLICY "Service role can do everything" ON triage_reports FOR ALL USING (true);
CREATE POLICY "Service role can do everything" ON patients FOR ALL USING (true);
CREATE POLICY "Service role can do everything" ON triages FOR ALL USING (true);
CREATE POLICY "Service role can do everything" ON reports FOR ALL USING (true);
CREATE POLICY "Service role can do everything" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Service role can do everything" ON gift_tokens FOR ALL USING (true);
CREATE POLICY "Service role can do everything" ON consents FOR ALL USING (true);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if tables were created successfully
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'profiles', 'triage_sessions', 'triage_steps', 'triage_reports',
    'patients', 'triages', 'reports', 'subscriptions', 'gift_tokens',
    'users', 'audit_logs', 'consents', 'admin_audit_logs',
    'admin_alert_rules', 'admin_alerts', 'kpi_snapshots',
    'report_requests', 'api_quota'
  )
ORDER BY tablename;

-- Check indexes
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'triage_sessions', 'triage_reports')
ORDER BY tablename, indexname;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '🎉 SUPABASE SCHEMA INITIALIZED SUCCESSFULLY!';
  RAISE NOTICE '📊 Alloe Health database is ready for production';
  RAISE NOTICE '🚀 Tables created: profiles, triage_sessions, triage_reports, and legacy compatibility tables';
  RAISE NOTICE '🔒 RLS enabled on sensitive tables';
  RAISE NOTICE '⚡ Indexes created for optimal performance';
END $$;
