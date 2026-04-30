-- AlterTable
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "trackingCode" TEXT;
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "trackingUrl" TEXT;
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "shippedAt" TIMESTAMP(3);
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "deliveredAt" TIMESTAMP(3);
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "updatedByAdminId" TEXT;
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "shippedNotificationSentAt" TIMESTAMP(3);
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "deliveredNotificationSentAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "store_v2_orders_customerEmail_idx" ON "store_v2_orders"("customerEmail");

-- CreateTable
CREATE TABLE IF NOT EXISTS "store_v2_admin_audit_logs" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_v2_admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "store_v2_admin_audit_logs_orderId_idx" ON "store_v2_admin_audit_logs"("orderId");
