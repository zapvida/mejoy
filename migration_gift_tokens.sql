-- Migração para criar tabela GiftToken e atualizar Subscription
-- Execute este SQL no Supabase Dashboard > SQL Editor

-- Criar tabela GiftToken
CREATE TABLE IF NOT EXISTS "GiftToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issuerUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'issued',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "redeemedByUserId" TEXT,
    "redeemedAt" TIMESTAMP(3),
    "stripeSessionId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para GiftToken
CREATE INDEX IF NOT EXISTS "GiftToken_issuerUserId_idx" ON "GiftToken"("issuerUserId");
CREATE INDEX IF NOT EXISTS "GiftToken_status_idx" ON "GiftToken"("status");
CREATE INDEX IF NOT EXISTS "GiftToken_expiresAt_idx" ON "GiftToken"("expiresAt");
CREATE INDEX IF NOT EXISTS "GiftToken_redeemedAt_idx" ON "GiftToken"("redeemedAt");

-- Adicionar campos na tabela Subscription (se não existirem)
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "planType" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "planPrice" TEXT;

-- Adicionar foreign keys para GiftToken
ALTER TABLE "GiftToken" ADD CONSTRAINT IF NOT EXISTS "GiftToken_issuerUserId_fkey" 
    FOREIGN KEY ("issuerUserId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GiftToken" ADD CONSTRAINT IF NOT EXISTS "GiftToken_redeemedByUserId_fkey" 
    FOREIGN KEY ("redeemedByUserId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Verificar se as tabelas foram criadas corretamente
SELECT 'GiftToken table created successfully' as status;
SELECT 'Subscription table updated successfully' as status;
