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
    "expiresAt" TIMESTAMPTZ NOT NULL, -- Calculado na aplicação: createdAt + 48h
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

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BrandingDraft_createdAt_idx" ON "BrandingDraft"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_domain_key" ON "Tenant"("domain");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Tenant_ownerEmail_idx" ON "Tenant"("ownerEmail");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Tenant_status_idx" ON "Tenant"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Tenant_slug_idx" ON "Tenant"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Tenant_createdAt_idx" ON "Tenant"("createdAt");

