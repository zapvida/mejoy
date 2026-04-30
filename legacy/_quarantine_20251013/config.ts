// src/lib/triage/config.ts
// Configuração centralizada para triagens gratuitas e paywall

// 🔧 MODO TESTE: Liberar todas as triagens temporariamente
const TEST_MODE_ALL_FREE = process.env.NEXT_PUBLIC_TEST_MODE_ALL_FREE === 'true';

export const FREE_SLUGS = TEST_MODE_ALL_FREE 
  ? new Set(['gastro', 'geral', 'geralRapida', 'mental', 'cancer', 'sono', 'enxaqueca', 'obesidade', 'gestante', 'tabagismo', 'quimica', 'saudeMasculina', 'estiloVidaModerna', 'estresseBurnout', 'jogosAzar', 'depressao', 'tdah'])
  : new Set(['gastro']);

export function isFreeTriage(slug: string): boolean {
  return FREE_SLUGS.has(slug);
}

export function shouldShowPaywall(slug: string): boolean {
  return !isFreeTriage(slug);
}

// Configuração de preços
export const PRICING = {
  SUBSCRIPTION: {
    price: 49,
    label: 'Assinar R$ 49 (30 dias, sem renovação)',
    description: 'Acesso completo a todas as triagens premium por 30 dias'
  },
  GIFT: {
    price: 89,
    label: 'Dar de presente R$ 89',
    description: 'Presenteie alguém com acesso completo às triagens'
  }
} as const;

// URLs de checkout
export const CHECKOUT_URLS = {
  SUBSCRIPTION: '/assinatura',
  GIFT: '/presente'
} as const;
