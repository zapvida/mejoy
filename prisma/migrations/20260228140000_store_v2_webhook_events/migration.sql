-- WebhookEvent para idempotência
CREATE TABLE IF NOT EXISTS "store_v2_webhook_events" (
  "id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "store_v2_webhook_events_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "store_v2_webhook_events_eventId_key" ON "store_v2_webhook_events"("eventId");
CREATE INDEX IF NOT EXISTS "store_v2_webhook_events_provider_eventId_idx" ON "store_v2_webhook_events"("provider", "eventId");
