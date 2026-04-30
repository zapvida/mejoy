-- Migração: Substituir Stripe por Asaas
-- Execute este script após fazer backup do banco de dados

-- 1. Atualizar tabela zapfarm_orders
-- Renomear colunas do Stripe para Asaas
ALTER TABLE zapfarm_orders 
  RENAME COLUMN "stripeSessionId" TO "asaasPaymentId";

ALTER TABLE zapfarm_orders 
  DROP COLUMN IF EXISTS "stripePaymentIntentId";

ALTER TABLE zapfarm_orders 
  ADD COLUMN IF NOT EXISTS "asaasCustomerId" TEXT;

ALTER TABLE zapfarm_orders 
  ADD COLUMN IF NOT EXISTS "billingType" TEXT;

-- Atualizar índices
DROP INDEX IF EXISTS "zapfarm_orders_stripeSessionId_key";
CREATE UNIQUE INDEX IF NOT EXISTS "zapfarm_orders_asaasPaymentId_key" ON zapfarm_orders("asaasPaymentId");

DROP INDEX IF EXISTS "zapfarm_orders_stripeSessionId_idx";
CREATE INDEX IF NOT EXISTS "zapfarm_orders_asaasPaymentId_idx" ON zapfarm_orders("asaasPaymentId");

-- 2. Atualizar tabela Subscription
ALTER TABLE Subscription 
  RENAME COLUMN "stripeSubscriptionId" TO "asaasSubscriptionId";

ALTER TABLE Subscription 
  RENAME COLUMN "stripeCustomerId" TO "asaasCustomerId";

-- Atualizar índices
DROP INDEX IF EXISTS "Subscription_stripeSubscriptionId_idx";
CREATE INDEX IF NOT EXISTS "Subscription_asaasSubscriptionId_idx" ON Subscription("asaasSubscriptionId");

-- 3. Atualizar tabela GiftToken
ALTER TABLE GiftToken 
  RENAME COLUMN "stripeSessionId" TO "asaasPaymentId";

-- Nota: Os dados existentes do Stripe não serão migrados automaticamente
-- Você precisará criar novos pagamentos no Asaas para pedidos existentes se necessário

