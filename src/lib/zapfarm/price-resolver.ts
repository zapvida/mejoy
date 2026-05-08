/**
 * ZapFarm Price Resolver
 * Fonte única de preços: env vars ASAAS_PRICE_{PRODUTO}_{PLANO}
 * Fallback para products.ts controlado por ZAPFARM_PRICE_SOURCE
 */

import { ZAPFARM_PRODUCTS } from '@/config/zapfarm/products';

const PLANS = ['basico', 'completo', 'premium'] as const;
type PlanKey = (typeof PLANS)[number];
const TEST_SEQUENCE_PRODUCTS = Object.keys(ZAPFARM_PRODUCTS);

/** Tirzepatida: planKey -> env suffix */
const TIRZEPATIDA_SUFFIX: Record<PlanKey, string> = {
  basico: '2_5',
  completo: '5',
  premium: '20',
};
type VariantKey = 'core' | 'pro' | undefined;

/** Slug -> ENV_KEY (normaliza libido-masculina -> LIBIDO_MASCULINA) */
const SLUG_TO_ENV_MAP: Record<string, string> = {
  'libido-masculina': 'LIBIDO_MASCULINA',
  emagrecimento: 'EMAGRECIMENTO',
  calvicie: 'CALVICIE',
  sono: 'SONO',
  ansiedade: 'ANSIEDADE',
  intestino: 'INTESTINO',
  figado: 'FIGADO',
  menopausa: 'MENOPAUSA',
  articulacoes: 'ARTICULACOES',
  imunidade: 'IMUNIDADE',
  tirzepatida: 'TIRZEPATIDA',
};

/** Alias para retrocompatibilidade: ao buscar LIBIDO_MASCULINA, também tenta LIBIDO_MASULINA */
function getEnvVarWithAlias(name: string): string | undefined {
  let val = process.env[name];
  if (val) return val;
  const alt = name.replace('LIBIDO_MASCULINA', 'LIBIDO_MASULINA');
  if (alt !== name) return process.env[alt];
  return undefined;
}

function getPriceSource(): 'env' | 'productsTs' {
  const v = process.env.ZAPFARM_PRICE_SOURCE ?? 'env';
  return v === 'productsTs' ? 'productsTs' : 'env';
}

export function isTestPriceSequenceEnabled() {
  const flag = process.env.ZAPFARM_TEST_PRICE_SEQUENCE ?? '';
  return flag === '1' || flag.toLowerCase() === 'true';
}

function getTestSequencePriceCents(productSlug: string, planKey: PlanKey) {
  if (!isTestPriceSequenceEnabled()) {
    return null;
  }

  const productIndex = TEST_SEQUENCE_PRODUCTS.indexOf(productSlug);
  const planIndex = PLANS.indexOf(planKey);

  if (productIndex === -1 || planIndex === -1) {
    return null;
  }

  return (10 + productIndex * PLANS.length + planIndex) * 100;
}

/**
 * Normaliza slug do produto para chave de env.
 * libido-masculina -> LIBIDO_MASCULINA
 */
export function normalizeProductKey(slug: string): string {
  const mapped = SLUG_TO_ENV_MAP[slug];
  if (mapped) return mapped;
  return slug.toUpperCase().replace(/-/g, '_');
}

/**
 * Obtém preço em centavos da env var.
 * Suporta variante: ASAAS_PRICE_{PRODUTO}_CORE_{PLANO} ou ASAAS_PRICE_{PRODUTO}_PRO_{PLANO}
 * Fallback: ASAAS_PRICE_{PRODUTO}_{PLANO}
 */
export function getEnvPriceCents(
  productSlug: string,
  planKey: PlanKey,
  variant?: VariantKey
): number | null {
  const testPriceCents = getTestSequencePriceCents(productSlug, planKey);
  if (testPriceCents !== null) {
    return testPriceCents;
  }

  if (productSlug === 'teste') {
    const val = process.env.ASAAS_PRICE_TESTE;
    if (!val) return null;
    const n = parseInt(val, 10);
    return isNaN(n) || n <= 0 ? null : n;
  }
  const envKey = normalizeProductKey(productSlug);
  const planUpper =
    productSlug === 'tirzepatida'
      ? TIRZEPATIDA_SUFFIX[planKey].toUpperCase().replace(/\./g, '_')
      : planKey.toUpperCase();

  const tryEnvVar = (name: string): number | null => {
    const val = getEnvVarWithAlias(name);
    if (!val) return null;
    const n = parseInt(val, 10);
    return isNaN(n) || n <= 0 ? null : n;
  };

  if (variant) {
    const variantUpper = variant.toUpperCase();
    const withVariant = `ASAAS_PRICE_${envKey}_${variantUpper}_${planUpper}`;
    const cents = tryEnvVar(withVariant);
    if (cents !== null) return cents;
  }

  const standard = `ASAAS_PRICE_${envKey}_${planUpper}`;
  return tryEnvVar(standard);
}

/**
 * Obtém preço em centavos do products.ts (fallback).
 */
function getProductsTsPriceCents(productSlug: string, planKey: PlanKey): number | null {
  const config = ZAPFARM_PRODUCTS[productSlug];
  if (!config) return null;
  const plan = config.plans[planKey];
  if (!plan || typeof plan.unitPrice !== 'number') return null;
  return Math.round(plan.unitPrice * 100);
}

/**
 * Obtém preço em centavos. Fonte controlada por ZAPFARM_PRICE_SOURCE.
 * - env: obrigatório; se faltar, lança ou retorna null conforme strict
 * - productsTs: fallback; log warning
 */
export function getPriceCents(
  productSlug: string,
  planKey: PlanKey,
  variant?: VariantKey,
  strict = true
): number | null {
  const source = getPriceSource();
  const envCents = getEnvPriceCents(productSlug, planKey, variant);

  if (envCents !== null) return envCents;

  if (source === 'env') {
    if (strict) {
      const envKey = normalizeProductKey(productSlug);
      const planUpper = planKey.toUpperCase();
      const varName = variant
        ? `ASAAS_PRICE_${envKey}_${variant.toUpperCase()}_${planUpper}`
        : `ASAAS_PRICE_${envKey}_${planUpper}`;
      throw new Error(
        `ZAPFARM_PRICE_SOURCE=env exige variável ${varName}. Configure em .env ou Vercel.`
      );
    }
    return null;
  }

  const fallback = getProductsTsPriceCents(productSlug, planKey);
  if (fallback !== null) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(
        `[price-resolver] Usando fallback products.ts para ${productSlug}/${planKey}. Configure ASAAS_PRICE_* para produção.`
      );
    }
    return fallback;
  }
  return null;
}

export interface PricesForProduct {
  basico: number;
  completo: number;
  premium: number;
  source: 'env' | 'fallback' | 'test-sequence';
  missing: string[];
}

/**
 * Retorna preços em centavos para os 3 planos de um produto.
 * Quando ZAPFARM_PRICE_SOURCE=env e alguma env faltar, lança erro.
 */
export function getPricesForProduct(
  productSlug: string,
  variant?: VariantKey,
  strict = true
): PricesForProduct {
  const missing: string[] = [];
  const source = getPriceSource();
  const prices: Record<PlanKey, number> = {
    basico: 0,
    completo: 0,
    premium: 0,
  };

  for (const plan of PLANS) {
    const envCents = getEnvPriceCents(productSlug, plan, variant);
    const fallbackCents = getProductsTsPriceCents(productSlug, plan);

    if (envCents !== null) {
      prices[plan] = envCents;
    } else if (source === 'productsTs' && fallbackCents !== null) {
      prices[plan] = fallbackCents;
      if (typeof console !== 'undefined' && console.warn) {
        const envKey = normalizeProductKey(productSlug);
        const varName = variant
          ? `ASAAS_PRICE_${envKey}_${variant.toUpperCase()}_${plan.toUpperCase()}`
          : `ASAAS_PRICE_${envKey}_${plan.toUpperCase()}`;
        console.warn(`[price-resolver] Fallback products.ts para ${varName}`);
      }
    } else {
      const envKey = normalizeProductKey(productSlug);
      const varName = variant
        ? `ASAAS_PRICE_${envKey}_${variant.toUpperCase()}_${plan.toUpperCase()}`
        : `ASAAS_PRICE_${envKey}_${plan.toUpperCase()}`;
      missing.push(varName);
      if (source === 'env' && strict) {
        throw new Error(
          `Preço obrigatório não configurado: ${varName}. Configure ZAPFARM_PRICE_SOURCE=env com todas as variáveis ASAAS_PRICE_*.`
        );
      }
      prices[plan] = fallbackCents ?? 0;
    }
  }

  if (missing.length > 0 && source === 'env' && strict) {
    throw new Error(
      `Preços ausentes para ${productSlug}: ${missing.join(', ')}. Configure as variáveis ASAAS_PRICE_* em .env ou Vercel.`
    );
  }

  return {
    basico: prices.basico,
    completo: prices.completo,
    premium: prices.premium,
    source: isTestPriceSequenceEnabled()
      ? 'test-sequence'
      : source === 'productsTs' && missing.length > 0
        ? 'fallback'
        : 'env',
    missing,
  };
}

/**
 * Lista de slugs de produtos ZapFarm ativos
 */
export const ZAPFARM_PRODUCT_SLUGS = Object.keys(ZAPFARM_PRODUCTS);

/**
 * Obtém preço de bundle em centavos.
 * Env: ASAAS_PRICE_BUNDLE_{ID} (ex: ASAAS_PRICE_BUNDLE_SONO_ANSIEDADE)
 */
export function getBundlePriceCents(bundleId: string): number | null {
  const envKey = `ASAAS_PRICE_BUNDLE_${bundleId.toUpperCase().replace(/-/g, '_')}`;
  const val = process.env[envKey];
  if (!val) return null;
  const n = parseInt(val, 10);
  return isNaN(n) || n <= 0 ? null : n;
}
