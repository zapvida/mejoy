/**
 * Regras de frete Store V2 por região
 * Sudeste/Sul: grátis >= 190 | Centro-Oeste: >= 240 | Norte/Nordeste: >= 349
 */

export interface ShippingResult {
  region: string;
  shippingCents: number;
  shippingDays: number;
  freeThresholdCents: number;
  message: string;
}

const REGIONS: Record<string, { freeAboveCents: number; days: number; name: string }> = {
  SP: { freeAboveCents: 19000, days: 5, name: 'Sudeste' },
  RJ: { freeAboveCents: 19000, days: 5, name: 'Sudeste' },
  MG: { freeAboveCents: 19000, days: 6, name: 'Sudeste' },
  ES: { freeAboveCents: 19000, days: 6, name: 'Sudeste' },
  PR: { freeAboveCents: 19000, days: 6, name: 'Sul' },
  SC: { freeAboveCents: 19000, days: 6, name: 'Sul' },
  RS: { freeAboveCents: 19000, days: 7, name: 'Sul' },
  DF: { freeAboveCents: 24000, days: 8, name: 'Centro-Oeste' },
  GO: { freeAboveCents: 24000, days: 8, name: 'Centro-Oeste' },
  MT: { freeAboveCents: 24000, days: 10, name: 'Centro-Oeste' },
  MS: { freeAboveCents: 24000, days: 8, name: 'Centro-Oeste' },
  BA: { freeAboveCents: 34900, days: 10, name: 'Nordeste' },
  CE: { freeAboveCents: 34900, days: 12, name: 'Nordeste' },
  PE: { freeAboveCents: 34900, days: 10, name: 'Nordeste' },
  RN: { freeAboveCents: 34900, days: 11, name: 'Nordeste' },
  PB: { freeAboveCents: 34900, days: 11, name: 'Nordeste' },
  AL: { freeAboveCents: 34900, days: 10, name: 'Nordeste' },
  SE: { freeAboveCents: 34900, days: 10, name: 'Nordeste' },
  MA: { freeAboveCents: 34900, days: 12, name: 'Nordeste' },
  PI: { freeAboveCents: 34900, days: 12, name: 'Nordeste' },
  PA: { freeAboveCents: 34900, days: 12, name: 'Norte' },
  AM: { freeAboveCents: 34900, days: 15, name: 'Norte' },
  AC: { freeAboveCents: 34900, days: 14, name: 'Norte' },
  RO: { freeAboveCents: 34900, days: 12, name: 'Norte' },
  RR: { freeAboveCents: 34900, days: 15, name: 'Norte' },
  AP: { freeAboveCents: 34900, days: 15, name: 'Norte' },
  TO: { freeAboveCents: 34900, days: 12, name: 'Norte' },
};

const DEFAULT_SHIPPING_CENTS = 2990; // R$ 29,90
const DEFAULT_DAYS = 10;

/** ViaCEP response */
interface ViaCepResponse {
  uf?: string;
  erro?: boolean;
}

/** Busca UF por CEP via ViaCEP (confiável) */
export async function getStateFromCepAsync(cep: string): Promise<string | null> {
  const cepClean = cep.replace(/\D/g, '');
  if (cepClean.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`, {
      next: { revalidate: 86400 },
    });
    const data = (await res.json()) as ViaCepResponse;
    if (data?.erro || !data?.uf) return null;
    return data.uf;
  } catch {
    return null;
  }
}

/** Fallback síncrono: aproximação por prefixo do CEP */
export function getStateFromCep(cep: string): string | null {
  const cepClean = cep.replace(/\D/g, '');
  if (cepClean.length !== 8) return null;
  const prefix = cepClean.slice(0, 2);
  const prefixToState: Record<string, string> = {
    '01': 'SP', '02': 'SP', '03': 'SP', '04': 'SP', '05': 'SP', '06': 'SP', '07': 'SP', '08': 'SP', '09': 'SP',
    '10': 'SP', '11': 'SP', '12': 'SP', '13': 'SP', '14': 'SP', '15': 'SP', '16': 'SP', '17': 'SP', '18': 'SP', '19': 'SP',
    '20': 'RJ', '21': 'RJ', '22': 'RJ', '23': 'RJ', '24': 'RJ', '25': 'RJ', '26': 'RJ', '27': 'RJ', '28': 'RJ', '29': 'RJ',
    '30': 'MG', '31': 'MG', '32': 'MG', '33': 'MG', '34': 'MG', '35': 'MG', '36': 'MG', '37': 'MG', '38': 'MG', '39': 'MG',
    '40': 'BA', '41': 'BA', '43': 'RS', '48': 'SC', '60': 'CE', '66': 'PA', '70': 'DF', '75': 'GO', '78': 'MT', '79': 'MS',
  };
  return prefixToState[prefix] ?? 'SP';
}

export function calculateShipping(cep: string, subtotalCents: number): ShippingResult {
  const state = getStateFromCep(cep);
  const config = state ? REGIONS[state] : null;
  const freeAbove = config?.freeAboveCents ?? 19000;
  const days = config?.days ?? DEFAULT_DAYS;
  const region = config?.name ?? 'Brasil';

  const shippingCents = subtotalCents >= freeAbove ? 0 : DEFAULT_SHIPPING_CENTS;
  const message =
    subtotalCents >= freeAbove
      ? `Frete grátis! Pedidos acima de R$ ${(freeAbove / 100).toFixed(0)} para ${region}`
      : `Frete: R$ ${(DEFAULT_SHIPPING_CENTS / 100).toFixed(2).replace('.', ',')} • Entrega em até ${days} dias`;

  return {
    region,
    shippingCents,
    shippingDays: days,
    freeThresholdCents: freeAbove,
    message,
  };
}

/** Versão assíncrona usando ViaCEP para UF correta */
export async function calculateShippingAsync(cep: string, subtotalCents: number): Promise<ShippingResult> {
  const state = await getStateFromCepAsync(cep) ?? getStateFromCep(cep);
  const config = state ? REGIONS[state] : null;
  const freeAbove = config?.freeAboveCents ?? 19000;
  const days = config?.days ?? DEFAULT_DAYS;
  const region = config?.name ?? 'Brasil';

  const shippingCents = subtotalCents >= freeAbove ? 0 : DEFAULT_SHIPPING_CENTS;
  const message =
    subtotalCents >= freeAbove
      ? `Frete grátis! Pedidos acima de R$ ${(freeAbove / 100).toFixed(0)} para ${region}`
      : `Frete: R$ ${(DEFAULT_SHIPPING_CENTS / 100).toFixed(2).replace('.', ',')} • Entrega em até ${days} dias`;

  return {
    region,
    shippingCents,
    shippingDays: days,
    freeThresholdCents: freeAbove,
    message,
  };
}
