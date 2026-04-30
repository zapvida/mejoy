#!/usr/bin/env tsx
/**
 * Auditoria de preços ZapFarm
 * Valida que env vars ASAAS_PRICE_* existem para todos os produtos/planos.
 * Quando ZAPFARM_PRICE_SOURCE=env, falha se houver missing.
 * Opcional: compara com products.ts e reporta divergências.
 */

import {
  getEnvPriceCents,
  normalizeProductKey,
  ZAPFARM_PRODUCT_SLUGS,
} from '../../src/lib/zapfarm/price-resolver';
import { ZAPFARM_PRODUCTS } from '../../src/config/zapfarm/products';

const PLANS = ['basico', 'completo', 'premium'] as const;

function main() {
  const source = process.env.ZAPFARM_PRICE_SOURCE ?? 'env';
  const strict = source === 'env';
  let hasErrors = false;

  console.log('=== ZapFarm Price Audit ===');
  console.log(`ZAPFARM_PRICE_SOURCE=${source}`);
  console.log('');

  const missing: string[] = [];
  const divergences: Array<{ product: string; plan: string; envCents: number; productsTsReais: number }> = [];

  for (const slug of ZAPFARM_PRODUCT_SLUGS) {
    for (const plan of PLANS) {
      const envCents = getEnvPriceCents(slug, plan);
      const config = ZAPFARM_PRODUCTS[slug];
      const planConfig = config?.plans[plan];
      const productsTsReais = planConfig?.unitPrice;

      if (envCents === null) {
        const envKey = normalizeProductKey(slug);
        const varName = `ASAAS_PRICE_${envKey}_${plan.toUpperCase()}`;
        missing.push(varName);
      } else if (productsTsReais != null && typeof productsTsReais === 'number') {
        const productsTsCents = Math.round(productsTsReais * 100);
        if (Math.abs(envCents - productsTsCents) > 1) {
          divergences.push({ product: slug, plan, envCents, productsTsReais });
        }
      }
    }
  }

  if (missing.length > 0) {
    console.log('❌ ENV VARS AUSENTES:');
    missing.forEach((m) => console.log('  -', m));
    if (strict) hasErrors = true;
  }

  if (divergences.length > 0) {
    console.log('');
    console.log('⚠️ DIVERGÊNCIAS (env vs products.ts unitPrice):');
    divergences.forEach((d) => {
      const envReais = (d.envCents / 100).toFixed(2);
      console.log(`  ${d.product}/${d.plan}: env=${envReais} (${d.envCents} centavos) vs products.ts=${d.productsTsReais}`);
    });
  }

  if (!hasErrors && missing.length === 0) {
    console.log('✅ Todas as variáveis ASAAS_PRICE_* configuradas.');
  }

  if (hasErrors) {
    console.log('');
    process.exit(1);
  }
}

main();
