/**
 * MeJoy Price Registry — Fonte única de preços
 * Usa env vars ASAAS_PRICE_* como fonte. Nenhum hardcode de valor.
 */

export type PlanTier = 'basico' | 'completo' | 'premium';
export type TirzepatidaTier = '2_5' | '5' | '20';

export interface PriceInfo {
  priceCents: number;
  label: string;
  asaasEnvVar: string;
}

const PIX_DISCOUNT = 0.1;

/** Preços assinatura 6 meses (centavos) */
export const SUBSCRIPTION_PRICE_PARTNER_CENTS = 244200; // R$ 2.442
export const SUBSCRIPTION_PRICE_PUBLIC_CENTS = 294200; // R$ 2.942

/** Produto teste R$ 10 */
export const TEST_PRODUCT_PRICE_CENTS = 1000;

/** Slug → env key (normaliza hífens) */
const SLUG_TO_ENV: Record<string, string> = {
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
  teste: 'TESTE',
};

function getEnvCents(envVar: string): number | null {
  const val = process.env[envVar];
  if (!val) return null;
  const n = parseInt(val, 10);
  return isNaN(n) || n <= 0 ? null : n;
}

/** Alias LIBIDO_MASCULINA → LIBIDO_MASULINA (typo histórico) */
function getEnvWithAlias(name: string): string | undefined {
  let v = process.env[name];
  if (v) return v;
  const alt = name.replace('LIBIDO_MASCULINA', 'LIBIDO_MASULINA');
  return alt !== name ? process.env[alt] : undefined;
}

function getEnvCentsWithAlias(envVar: string): number | null {
  const val = getEnvWithAlias(envVar);
  if (!val) return null;
  const n = parseInt(val, 10);
  return isNaN(n) || n <= 0 ? null : n;
}

/**
 * Obtém preço de produto por slug e tier.
 * Para tirzepatida: tier 2_5/5/20 mapeia para env TIRZEPATIDA_2_5, _5, _20
 */
export function getProductPrice(
  slug: string,
  tier: PlanTier | TirzepatidaTier
): PriceInfo | null {
  const envKey = SLUG_TO_ENV[slug] ?? slug.toUpperCase().replace(/-/g, '_');

  if (slug === 'teste') {
    const enabled = process.env.NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT === '1' || process.env.NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT === 'true';
    if (!enabled) return null;
    const cents = getEnvCents('ASAAS_PRICE_TESTE') ?? TEST_PRODUCT_PRICE_CENTS;
    return { priceCents: cents, label: 'Teste', asaasEnvVar: 'ASAAS_PRICE_TESTE' };
  }

  if (slug === 'tirzepatida') {
    const tierMap: Record<string, string> = {
      '2_5': '2_5',
      '5': '5',
      '20': '20',
      basico: '2_5',
      completo: '5',
      premium: '20',
    };
    const suffix = tierMap[tier as string] ?? tier;
    const envVar = `ASAAS_PRICE_TIRZEPATIDA_${String(suffix).toUpperCase().replace('.', '_')}`;
    const cents = getEnvCents(envVar);
    if (cents === null) return null;
    const label = suffix === '2_5' ? '2,5 mg/mL' : suffix === '5' ? '5 mg/mL' : '20 mg/mL';
    return { priceCents: cents, label, asaasEnvVar: envVar };
  }

  const planUpper = String(tier).toUpperCase();
  const envVar = `ASAAS_PRICE_${envKey}_${planUpper}`;
  const cents = getEnvCentsWithAlias(envVar);
  if (cents === null) return null;

  const labels: Record<string, string> = {
    BASICO: 'Básico',
    COMPLETO: 'Completo',
    PREMIUM: 'Premium',
  };
  return {
    priceCents: cents,
    label: labels[planUpper] ?? planUpper,
    asaasEnvVar: envVar,
  };
}

/** Preço com desconto PIX (-10%) */
export function getPixPrice(priceCents: number): number {
  return Math.round(priceCents * (1 - PIX_DISCOUNT));
}

/** Parcela para Nx sem juros */
export function getInstallmentPrice(priceCents: number, installments: number): number {
  return Math.round(priceCents / installments);
}

/** Preço assinatura 6m (sócio ou público) */
export function getSubscriptionPrice(isPartner: boolean): number {
  return isPartner ? SUBSCRIPTION_PRICE_PARTNER_CENTS : SUBSCRIPTION_PRICE_PUBLIC_CENTS;
}

/** Produto teste habilitado? */
export function isTestProductEnabled(): boolean {
  return process.env.NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT === '1' || process.env.NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT === 'true';
}

/**
 * Lista envs de preço faltantes. Não quebra build; retorna array.
 * Use em health check ou validatePricingEnv() para falhar.
 */
export function getMissingPricingEnvs(): string[] {
  const missing: string[] = [];
  const products = [
    'emagrecimento',
    'calvicie',
    'sono',
    'ansiedade',
    'intestino',
    'figado',
    'libido-masculina',
    'menopausa',
    'articulacoes',
    'imunidade',
  ];
  const plans: PlanTier[] = ['basico', 'completo', 'premium'];

  for (const slug of products) {
    const envKey = SLUG_TO_ENV[slug] ?? slug.toUpperCase().replace(/-/g, '_');
    for (const plan of plans) {
      const envVar = `ASAAS_PRICE_${envKey}_${plan.toUpperCase()}`;
      if (getEnvCentsWithAlias(envVar) === null) missing.push(envVar);
    }
  }

  if (process.env.NEXT_PUBLIC_TIRZEPATIDA_ENABLED === '1') {
    for (const t of ['2_5', '5', '20'] as const) {
      const envVar = `ASAAS_PRICE_TIRZEPATIDA_${t.toUpperCase()}`;
      if (getEnvCents(envVar) === null) missing.push(envVar);
    }
  }

  if (isTestProductEnabled()) {
    if (getEnvCents('ASAAS_PRICE_TESTE') === null) missing.push('ASAAS_PRICE_TESTE');
  }

  return missing;
}

/**
 * Valida envs. Se strict=true, lança erro. Caso contrário retorna missing.
 */
export function validatePricingEnv(strict = false): string[] {
  const missing = getMissingPricingEnvs();
  if (strict && missing.length > 0) {
    throw new Error(`Preços não configurados: ${missing.join(', ')}`);
  }
  return missing;
}
