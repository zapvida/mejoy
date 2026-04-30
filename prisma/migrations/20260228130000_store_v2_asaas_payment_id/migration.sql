-- Add asaasPaymentId to store_v2_orders for Asaas integration
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "asaasPaymentId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "store_v2_orders_asaasPaymentId_key" ON "store_v2_orders"("asaasPaymentId");
CREATE INDEX IF NOT EXISTS "store_v2_orders_asaasPaymentId_idx" ON "store_v2_orders"("asaasPaymentId");
