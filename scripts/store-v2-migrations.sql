-- =============================================================================
-- STORE V2 — Migrations SQL (idempotente, copiar e colar no cliente SQL)
-- Banco: PostgreSQL (Supabase, Neon, etc.)
-- Uso: Cole no SQL Editor e execute. Pode rodar mais de uma vez (IF NOT EXISTS).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) MODELOS BASE (store_v2_products, carts, orders, etc.)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "store_v2_products" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "description" TEXT,
    "shortBenefit" TEXT,
    "activeIngredients" TEXT,
    "formDisplay" TEXT,
    "formKey" TEXT,
    "packSizeDisplay" TEXT,
    "objective" TEXT NOT NULL,
    "category" TEXT,
    "requiresRx" BOOLEAN NOT NULL DEFAULT false,
    "requiresValidation" BOOLEAN NOT NULL DEFAULT false,
    "canSubscribe" BOOLEAN NOT NULL DEFAULT true,
    "subscribeDiscountPct" INTEGER,
    "subscriptionPlanDefault" TEXT,
    "leadTimeDays" INTEGER NOT NULL DEFAULT 2,
    "shippingClass" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "whatsappFlow" TEXT,
    "builderTemplateId" TEXT,
    "upsellParametrizado" BOOLEAN NOT NULL DEFAULT false,
    "priorityRank" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "store_v2_products_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "store_v2_products_sku_key" ON "store_v2_products"("sku");
CREATE UNIQUE INDEX IF NOT EXISTS "store_v2_products_slug_key" ON "store_v2_products"("slug");
CREATE INDEX IF NOT EXISTS "store_v2_products_slug_idx" ON "store_v2_products"("slug");
CREATE INDEX IF NOT EXISTS "store_v2_products_objective_idx" ON "store_v2_products"("objective");
CREATE INDEX IF NOT EXISTS "store_v2_products_status_idx" ON "store_v2_products"("status");

CREATE TABLE IF NOT EXISTS "store_v2_product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT,
    "priceCents" INTEGER,
    "stock" INTEGER,
    CONSTRAINT "store_v2_product_variants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "store_v2_product_variants_sku_key" ON "store_v2_product_variants"("sku");
CREATE INDEX IF NOT EXISTS "store_v2_product_variants_productId_idx" ON "store_v2_product_variants"("productId");

CREATE TABLE IF NOT EXISTS "store_v2_price_versions" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "compareAtCents" INTEGER,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3),
    CONSTRAINT "store_v2_price_versions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "store_v2_price_versions_productId_idx" ON "store_v2_price_versions"("productId");
CREATE INDEX IF NOT EXISTS "store_v2_price_versions_validFrom_validTo_idx" ON "store_v2_price_versions"("validFrom", "validTo");

CREATE TABLE IF NOT EXISTS "store_v2_product_reviews" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "profileId" TEXT,
    "rating" INTEGER NOT NULL,
    "body" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "store_v2_product_reviews_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "store_v2_product_reviews_productId_idx" ON "store_v2_product_reviews"("productId");

CREATE TABLE IF NOT EXISTS "store_v2_carts" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "profileId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "store_v2_carts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "store_v2_carts_sessionId_key" ON "store_v2_carts"("sessionId");
CREATE UNIQUE INDEX IF NOT EXISTS "store_v2_carts_profileId_key" ON "store_v2_carts"("profileId");

CREATE TABLE IF NOT EXISTS "store_v2_cart_items" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isSubscription" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "store_v2_cart_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "store_v2_cart_items_cartId_idx" ON "store_v2_cart_items"("cartId");

CREATE TABLE IF NOT EXISTS "store_v2_orders" (
    "id" TEXT NOT NULL,
    "profileId" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerCpf" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    "paymentMethod" TEXT,
    "pagarmePaymentId" TEXT,
    "totalCents" INTEGER NOT NULL,
    "shippingCents" INTEGER NOT NULL DEFAULT 0,
    "shippingAddress" JSONB,
    "shippingCep" TEXT,
    "shippingDays" INTEGER,
    "shippingRegion" TEXT,
    "requiresRxValidation" BOOLEAN NOT NULL DEFAULT false,
    "rxValidationStatus" TEXT,
    "snapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "store_v2_orders_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "store_v2_orders_pagarmePaymentId_key" ON "store_v2_orders"("pagarmePaymentId");
CREATE INDEX IF NOT EXISTS "store_v2_orders_profileId_idx" ON "store_v2_orders"("profileId");
CREATE INDEX IF NOT EXISTS "store_v2_orders_status_idx" ON "store_v2_orders"("status");
CREATE INDEX IF NOT EXISTS "store_v2_orders_pagarmePaymentId_idx" ON "store_v2_orders"("pagarmePaymentId");

CREATE TABLE IF NOT EXISTS "store_v2_order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "isSubscription" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "store_v2_order_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "store_v2_order_items_orderId_idx" ON "store_v2_order_items"("orderId");

CREATE TABLE IF NOT EXISTS "store_v2_product_subscriptions" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "interval" TEXT NOT NULL DEFAULT 'monthly',
    "discountPct" INTEGER,
    "pagarmeSubId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "nextChargeAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "store_v2_product_subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "store_v2_product_subscriptions_profileId_idx" ON "store_v2_product_subscriptions"("profileId");
CREATE INDEX IF NOT EXISTS "store_v2_product_subscriptions_productId_idx" ON "store_v2_product_subscriptions"("productId");

-- FKs (ignora se já existir)
DO $$ BEGIN
    ALTER TABLE "store_v2_product_variants" ADD CONSTRAINT "store_v2_product_variants_productId_fkey"
        FOREIGN KEY ("productId") REFERENCES "store_v2_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
    ALTER TABLE "store_v2_price_versions" ADD CONSTRAINT "store_v2_price_versions_productId_fkey"
        FOREIGN KEY ("productId") REFERENCES "store_v2_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
    ALTER TABLE "store_v2_product_reviews" ADD CONSTRAINT "store_v2_product_reviews_productId_fkey"
        FOREIGN KEY ("productId") REFERENCES "store_v2_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
    ALTER TABLE "store_v2_cart_items" ADD CONSTRAINT "store_v2_cart_items_cartId_fkey"
        FOREIGN KEY ("cartId") REFERENCES "store_v2_carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
    ALTER TABLE "store_v2_order_items" ADD CONSTRAINT "store_v2_order_items_orderId_fkey"
        FOREIGN KEY ("orderId") REFERENCES "store_v2_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 2) ASAAS PAYMENT ID (store_v2_orders)
-- -----------------------------------------------------------------------------

ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "asaasPaymentId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "store_v2_orders_asaasPaymentId_key" ON "store_v2_orders"("asaasPaymentId");
CREATE INDEX IF NOT EXISTS "store_v2_orders_asaasPaymentId_idx" ON "store_v2_orders"("asaasPaymentId");

-- -----------------------------------------------------------------------------
-- 3) WEBHOOK EVENTS (idempotência)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "store_v2_webhook_events" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "store_v2_webhook_events_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "store_v2_webhook_events_eventId_key" ON "store_v2_webhook_events"("eventId");
CREATE INDEX IF NOT EXISTS "store_v2_webhook_events_provider_eventId_idx" ON "store_v2_webhook_events"("provider", "eventId");

-- -----------------------------------------------------------------------------
-- 4) RX SUBMISSIONS (receita/validação)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "store_v2_rx_submissions" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "uploadedFiles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "store_v2_rx_submissions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "store_v2_rx_submissions_orderId_idx" ON "store_v2_rx_submissions"("orderId");

-- -----------------------------------------------------------------------------
-- 5) TRACKING + AUDIT (admin operacional)
-- -----------------------------------------------------------------------------

ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "trackingCode" TEXT;
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "trackingUrl" TEXT;
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "shippedAt" TIMESTAMP(3);
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "deliveredAt" TIMESTAMP(3);
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "updatedByAdminId" TEXT;
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "shippedNotificationSentAt" TIMESTAMP(3);
ALTER TABLE "store_v2_orders" ADD COLUMN IF NOT EXISTS "deliveredNotificationSentAt" TIMESTAMP(3);
CREATE INDEX IF NOT EXISTS "store_v2_orders_customerEmail_idx" ON "store_v2_orders"("customerEmail");

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
CREATE INDEX IF NOT EXISTS "store_v2_admin_audit_logs_orderId_idx" ON "store_v2_admin_audit_logs"("orderId");

-- =============================================================================
-- FIM — Store V2 migrations aplicadas
-- =============================================================================
