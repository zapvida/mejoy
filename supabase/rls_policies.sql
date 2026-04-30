-- Supabase RLS Policies
-- Execute este arquivo no Supabase SQL Editor ou via psql

-- Ativar RLS em todas as tabelas
ALTER TABLE "Patient" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Triage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Report" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Gift" ENABLE ROW LEVEL SECURITY;

-- Políticas para Patient
CREATE POLICY "read_own_patient" ON "Patient"
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "update_own_patient" ON "Patient"
  FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "insert_patient" ON "Patient"
  FOR INSERT WITH CHECK (true); -- Permitir criação de pacientes anônimos

-- Políticas para Triage
CREATE POLICY "read_own_triage" ON "Triage"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Patient" 
      WHERE "Patient".id = "Triage"."patientId" 
      AND "Patient".id = auth.uid()::text
    )
  );

CREATE POLICY "insert_own_triage" ON "Triage"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Patient" 
      WHERE "Patient".id = "Triage"."patientId" 
      AND "Patient".id = auth.uid()::text
    )
  );

CREATE POLICY "update_own_triage" ON "Triage"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM "Patient" 
      WHERE "Patient".id = "Triage"."patientId" 
      AND "Patient".id = auth.uid()::text
    )
  );

-- Políticas para Report
CREATE POLICY "read_own_report" ON "Report"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Patient" 
      WHERE "Patient".id = "Report"."patientId" 
      AND "Patient".id = auth.uid()::text
    )
  );

CREATE POLICY "insert_own_report" ON "Report"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Patient" 
      WHERE "Patient".id = "Report"."patientId" 
      AND "Patient".id = auth.uid()::text
    )
  );

CREATE POLICY "update_own_report" ON "Report"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM "Patient" 
      WHERE "Patient".id = "Report"."patientId" 
      AND "Patient".id = auth.uid()::text
    )
  );

-- Políticas para Subscription
CREATE POLICY "read_own_subscription" ON "Subscription"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Patient" 
      WHERE "Patient".id = "Subscription"."userId" 
      AND "Patient".id = auth.uid()::text
    )
  );

CREATE POLICY "insert_own_subscription" ON "Subscription"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Patient" 
      WHERE "Patient".id = "Subscription"."userId" 
      AND "Patient".id = auth.uid()::text
    )
  );

CREATE POLICY "update_own_subscription" ON "Subscription"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM "Patient" 
      WHERE "Patient".id = "Subscription"."userId" 
      AND "Patient".id = auth.uid()::text
    )
  );

-- Políticas para Gift
CREATE POLICY "read_own_gifts" ON "Gift"
  FOR SELECT USING (
    "giverUserId" = auth.uid()::text 
    OR "redeemedByUserId" = auth.uid()::text
  );

CREATE POLICY "insert_own_gift" ON "Gift"
  FOR INSERT WITH CHECK ("giverUserId" = auth.uid()::text);

CREATE POLICY "redeem_gift" ON "Gift"
  FOR UPDATE USING (
    "redeemedByUserId" = auth.uid()::text 
    AND "redeemedAt" IS NULL
  );

-- Política especial para webhooks (bypass RLS com service_role)
-- Nota: Webhooks Stripe usam service_role que bypassa RLS automaticamente
