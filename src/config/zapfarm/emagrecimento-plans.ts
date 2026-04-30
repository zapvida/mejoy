/**
 * Configuração centralizada dos planos de emagrecimento
 *
 * Esta é a fonte única de verdade para todos os planos de emagrecimento
 * (checkout, APIs e valores numéricos em `ZAPFARM_PRODUCTS.emagrecimento` via `getPlanById`).
 * Todos os componentes devem usar esta configuração para garantir consistência.
 *
 * Última atualização: Março 2025
 * Estratégia: 3 acompanhamentos (clínico, nutricionista, psicólogo) + retorno + exames + acompanhamento mensal
 * Medicação: tirzepatida, semaglutida ou outras, conforme avaliação médica
 */

export interface EmagrecimentoPlan {
  id: 'programa-1m' | 'programa-3m' | 'programa-6m';
  badge: string;
  title: string;
  subtitle: string;
  priceMain: string; // Ex: "12x de R$ 167"
  priceDetail: string; // Ex: "Total de R$ 2.000 em até 12x sem juros no cartão"
  totalAmount: number; // Valor total em reais (ex: 2000)
  totalAmountCents: number; // Valor total em centavos para env vars (ex: 200000)
  monthlyInstallment: number; // Valor da parcela mensal em reais (ex: 167)
  installments: number; // Número de parcelas (12)
  highlight: boolean;
  recommended: boolean;
  bullets: string[];
  ctaLabel: string;
  asaasEnvVar: string;
  duration: string; // Duração do programa
}

/** Bullets comuns a todos os planos — benefícios que estimulam a compra */
const BULLETS_BASE = [
  'Consulta com clínico médico especialista',
  'Consulta com nutricionista para plano alimentar personalizado',
  'Consulta com psicólogo para suporte emocional e aderência',
  'Consulta de retorno com clínico para ajustes e acompanhamento',
  'Exames de check-up solicitados e acompanhados pelo médico',
  'Acompanhamento mensal por WhatsApp com a equipe',
  'Tratamento completo: medicação (tirzepatida, semaglutida ou outras) quando indicada',
];

export const emagrecimentoPlans: EmagrecimentoPlan[] = [
  {
    id: 'programa-1m',
    badge: 'Comece com segurança',
    title: 'Programa 1 Mês',
    subtitle: 'Um mês de acompanhamento completo para iniciar.',
    priceMain: '12x de R$ 166,67',
    priceDetail: 'Total de R$ 2.000 em até 12x sem juros no cartão.',
    totalAmount: 2000,
    totalAmountCents: 200000,
    monthlyInstallment: 166.67,
    installments: 12,
    highlight: false,
    recommended: false,
    bullets: [
      ...BULLETS_BASE,
      '1 mês de acompanhamento contínuo',
      'Ideal para começar e validar o tratamento',
    ],
    ctaLabel: 'Começar com segurança',
    asaasEnvVar: 'ASAAS_PRICE_EMAGRECIMENTO_BASICO',
    duration: '1 mês',
  },
  {
    id: 'programa-3m',
    badge: 'Mais escolhido',
    title: 'Programa 3 Meses',
    subtitle: 'Três meses de cuidado contínuo.',
    priceMain: '12x de R$ 333,33',
    priceDetail: 'Total de R$ 4.000 em até 12x sem juros no cartão.',
    totalAmount: 4000,
    totalAmountCents: 400000,
    monthlyInstallment: 333.33,
    installments: 12,
    highlight: true,
    recommended: true,
    bullets: [
      ...BULLETS_BASE,
      '3 meses de acompanhamento contínuo',
      'Consultas de retorno para ajustes finos',
      'Melhor custo-benefício para resultados duradouros',
    ],
    ctaLabel: 'Escolher plano recomendado',
    asaasEnvVar: 'ASAAS_PRICE_EMAGRECIMENTO_COMPLETO',
    duration: '3 meses',
  },
  {
    id: 'programa-6m',
    badge: 'Mais completo',
    title: 'Programa 6 Meses',
    subtitle: 'Seis meses com médico e time do seu lado.',
    priceMain: '12x de R$ 500',
    priceDetail: 'Total de R$ 6.000 em até 12x sem juros no cartão.',
    totalAmount: 6000,
    totalAmountCents: 600000,
    monthlyInstallment: 500,
    installments: 12,
    highlight: false,
    recommended: false,
    bullets: [
      ...BULLETS_BASE,
      '6 meses de acompanhamento contínuo',
      'Consultas de retorno ampliadas ao longo do tratamento',
      'Plano de manutenção para evitar reganho de peso',
      'Prioridade no atendimento e suporte da equipe',
    ],
    ctaLabel: 'Quero o mais completo',
    asaasEnvVar: 'ASAAS_PRICE_EMAGRECIMENTO_PREMIUM',
    duration: '6 meses',
  },
];

/** URL do plantão ZapVida — falar com médico antes de comprar */
export const PLANTÃO_ZAPVIDA_URL = 'https://zapvida.com/pay/plantao';

export function buildZapVidaPlantaoUrl(utmContent: string): string {
  const url = new URL(PLANTÃO_ZAPVIDA_URL);
  url.searchParams.set('utm_source', 'mejoy');
  url.searchParams.set('utm_medium', 'clinical_direct');
  url.searchParams.set('utm_campaign', 'emagrecimento_clinico');
  url.searchParams.set('utm_content', utmContent);
  return url.toString();
}

/**
 * Nota legal obrigatória para exibir junto com os planos
 */
export const emagrecimentoLegalNote =
  'O uso de medicações como GLP-1 (tirzepatida, semaglutida ou outras) depende sempre da avaliação do médico. Nenhuma prescrição é automática: o clínico decide junto com você, seguindo as diretrizes atuais de obesidade.';

/**
 * Mapeamento de IDs antigos (basico/completo/premium) para novos (programa-1m/3m/6m)
 * Usado pela API Asaas e pelo planRecommendation
 */
export const planIdMapping = {
  basico: 'programa-1m',
  completo: 'programa-3m',
  premium: 'programa-6m',
  /** Compatibilidade: mensal/trimestral/semestral do planRecommendation */
  mensal: 'programa-1m',
  trimestral: 'programa-3m',
  semestral: 'programa-6m',
} as const;

/**
 * Mapeamento reverso: plano ID → chave API (basico/completo/premium)
 */
export const planIdToApiKey: Record<string, 'basico' | 'completo' | 'premium'> = {
  'programa-1m': 'basico',
  'programa-3m': 'completo',
  'programa-6m': 'premium',
  // IDs legados
  'start-glp1': 'basico',
  'programa-glp1-3m': 'completo',
  'programa-glp1-6m-premium': 'premium',
};

/**
 * Função helper para obter plano por ID (suporta IDs antigos e novos)
 */
export function getPlanById(id: string): EmagrecimentoPlan | undefined {
  const mappedId = planIdMapping[id as keyof typeof planIdMapping] || id;
  return emagrecimentoPlans.find((plan) => plan.id === mappedId);
}

/**
 * Função helper para obter plano recomendado
 */
export function getRecommendedPlan(): EmagrecimentoPlan {
  return emagrecimentoPlans.find((plan) => plan.recommended) || emagrecimentoPlans[1];
}
