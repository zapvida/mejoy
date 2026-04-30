-- ============================================
-- SQL PRONTO PARA COLAR NO SUPABASE SQL EDITOR
-- ============================================
-- Instruções:
-- 1. Abra Supabase Dashboard → SQL Editor
-- 2. Cole TODO este conteúdo
-- 3. Execute (botão Run ou Ctrl+Enter)
-- 4. Verifique se as tabelas foram criadas no Table Editor
-- ============================================

-- CreateTable: BrandingDraft (retenção 48h)
CREATE TABLE IF NOT EXISTS "BrandingDraft" (
    "id" TEXT NOT NULL,
    "logoUrl" TEXT,
    "brandColor" TEXT,
    "accentColor" TEXT,
    "fantasyName" TEXT,
    "ctaText" TEXT,
    "ctaUrl" TEXT,
    "whatsapp" TEXT,
    "desiredDomain" TEXT,
    "expiresAt" TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "BrandingDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Tenant
CREATE TABLE IF NOT EXISTS "Tenant" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "provisionalUrl" TEXT,
    "logoUrl" TEXT,
    "brandColor" TEXT,
    "accentColor" TEXT,
    "ctaText" TEXT,
    "ctaUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "ownerEmail" TEXT NOT NULL,
    "ownerName" TEXT,
    "ownerPhone" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BrandingDraft_expiresAt_idx" ON "BrandingDraft"("expiresAt");
CREATE INDEX IF NOT EXISTS "BrandingDraft_createdAt_idx" ON "BrandingDraft"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_slug_key" ON "Tenant"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_domain_key" ON "Tenant"("domain");
CREATE INDEX IF NOT EXISTS "Tenant_ownerEmail_idx" ON "Tenant"("ownerEmail");
CREATE INDEX IF NOT EXISTS "Tenant_status_idx" ON "Tenant"("status");
CREATE INDEX IF NOT EXISTS "Tenant_slug_idx" ON "Tenant"("slug");
CREATE INDEX IF NOT EXISTS "Tenant_createdAt_idx" ON "Tenant"("createdAt");

-- ============================================
-- VERIFICAÇÃO (opcional - execute após criar)
-- ============================================
-- SELECT table_name 
-- FROM information_schema.tables
-- WHERE table_schema='public' 
-- AND table_name IN ('BrandingDraft', 'Tenant');
-- ============================================

