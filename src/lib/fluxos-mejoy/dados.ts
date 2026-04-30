/**
 * Dados dos fluxos de entrada — 11 produtos + Assinatura 6m + 5 triagens
 * Centro: MeJoy. Sol: 12 raios (11 produtos + Assinatura 6 meses).
 */

import {
  Activity,
  Heart,
  Moon,
  Scissors,
  Package,
  Shield,
  Zap,
  Brain,
  Pill,
  Smile,
  Syringe,
  CreditCard,
  Leaf,
  Stethoscope,
  ActivitySquare,
} from 'lucide-react';
import { ZAPFARM_PRODUCTS } from '@/config/zapfarm/products';
import { formularios } from '@/forms';
import type { FluxoEntry } from './types';

const CORES_PRODUTOS: Record<string, string> = {
  emagrecimento: '#7C3AED',
  calvicie: '#4F46E5',
  sono: '#2563EB',
  ansiedade: '#16A34A',
  intestino: '#059669',
  figado: '#F59E0B',
  'libido-masculina': '#DC2626',
  menopausa: '#DB2777',
  articulacoes: '#475569',
  imunidade: '#0891B2',
  tirzepatida: '#9333EA',
  'assinatura-6m': '#0D9488',
};

const CORES_TRIAGENS: Record<string, string> = {
  gastro: '#00C853',
  geral: '#6366F1',
  mental: '#8B5CF6',
  cardiovascular: '#EF4444',
  'diabetes-metabolismo': '#F59E0B',
};

const ICONES_PRODUTOS = {
  emagrecimento: Activity,
  calvicie: Scissors,
  sono: Moon,
  ansiedade: Smile,
  intestino: Package,
  figado: Shield,
  'libido-masculina': Heart,
  menopausa: Brain,
  articulacoes: Pill,
  imunidade: Zap,
  tirzepatida: Syringe,
  'assinatura-6m': CreditCard,
};

const ICONES_TRIAGENS = {
  gastro: Leaf,
  geral: Stethoscope,
  mental: Brain,
  cardiovascular: Heart,
  'diabetes-metabolismo': ActivitySquare,
} as const;

function buildFluxoProduto(slug: string, ordem: number): FluxoEntry {
  const p = ZAPFARM_PRODUCTS[slug];
  if (!p) throw new Error(`Produto não encontrado: ${slug}`);

  const precoMin = p.plans.basico.unitPrice;
  const precoMax = p.plans.premium.unitPrice;
  const faixa =
    precoMin === precoMax
      ? `R$ ${precoMin}`
      : `R$ ${precoMin} – R$ ${precoMax}`;

  return {
    slug,
    nome: p.commercialName || p.displayName,
    labelCurto: p.displayName,
    icone: ICONES_PRODUTOS[slug] ?? Package,
    ordem,
    cor: CORES_PRODUTOS[slug] ?? '#00C853',
    tipo: 'produto',
    simples: {
      titulo: p.shortDescription,
      frase: p.description,
      passos: [
        'Acessa landing do produto',
        'Faz triagem gratuita',
        'Recebe relatório personalizado',
        'Checkout e pagamento',
        'Produto entregue',
      ],
      quemPaga: 'Cliente B2C',
      receita: faixa,
    },
    moderado: {
      urls: [`/${slug}`, `/triagem/${p.triageSlug}`, `/${slug}/checkout`],
      integracoes: ['Stripe/Asaas', 'Supabase', 'Resend'],
      cta: `Conhecer ${p.displayName}`,
    },
    completo: {
      apis: ['/api/checkout', '/api/triage', '/api/report'],
      metricas: ['Conversão triagem→checkout', 'LTV', 'CAC'],
      escala: '11 produtos, 33 SKUs',
      riscos: ['Regulação ANVISA', 'Concorrência'],
    },
    monetizacao: {
      tipo: 'B2C',
      valores: faixa,
    },
  };
}

const LABEL_CURTO_TRIAGEM: Record<string, string> = {
  gastro: 'Gastro',
  geral: 'Geral',
  mental: 'Mental',
  cardiovascular: 'Cardíaco',
  'diabetes-metabolismo': 'Diabetes',
};

function buildFluxoTriagem(slug: string, ordem: number): FluxoEntry {
  const form = formularios[slug as keyof typeof formularios];
  const cor = CORES_TRIAGENS[slug] ?? '#00C853';
  const icone = ICONES_TRIAGENS[slug] ?? Stethoscope;
  const labelCurto = LABEL_CURTO_TRIAGEM[slug] ?? form?.titulo?.split(' ')[0] ?? slug;

  return {
    slug,
    nome: form?.titulo ?? slug,
    labelCurto,
    icone,
    ordem,
    cor,
    tipo: 'triagem',
    simples: {
      titulo: form?.descricaoDetalhada ?? form?.titulo ?? slug,
      frase: form?.descricao ?? 'Triagem de saúde gratuita.',
      passos: [
        'Acessa triagem',
        'Preenche formulário',
        'Recebe relatório',
        'Orientação médica',
      ],
      quemPaga: 'Gratuita / Lead',
      receita: 'R$ 0 – Lead para produtos',
    },
    moderado: {
      urls: [`/triagem/${slug}`],
      integracoes: ['Supabase', 'Formulários'],
      cta: 'Fazer triagem gratuita',
    },
    completo: {
      apis: ['/api/triage', '/api/report'],
      metricas: ['Taxa conclusão', 'Leads gerados'],
      escala: '47 triagens disponíveis',
      riscos: ['Qualidade leads', 'Retenção'],
    },
    monetizacao: {
      tipo: 'Lead / B2C indireto',
      valores: 'Pass R$49, Gift R$89, Produtos R$139–R$5.388',
    },
  };
}

const PRODUTOS_SLUGS = [
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
  'tirzepatida',
] as const;

const TRIAGENS_SLUGS = [
  'gastro',
  'geral',
  'mental',
  'cardiovascular',
  'diabetes-metabolismo',
] as const;

/** Apenas os 11 produtos (para cards de produto) */
export const FLUXOS_PRODUTOS: FluxoEntry[] = PRODUTOS_SLUGS.map((slug, i) =>
  buildFluxoProduto(slug, i + 1)
);

/** Assinatura 6 meses — 12º raio de entrada */
const FLUXO_ASSINATURA: FluxoEntry = {
  slug: 'assinatura-6m',
  nome: 'Assinatura 6 Meses',
  labelCurto: 'Assinatura 6m',
  icone: CreditCard,
  ordem: 12,
  cor: '#0D9488',
  tipo: 'produto',
  simples: {
    titulo: 'Cuidado completo em 6 meses',
    frase: '6 meses de suplemento + especialista + nutri + psicóloga + check-up. PIX -10%. Parcelas sem juros.',
    passos: [
      'Escolhe produto e plano',
      'Adiciona assinatura 6m (recomendado)',
      'Checkout e pagamento',
      'Recebe em casa a cada 60 dias',
    ],
    quemPaga: 'Cliente B2C',
    receita: 'R$ 2.382 (Sócio) · R$ 2.882 (Não-sócio)',
  },
  moderado: {
    urls: ['/[product]/checkout', '/api/asaas/create-payment'],
    integracoes: ['Asaas', 'Supabase', 'Resend'],
    cta: 'Assinar 6 meses',
  },
  completo: {
    apis: ['/api/asaas/create-payment', '/api/asaas/webhook'],
    metricas: ['Conversão upsell', 'LTV assinante'],
    escala: 'Upsell em todos os checkouts',
    riscos: ['Churn', 'Logística 60d'],
  },
  monetizacao: {
    tipo: 'B2C',
    valores: 'R$ 2.382 (Sócio) · R$ 2.882 (Não-sócio)',
  },
};

/** 12 raios do Sol: 11 produtos + Assinatura 6m */
export const FLUXOS_SOL: FluxoEntry[] = [
  ...FLUXOS_PRODUTOS,
  FLUXO_ASSINATURA,
];

export const FLUXOS: FluxoEntry[] = [
  ...FLUXOS_PRODUTOS,
  FLUXO_ASSINATURA,
  ...TRIAGENS_SLUGS.map((slug, i) => buildFluxoTriagem(slug, 12 + i + 1)),
];

/** Label curto para o Sol (comercial, compacto) */
export const LABEL_SOL: Record<string, string> = {
  emagrecimento: 'MetaboSlim',
  calvicie: 'CapilMax',
  sono: 'SonoZen',
  ansiedade: 'ZenDay',
  intestino: 'FloraBalance',
  figado: 'HepaDetox',
  'libido-masculina': 'VigorMax',
  menopausa: 'FemBalance',
  articulacoes: 'ArticFlex',
  imunidade: 'Imuno360',
  tirzepatida: 'Metabólico Rx',
  'assinatura-6m': 'Assinatura 6m',
};

export function getFluxoBySlug(slug: string): FluxoEntry | null {
  return FLUXOS.find((f) => f.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return FLUXOS.map((f) => f.slug);
}
