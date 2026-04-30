export const env = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || '',
  NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || '',

  // Fallback direto (se não usar GTM)
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || '',
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  NEXT_PUBLIC_TIKTOK_PIXEL_ID: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '',
};

// Server-side environment variables
export const serverEnv = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  DATABASE_URL: process.env.DATABASE_URL || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '', // TODO(backcompat-2025-10-23)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini', // TODO(backcompat-2025-10-23)
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '', // TODO(backcompat-2025-10-23)
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY || '', // TODO(backcompat-2025-10-23)
  ADMIN_IP_ALLOWLIST: process.env.ADMIN_IP_ALLOWLIST || '', // TODO(backcompat-2025-10-23)
  WEBHOOK_ASAAS_URL: process.env.WEBHOOK_ASAAS_URL || '', // TODO(backcompat-2025-10-23)
  PDF_V2: process.env.PDF_V2 === 'true',
  TTS_ENABLED: process.env.TTS_ENABLED === 'true',
  GIFT_ENABLED: process.env.GIFT_ENABLED === '1', // TODO(backcompat-2025-10-23)
};

export function isFeatureEnabled(flag: string) {
  const v = process.env[flag];
  return v === '1' || v === 'true' || v === 'on' || v === 'enabled';
}

const CRITICAL_ENVS = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] as const;
const OPTIONAL_PRICE_ENVS = [
  'STRIPE_PRICE_PLUS_MONTHLY',
  'STRIPE_PRICE_PLUS_YEARLY',
  'STRIPE_PRICE_GIFT_MONTHLY',
  'STRIPE_PRICE_GIFT_YEARLY',
  'STRIPE_PRICE_ADDON_MONTHLY',
  'STRIPE_PRICE_ADDON_YEARLY'
] as const;
const OPTIONAL_GHL_ENVS = [
  'GHL_API_KEY',
  'GHL_LOCATION_ID',
  'GHL_PIPELINE_ID',
  'GHL_STAGE_VISIT',
  'GHL_STAGE_TRIAGE',
  'GHL_STAGE_CHECKOUT',
  'GHL_STAGE_WON'
] as const;

let optionalWarningsLogged = false;

export function assertCriticalEnvs() {
  const missing = CRITICAL_ENVS.filter((key) => !process.env[key]);
  if (missing.length === 0) return;

  const message = `Missing critical environment variables: ${missing.join(', ')}`;
  if ((process.env.NODE_ENV || 'production') === 'production') {
    throw new Error(message);
  } else {
    console.warn(`[env] ${message}`);
  }
}

export function warnMissingOptionalEnvs() {
  if (optionalWarningsLogged) return;
  if ((process.env.NODE_ENV || 'development') === 'production') return;

  const missingPrices = OPTIONAL_PRICE_ENVS.filter((key) => !process.env[key]);
  const missingGhl = OPTIONAL_GHL_ENVS.filter((key) => !process.env[key]);

  if (missingPrices.length > 0 || missingGhl.length > 0) {
    optionalWarningsLogged = true;
    if (missingPrices.length > 0) {
      console.warn(`[env] Stripe price IDs ausentes (configurar antes do deploy): ${missingPrices.join(', ')}`);
    }
    if (missingGhl.length > 0) {
      console.warn(`[env] GHL IDs ausentes (necessários para funil completo): ${missingGhl.join(', ')}`);
    }
  }
}

export function collectEnvGaps() {
  const missingCritical = CRITICAL_ENVS.filter((key) => !process.env[key]);
  const missingPrices = OPTIONAL_PRICE_ENVS.filter((key) => !process.env[key]);
  const missingGhl = OPTIONAL_GHL_ENVS.filter((key) => !process.env[key]);
  const optionalOthers = [
    'NEXT_PUBLIC_BASE_URL',
    'B2B_ENABLED',
    'DEFAULT_TENANT',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'LOG_LEVEL'
  ].filter((key) => !process.env[key]);

  return {
    critical: missingCritical,
    prices: missingPrices,
    ghl: missingGhl,
    others: optionalOthers
  };
}
