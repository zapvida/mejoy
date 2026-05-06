// src/lib/flags.ts
/**
 * Domínio principal: mejoy.com.br = Loja (B2C marketplace)
 * B2B white-label: apenas zapfarm.com.br
 */
export const CUSTOMER_MODE = (process.env.NEXT_PUBLIC_CUSTOMER_MODE ?? 'b2c') as 'b2b'|'b2c';

/** Domínios que mostram B2B (white-label). Todos os demais = B2C (loja). */
export const ROOT_B2B_DOMAINS = (process.env.NEXT_PUBLIC_ROOT_B2B_DOMAINS ?? 'zapfarm.com.br,www.zapfarm.com.br,zapfarm.com,www.zapfarm.com')
  .split(',')
  .map(s => s.trim().toLowerCase());

/** Domínio principal da loja (mejoy.com.br) */
export const ROOT_LOJA_DOMAINS = (process.env.NEXT_PUBLIC_ROOT_LOJA_DOMAINS ?? 'mejoy.com.br,www.mejoy.com.br')
  .split(',')
  .map(s => s.trim().toLowerCase());

export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME ?? 'MeJoy';
export const SHOW_SALES_ASSISTANT = (process.env.NEXT_PUBLIC_SHOW_SALES_ASSISTANT ?? '1') === '1';

export type HomeVariant = 'medvi_journey' | 'store_v2';

function normalizeHomeVariant(value?: string): HomeVariant {
  return value === 'store_v2' ? 'store_v2' : 'medvi_journey';
}

// Feature flags para GI Enhanced
export const GI_ENHANCED = (process.env.NEXT_PUBLIC_TRIAGE_GI_ENHANCED ?? '0') === '1';
export const EMOJI_MODE = (process.env.NEXT_PUBLIC_EMOJI_MODE ?? 'legacy') as 'legacy'|'smart'|'off';

export function isB2BDefault() {
  return CUSTOMER_MODE === 'b2b';
}

export function isB2CDefault() {
  return CUSTOMER_MODE === 'b2c';
}

// Feature flags ZapFarm (lançamento contínuo)
export const ZAPFARM_VARIANTS = (process.env.NEXT_PUBLIC_ZAPFARM_VARIANTS ?? '0') === '1';
export const ZAPFARM_BUNDLES = (process.env.NEXT_PUBLIC_ZAPFARM_BUNDLES ?? '0') === '1';
export const ZAPFARM_SUBSCRIPTION = (process.env.NEXT_PUBLIC_ZAPFARM_SUBSCRIPTION ?? '0') === '1';
export const ZAPFARM_PRICE_SOURCE = (process.env.ZAPFARM_PRICE_SOURCE ?? 'env') as 'env' | 'productsTs';

/** true = white-label B2B (zapfarm). false = loja B2C (mejoy, localhost, etc). */
export function isRootB2BDomain(host?: string) {
  const h = (host ?? (typeof window !== 'undefined' ? window.location.hostname : '')).toLowerCase();
  if (process.env.NODE_ENV === 'development' && (h === 'localhost' || h.startsWith('localhost'))) {
    return false; // Dev = loja sempre
  }
  return ROOT_B2B_DOMAINS.includes(h);
}

/** true = domínio principal da loja (mejoy.com.br) */
export function isRootLojaDomain(host?: string) {
  const h = (host ?? (typeof window !== 'undefined' ? window.location.hostname : '')).toLowerCase();
  return ROOT_LOJA_DOMAINS.includes(h);
}

// Home principal da loja. Independente do STORE_V2, que segue controlando catálogo e rotas de loja.
export const HOME_VARIANT = normalizeHomeVariant(
  process.env.HOME_VARIANT ?? process.env.NEXT_PUBLIC_HOME_VARIANT,
);
export const NEXT_PUBLIC_HOME_VARIANT = normalizeHomeVariant(process.env.NEXT_PUBLIC_HOME_VARIANT);

export function getHomeVariant(): HomeVariant {
  return HOME_VARIANT;
}

// Store V2 — Loja nova com 200 SKUs (MeJoy e-commerce 1P)
// Quando ativo: Home por objetivos, /c/[objetivo], /p/[slug], cart, checkout Pagar.me
// Rollback: STORE_V2=0 volta para loja/protocolos legado sem deploy
export const STORE_V2 =
  process.env.STORE_V2 === '1' || process.env.STORE_V2 === 'true';
export const NEXT_PUBLIC_STORE_V2 =
  process.env.NEXT_PUBLIC_STORE_V2 === '1' ||
  process.env.NEXT_PUBLIC_STORE_V2 === 'true';

/** true = loja nova (200 SKUs, carrinho, checkout, Pagar.me) ativa */
export function isStoreV2Enabled(): boolean {
  return STORE_V2 || NEXT_PUBLIC_STORE_V2;
}

/** Client-side: usar apenas NEXT_PUBLIC_STORE_V2 para hidratação SSR */
export function isStoreV2EnabledClient(): boolean {
  return NEXT_PUBLIC_STORE_V2;
}

// Store V2 — Max conversão (PDP premium, cart progress, checkout validation, etc.)
// Default: OFF. Ativar em prod quando validado.
export const STORE_V2_CONVERSION =
  process.env.STORE_V2_CONVERSION === '1' || process.env.STORE_V2_CONVERSION === 'true';
export const NEXT_PUBLIC_STORE_V2_CONVERSION =
  process.env.NEXT_PUBLIC_STORE_V2_CONVERSION === '1' ||
  process.env.NEXT_PUBLIC_STORE_V2_CONVERSION === 'true';

export const STORE_V2_ANALYTICS =
  process.env.STORE_V2_ANALYTICS === '1' || process.env.STORE_V2_ANALYTICS === 'true';
export const NEXT_PUBLIC_STORE_V2_ANALYTICS =
  process.env.NEXT_PUBLIC_STORE_V2_ANALYTICS === '1' ||
  process.env.NEXT_PUBLIC_STORE_V2_ANALYTICS === 'true';

export const STORE_V2_REVIEWS =
  process.env.STORE_V2_REVIEWS === '1' || process.env.STORE_V2_REVIEWS === 'true';
export const NEXT_PUBLIC_STORE_V2_REVIEWS =
  process.env.NEXT_PUBLIC_STORE_V2_REVIEWS === '1' ||
  process.env.NEXT_PUBLIC_STORE_V2_REVIEWS === 'true';

export const STORE_V2_RECOVERY =
  process.env.STORE_V2_RECOVERY === '1' || process.env.STORE_V2_RECOVERY === 'true';

export const STORE_V2_PLAYWRIGHT_SMOKE =
  process.env.STORE_V2_PLAYWRIGHT_SMOKE === '1' || process.env.STORE_V2_PLAYWRIGHT_SMOKE === 'true';

/** Apenas staging. NUNCA em prod. */
export const STORE_V2_STAGING_SIMULATE_PAID =
  process.env.STORE_V2_STAGING_SIMULATE_PAID === '1' ||
  process.env.STORE_V2_STAGING_SIMULATE_PAID === 'true';

export function isStoreV2ConversionEnabled(): boolean {
  return STORE_V2_CONVERSION || NEXT_PUBLIC_STORE_V2_CONVERSION;
}

// Copy Blueprint v2 — Piloto editorial (cluster Sono)
// Quando ativo: PDP e /c/sono usam copy do copy-blueprint-v2.csv
// Rollback: NEXT_PUBLIC_COPY_V2_PILOT=0 desativa o piloto
export const NEXT_PUBLIC_COPY_V2_PILOT =
  process.env.NEXT_PUBLIC_COPY_V2_PILOT === '1' ||
  process.env.NEXT_PUBLIC_COPY_V2_PILOT === 'true';

// Copy Blueprint v4 — Copy premium AI-first para todos os SKUs
// Quando ativo: PDP usa copy-blueprint-v4.csv (prioridade sobre v2)
// Default: ON para refletir o padrão final no dev/prod; pode ser desligado com NEXT_PUBLIC_COPY_V4=0.
export const NEXT_PUBLIC_COPY_V4 =
  process.env.NEXT_PUBLIC_COPY_V4 == null
    ? true
    : process.env.NEXT_PUBLIC_COPY_V4 === '1' ||
      process.env.NEXT_PUBLIC_COPY_V4 === 'true';

export function isCopyV2PilotEnabled(): boolean {
  return NEXT_PUBLIC_COPY_V2_PILOT;
}

export function isCopyV4Enabled(): boolean {
  return NEXT_PUBLIC_COPY_V4;
}
