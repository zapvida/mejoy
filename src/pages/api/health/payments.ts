/**
 * Health check pagamentos Store V2
 * Envs essenciais presentes (sem expor secrets), modo Asaas (prod/sandbox)
 */

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const started = Date.now();
  const storeV2Enabled = process.env.STORE_V2 === '1' || process.env.NEXT_PUBLIC_STORE_V2 === '1';

  if (!storeV2Enabled) {
    return res.status(200).json({
      ok: true,
      storeV2Enabled: false,
      message: 'Store V2 desabilitado',
      timestamp: new Date().toISOString(),
      timeMs: Date.now() - started,
    });
  }

  const hasAsaasKey = !!process.env.ASAAS_API_KEY;
  const asaasKeyLength = process.env.ASAAS_API_KEY?.length ?? 0;
  const isAsaasSandbox = process.env.ASAAS_API_KEY?.includes('sandbox') ?? false;
  const hasWebhookToken = !!process.env.ASAAS_WEBHOOK_TOKEN;
  const hasAdminSecret = !!process.env.ADMIN_SECRET_KEY;
  const hasResend = !!process.env.RESEND_API_KEY;
  const hasDatabase = !!process.env.DATABASE_URL;

  const ok = hasAsaasKey && hasAdminSecret && hasResend && hasDatabase;

  return res.status(ok ? 200 : 503).json({
    ok,
    storeV2Enabled: true,
    asaas: {
      configured: hasAsaasKey,
      mode: isAsaasSandbox ? 'sandbox' : 'production',
      keyLength: asaasKeyLength,
    },
    webhookToken: hasWebhookToken,
    adminSecret: hasAdminSecret,
    resend: hasResend,
    database: hasDatabase,
    timestamp: new Date().toISOString(),
    timeMs: Date.now() - started,
  });
}
