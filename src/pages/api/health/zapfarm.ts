/**
 * Health check ZapFarm
 * Retorna 200 somente se todas as env vars de preço obrigatórias existem.
 * Se flags variants/bundles/subscription estiverem ON, exige envs extras correspondentes.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getEnvPriceCents,
  normalizeProductKey,
  ZAPFARM_PRODUCT_SLUGS,
} from '@/lib/zapfarm/price-resolver';
import { ZAPFARM_VARIANTS, ZAPFARM_BUNDLES, ZAPFARM_SUBSCRIPTION } from '@/lib/flags';

const PLANS = ['basico', 'completo', 'premium'] as const;

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const started = Date.now();
  const missing: string[] = [];
  const source = process.env.ZAPFARM_PRICE_SOURCE ?? 'env';

  for (const slug of ZAPFARM_PRODUCT_SLUGS) {
    for (const plan of PLANS) {
      const cents = getEnvPriceCents(slug, plan);
      if (cents === null) {
        const envKey = normalizeProductKey(slug);
        missing.push(`ASAAS_PRICE_${envKey}_${plan.toUpperCase()}`);
      }
    }
  }

  if (ZAPFARM_VARIANTS) {
    for (const slug of ZAPFARM_PRODUCT_SLUGS) {
      for (const plan of PLANS) {
        for (const variant of ['core', 'pro'] as const) {
          const cents = getEnvPriceCents(slug, plan, variant);
          if (cents === null) {
            const envKey = normalizeProductKey(slug);
            missing.push(`ASAAS_PRICE_${envKey}_${variant.toUpperCase()}_${plan.toUpperCase()}`);
          }
        }
      }
    }
  }

  if (ZAPFARM_BUNDLES) {
    const bundleVars = ['ASAAS_PRICE_BUNDLE_SONO_ANSIEDADE', 'ASAAS_PRICE_BUNDLE_INTESTINO_IMUNIDADE'];
    for (const varName of bundleVars) {
      const val = process.env[varName];
      if (!val || isNaN(parseInt(val, 10))) {
        missing.push(varName);
      }
    }
  }

  const ok = source !== 'env' || missing.length === 0;

  // Evolution/Zapvidax: verifica se envs estão configuradas (não bloqueia 200)
  const evolution = {
    enabled: process.env.EVOLUTION_MAGIC_LINK_ENABLED === 'true' || process.env.EVOLUTION_MAGIC_LINK_ENABLED === '1',
    hasUrl: !!process.env.EVOLUTION_API_URL,
    hasInstance: !!process.env.EVOLUTION_INSTANCE,
    hasKey: !!process.env.EVOLUTION_API_KEY,
    ready: (process.env.EVOLUTION_MAGIC_LINK_ENABLED === 'true' || process.env.EVOLUTION_MAGIC_LINK_ENABLED === '1') &&
      !!process.env.EVOLUTION_API_URL &&
      !!process.env.EVOLUTION_API_KEY,
  };

  return res.status(ok ? 200 : 503).json({
    ok,
    timestamp: new Date().toISOString(),
    timeMs: Date.now() - started,
    source,
    flags: {
      variants: ZAPFARM_VARIANTS,
      bundles: ZAPFARM_BUNDLES,
      subscription: ZAPFARM_SUBSCRIPTION,
    },
    evolution,
    missing,
  });
}
