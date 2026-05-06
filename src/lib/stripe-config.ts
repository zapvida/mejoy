// import Stripe from 'stripe'; // Não usado diretamente aqui

// Configuração dos planos Stripe - PR-2 Monetização Fechada
export const STRIPE_CONFIG = {
  // Planos de assinatura - IDs dos prices no Stripe
  PLANS: {
    PLUS_MONTHLY: {
      id: 'plan_plus_monthly',
      priceId: process.env.STRIPE_PRICE_PLUS_MONTHLY ?? '',
      amount: 2990, // R$ 29,90 em centavos
      currency: 'brl',
      interval: 'month',
      name: 'Plano Plus Mensal',
      description: 'Plano principal com opção de presente e assentos extras.',
      features: [
        'Relatórios ilimitados',
        'Consultas virtuais',
        'Monitoramento contínuo',
        'Integração Stripe → Webhook → GHL'
      ]
    },
    PLUS_YEARLY: {
      id: 'plan_plus_yearly',
      priceId: process.env.STRIPE_PRICE_PLUS_YEARLY ?? '',
      amount: 29900, // R$ 299,00 em centavos (10 meses)
      currency: 'brl',
      interval: 'year',
      name: 'Plano Plus Anual',
      description: 'Economia de 2 meses com gift e assentos extras integrados.',
      features: [
        'Tudo do plano mensal',
        'Preço especial para presente',
        'Até 10 assentos extras',
        'Economia de 2 meses'
      ]
    }
  },
  
  // Configurações de checkout
  CHECKOUT: {
    successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?cancelled=true`,
    billingPortalReturnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`
  },

  // Webhook events importantes
  WEBHOOK_EVENTS: [
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
    'invoice.payment_failed'
  ],

  // Configurações de produto
  PRODUCT: {
    name: 'MeJoy',
    description: 'Acesso completo aos recursos do MeJoy'
  }
};

export type PlanType = keyof typeof STRIPE_CONFIG.PLANS;
export type PlanConfig = typeof STRIPE_CONFIG.PLANS[PlanType];

// Função para obter configuração do plano
export function getPlanConfig(planType: PlanType): PlanConfig {
  return STRIPE_CONFIG.PLANS[planType];
}

// Função para calcular economia anual
export function calculateYearlySavings(monthlyPrice: number): number {
  const yearlyPrice = monthlyPrice * 10; // 10 meses de desconto
  const fullYearPrice = monthlyPrice * 12;
  return fullYearPrice - yearlyPrice;
}

// Função para formatar preço
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount / 100);
}
