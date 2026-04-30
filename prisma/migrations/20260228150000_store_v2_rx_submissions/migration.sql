-- RxSubmission para receita/validação
CREATE TABLE IF NOT EXISTS "store_v2_rx_submissions" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "payloadJson" JSONB NOT NULL,
  "uploadedFiles" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "store_v2_rx_submissions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "store_v2_rx_submissions_orderId_idx" ON "store_v2_rx_submissions"("orderId");
