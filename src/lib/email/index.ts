/**
 * Sistema de envio de emails da Me Joy
 * 
 * Usa Resend como provedor de email transacional.
 * 
 * Configuração necessária:
 * - RESEND_API_KEY: API key do Resend
 * - EMAIL_FROM: Email remetente (padrão: Me Joy <noreply@zapfarm.com.br>)
 * - EMAIL_REPLY_TO: Email para respostas (padrão: contato@zapfarm.com.br)
 * - NEXT_PUBLIC_SITE_URL: URL base do site
 */

export { sendEmail, isValidEmail, normalizeEmail } from './client';
export type { EmailData, EmailResult, EmailTemplate, EmailTemplateData } from './types';

// Funções de conveniência para casos de uso comuns
import { sendEmail } from './client';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zapfarm.com.br';

/**
 * Envia email quando triagem é completada
 */
export async function sendTriageCompletedEmail(
  email: string,
  data: { name?: string; firstName?: string; reportUrl?: string }
) {
  // Validar email antes de enviar
  if (!email || !email.includes('@')) {
    console.warn('[sendTriageCompletedEmail] Email inválido:', email);
    return { success: false, error: 'Email inválido' };
  }

  return sendEmail({
    to: email.trim().toLowerCase(),
    subject: 'Triagem recebida - Me Joy',
    template: 'triage-completed',
    data: {
      ...data,
      email: email.trim().toLowerCase(),
      reportUrl: data.reportUrl || `${siteUrl}/dashboard`,
    },
  });
}

/**
 * Envia email quando relatório está pronto
 */
export async function sendReportReadyEmail(
  email: string,
  data: { name?: string; firstName?: string; reportUrl: string; triageType?: string }
) {
  // Validar email antes de enviar
  if (!email || !email.includes('@')) {
    console.warn('[sendReportReadyEmail] Email inválido:', email);
    return { success: false, error: 'Email inválido' };
  }

  return sendEmail({
    to: email.trim().toLowerCase(),
    subject: 'Seu relatório Me Joy está pronto 📄',
    template: 'report-ready',
    data: {
      ...data,
      email: email.trim().toLowerCase(),
      reportUrl: data.reportUrl,
    },
  });
}

/**
 * Envia email de confirmação de pagamento
 */
export async function sendPaymentConfirmedEmail(
  email: string,
  data: {
    name?: string;
    firstName?: string;
    productName?: string;
    amount: number;
    orderId?: string;
    paymentMethod?: string;
  }
) {
  // Validar email antes de enviar
  if (!email || !email.includes('@')) {
    console.warn('[sendPaymentConfirmedEmail] Email inválido:', email);
    return { success: false, error: 'Email inválido' };
  }

  return sendEmail({
    to: email.trim().toLowerCase(),
    subject: 'Pagamento confirmado - Me Joy ✅',
    template: 'payment-confirmed',
    data: {
      ...data,
      email: email.trim().toLowerCase(),
    },
  });
}

/**
 * Envia email de boas-vindas
 */
export async function sendWelcomeEmail(email: string, data: { name?: string; firstName?: string }) {
  // Validar email antes de enviar
  if (!email || !email.includes('@')) {
    console.warn('[sendWelcomeEmail] Email inválido:', email);
    return { success: false, error: 'Email inválido' };
  }

  return sendEmail({
    to: email.trim().toLowerCase(),
    subject: 'Bem-vindo(a) à Me Joy! 🎉',
    template: 'welcome',
    data: {
      ...data,
      email: email.trim().toLowerCase(),
    },
  });
}

/**
 * Envia email de presente recebido
 */
export async function sendGiftReceivedEmail(
  email: string,
  data: {
    name?: string;
    firstName?: string;
    giftCode: string;
    giftMessage?: string;
  }
) {
  // Validar email antes de enviar
  if (!email || !email.includes('@')) {
    console.warn('[sendGiftReceivedEmail] Email inválido:', email);
    return { success: false, error: 'Email inválido' };
  }

  return sendEmail({
    to: email.trim().toLowerCase(),
    subject: 'Você recebeu um presente! 🎁',
    template: 'gift-received',
    data: {
      ...data,
      email: email.trim().toLowerCase(),
    },
  });
}

/**
 * Envia email de follow-up D+1 (24h depois)
 */
export async function sendFollowUpD1Email(
  email: string,
  data: {
    name?: string;
    firstName?: string;
    tipSono?: string;
    tipNutricao?: string;
    tipRotina?: string;
  }
) {
  // Validar email antes de enviar
  if (!email || !email.includes('@')) {
    console.warn('[sendFollowUpD1Email] Email inválido:', email);
    return { success: false, error: 'Email inválido' };
  }

  return sendEmail({
    to: email.trim().toLowerCase(),
    subject: '3 passos práticos para hoje',
    template: 'follow-up-d1',
    data: {
      ...data,
      email: email.trim().toLowerCase(),
    },
  });
}

/**
 * Envia email de follow-up D+3 (72h depois)
 */
export async function sendFollowUpD3Email(email: string, data: { name?: string; firstName?: string }) {
  // Validar email antes de enviar
  if (!email || !email.includes('@')) {
    console.warn('[sendFollowUpD3Email] Email inválido:', email);
    return { success: false, error: 'Email inválido' };
  }

  return sendEmail({
    to: email.trim().toLowerCase(),
    subject: 'Desbloqueie todas as triagens por R$ 49',
    template: 'follow-up-d3',
    data: {
      ...data,
      email: email.trim().toLowerCase(),
    },
  });
}

/**
 * Envia email de follow-up D+7 (7 dias depois)
 */
/**
 * Envia email de confirmação de pedido Store V2 (quando PAID via webhook)
 */
export async function sendStoreV2OrderConfirmedEmail(
  email: string,
  data: {
    name?: string;
    firstName?: string;
    orderId: string;
    items: Array<{ name: string; quantity: number; priceCents: number }>;
    totalCents: number;
    shippingCents?: number;
    shippingDays?: number;
    address?: string;
  }
) {
  if (!email || !email.includes('@')) {
    console.warn('[sendStoreV2OrderConfirmedEmail] Email inválido:', email);
    return { success: false, error: 'Email inválido' };
  }

  return sendEmail({
    to: email.trim().toLowerCase(),
    subject: 'Compra confirmada! ✅ Me Joy',
    template: 'store-v2-order-confirmed',
    data: {
      ...data,
      email: email.trim().toLowerCase(),
    },
  });
}

export async function sendStoreV2OrderShippedEmail(
  email: string,
  data: { name?: string; firstName?: string; orderId: string; trackingCode?: string; trackingUrl?: string }
) {
  if (!email || !email.includes('@')) return { success: false, error: 'Email inválido' };
  return sendEmail({
    to: email.trim().toLowerCase(),
    subject: 'Seu pedido foi enviado! 🚚 Me Joy',
    template: 'store-v2-order-shipped',
    data: { ...data, email: email.trim().toLowerCase() },
  });
}

export async function sendStoreV2OrderDeliveredEmail(
  email: string,
  data: { name?: string; firstName?: string; orderId: string }
) {
  if (!email || !email.includes('@')) return { success: false, error: 'Email inválido' };
  return sendEmail({
    to: email.trim().toLowerCase(),
    subject: 'Pedido entregue! 🏠 Me Joy',
    template: 'store-v2-order-delivered',
    data: { ...data, email: email.trim().toLowerCase() },
  });
}

export async function sendFollowUpD7Email(email: string, data: { name?: string; firstName?: string }) {
  // Validar email antes de enviar
  if (!email || !email.includes('@')) {
    console.warn('[sendFollowUpD7Email] Email inválido:', email);
    return { success: false, error: 'Email inválido' };
  }

  return sendEmail({
    to: email.trim().toLowerCase(),
    subject: 'Um presente útil de verdade 🎁',
    template: 'follow-up-d7',
    data: {
      ...data,
      email: email.trim().toLowerCase(),
    },
  });
}

