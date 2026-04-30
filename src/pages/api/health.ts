// BEGIN health check
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const started = Date.now();
  
  // pequeno "mock" de render PDF v2 sem IO pesado:
  const pdfV2Enabled = process.env.PDF_V2 === "1";
  const copyOverhaulEnabled = process.env.NEXT_PUBLIC_COPY_OVERHAUL === "1";
  const stickyCtaEnabled = process.env.NEXT_PUBLIC_STICKY_CTA_GI === "1";
  const reportEnhancedEnabled = process.env.NEXT_PUBLIC_REPORT_ENHANCED === "1";
  const ctaOrderDynamicEnabled = process.env.NEXT_PUBLIC_CTA_ORDER_DYNAMIC === "1";
  const ttsEnabled = process.env.TTS_ENABLED === "1";
  
  const storeV2Enabled =
    process.env.STORE_V2 === "1" || process.env.NEXT_PUBLIC_STORE_V2 === "1";

  const ok = true;

  return res.status(200).json({
    ok,
    timestamp: new Date().toISOString(),
    timeMs: Date.now() - started,
    features: {
      pdfV2Enabled,
      copyOverhaulEnabled,
      stickyCtaEnabled,
      reportEnhancedEnabled,
      ctaOrderDynamicEnabled,
      ttsEnabled,
      storeV2Enabled,
    },
    environment: process.env.NODE_ENV || "development",
    version: "2.0.0",
  });
}
// END