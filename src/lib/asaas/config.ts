/**
 * Configuração do Asaas - Sistema de Pagamento Brasileiro
 * 
 * O Asaas oferece:
 * - PIX (pagamento instantâneo)
 * - Cartão de Crédito (parcelado em até 12x)
 * - Boleto Bancário
 * - Webhooks para notificações de pagamento
 */

export const ASAAS_CONFIG = {
  // URLs da API do Asaas
  API_URL: {
    PRODUCTION: 'https://api.asaas.com/v3',
    SANDBOX: 'https://sandbox.asaas.com/api/v3',
  },

  // Configurações de checkout
  CHECKOUT: {
    successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/obrigado?payment_id={paymentId}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/triagem`,
    billingPortalReturnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`,
  },

  // Eventos de webhook importantes
  WEBHOOK_EVENTS: [
    'PAYMENT_CREATED',      // Pagamento criado
    'PAYMENT_UPDATED',      // Pagamento atualizado
    'PAYMENT_CONFIRMED',    // Pagamento confirmado (PIX pago, cartão aprovado)
    'PAYMENT_RECEIVED',     // Pagamento recebido
    'PAYMENT_OVERDUE',      // Pagamento vencido
    'PAYMENT_DELETED',      // Pagamento deletado
    'PAYMENT_RESTORED',     // Pagamento restaurado
    'PAYMENT_REFUNDED',     // Pagamento reembolsado
  ],

  // Configurações de produto
  PRODUCT: {
    name: 'Me Joy',
    description: 'Acesso completo aos recursos do Me Joy',
  },

  // Métodos de pagamento disponíveis
  PAYMENT_METHODS: {
    PIX: 'PIX',
    CREDIT_CARD: 'CREDIT_CARD',
    BOLETO: 'BOLETO',
  },
};

export type PaymentMethod = keyof typeof ASAAS_CONFIG.PAYMENT_METHODS;

// Função para obter a URL da API baseada no ambiente
export function getAsaasApiUrl(): string {
  const isProduction = process.env.ASAAS_ENVIRONMENT === 'production';
  return isProduction 
    ? ASAAS_CONFIG.API_URL.PRODUCTION 
    : ASAAS_CONFIG.API_URL.SANDBOX;
}

// Função para formatar preço (Asaas trabalha com centavos)
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount / 100);
}

// Função para converter reais em centavos
export function reaisToCentavos(reais: number): number {
  return Math.round(reais * 100);
}

// Função para converter centavos em reais
export function centavosToReais(centavos: number): number {
  return centavos / 100;
}

