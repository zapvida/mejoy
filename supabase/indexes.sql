-- Supabase Indexes for Performance
-- Execute este arquivo no Supabase SQL Editor ou via psql

-- Índices para consultas mais frequentes
CREATE INDEX IF NOT EXISTS idx_patient_email ON "Patient"("email");
CREATE INDEX IF NOT EXISTS idx_patient_session_id ON "Patient"("sessionId");
CREATE INDEX IF NOT EXISTS idx_patient_deleted_at ON "Patient"("deletedAt");

-- Índices para Triage
CREATE INDEX IF NOT EXISTS idx_triage_patient_id ON "Triage"("patientId");
CREATE INDEX IF NOT EXISTS idx_triage_type ON "Triage"("type");
CREATE INDEX IF NOT EXISTS idx_triage_status ON "Triage"("status");
CREATE INDEX IF NOT EXISTS idx_triage_created_at ON "Triage"("created_at");
CREATE INDEX IF NOT EXISTS idx_triage_patient_type ON "Triage"("patientId", "type");

-- Índices para Report
CREATE INDEX IF NOT EXISTS idx_report_patient_id ON "Report"("patientId");
CREATE INDEX IF NOT EXISTS idx_report_triage_id ON "Report"("triageId");
CREATE INDEX IF NOT EXISTS idx_report_type ON "Report"("type");
CREATE INDEX IF NOT EXISTS idx_report_status ON "Report"("status");
CREATE INDEX IF NOT EXISTS idx_report_created_at ON "Report"("created_at");
CREATE INDEX IF NOT EXISTS idx_report_patient_created ON "Report"("patientId", "created_at");

-- Índices para Subscription
CREATE INDEX IF NOT EXISTS idx_subscription_user_id ON "Subscription"("userId");
CREATE INDEX IF NOT EXISTS idx_subscription_status ON "Subscription"("status");
CREATE INDEX IF NOT EXISTS idx_subscription_active_until ON "Subscription"("activeUntil");
CREATE INDEX IF NOT EXISTS idx_subscription_user_status ON "Subscription"("userId", "status");
CREATE INDEX IF NOT EXISTS idx_subscription_stripe_id ON "Subscription"("stripeSubscriptionId");

-- Índices para Gift
CREATE INDEX IF NOT EXISTS idx_gift_code ON "Gift"("code");
CREATE INDEX IF NOT EXISTS idx_gift_giver_user_id ON "Gift"("giverUserId");
CREATE INDEX IF NOT EXISTS idx_gift_redeemed_by_user_id ON "Gift"("redeemedByUserId");
CREATE INDEX IF NOT EXISTS idx_gift_redeemed_at ON "Gift"("redeemedAt");
CREATE INDEX IF NOT EXISTS idx_gift_stripe_session_id ON "Gift"("stripeSessionId");

-- Índices compostos para consultas complexas
CREATE INDEX IF NOT EXISTS idx_patient_email_deleted ON "Patient"("email", "deletedAt");
CREATE INDEX IF NOT EXISTS idx_triage_patient_status ON "Triage"("patientId", "status");
CREATE INDEX IF NOT EXISTS idx_report_patient_status ON "Report"("patientId", "status");

-- Índices para ordenação
CREATE INDEX IF NOT EXISTS idx_triage_created_desc ON "Triage"("created_at" DESC);
CREATE INDEX IF NOT EXISTS idx_report_created_desc ON "Report"("created_at" DESC);
CREATE INDEX IF NOT EXISTS idx_gift_created_desc ON "Gift"("created_at" DESC);
