CREATE TABLE IF NOT EXISTS "report_requests" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "report_requests_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "report_requests_key_key" UNIQUE ("key")
);

CREATE TABLE IF NOT EXISTS "api_quota" (
  "id" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "route" TEXT NOT NULL,
  "ts" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "api_quota_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "api_quota_clientId_route_idx" ON "api_quota"("clientId", "route");
CREATE INDEX IF NOT EXISTS "api_quota_ts_idx" ON "api_quota"("ts");
