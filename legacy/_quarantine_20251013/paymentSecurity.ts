// src/lib/paymentSecurity.ts
// Sistema de pagamentos blindado com idempotência e segurança

import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

// Interface para webhook idempotente
interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  created: number;
}

// Cache de eventos processados (em produção, usar Redis)
const processedEvents = new Set<string>();

// Função para verificar se evento já foi processado
export function isEventProcessed(eventId: string): boolean {
  return processedEvents.has(eventId);
}

// Função para marcar evento como processado
export function markEventProcessed(eventId: string): void {
  processedEvents.add(eventId);
}

// Função para processar webhook com idempotência
export async function processWebhookIdempotent(event: WebhookEvent): Promise<boolean> {
  // Verificar se evento já foi processado
  if (isEventProcessed(event.id)) {
    console.log(`🔄 Evento ${event.id} já processado, ignorando`);
    return false;
  }

  // Marcar como processado ANTES de processar (evita race conditions)
  markEventProcessed(event.id);

  try {
    await processWebhookEvent(event);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao processar evento ${event.id}:`, error);
    // Em caso de erro, remover da lista para permitir reprocessamento
    processedEvents.delete(event.id);
    throw error;
  }
}

// Processamento principal do webhook
async function processWebhookEvent(event: WebhookEvent): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;
    
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
      break;
    
    default:
      console.log(`Evento não tratado: ${event.type}`);
  }
}

// Handler para checkout completado (modo payment)
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const { plan, priceId, userId, reportId, score, ...metadata } = session.metadata || {};
  
  console.log('✅ CHECKOUT SESSION COMPLETED:', {
    sessionId: session.id,
    plan,
    priceId,
    userId,
    reportId,
    score
  });

  // Verificar se já existe subscription para esta sessão (idempotência)
  const existingSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: session.id }
  });

  if (existingSubscription) {
    console.log(`🔄 Subscription já existe para sessão ${session.id}`);
    return;
  }

  if (plan === 'pass' || plan === 'assinatura') {
    // Criar passe de 30 dias
    const subscription = await prisma.subscription.create({
      data: {
        userId: userId || 'temp_user',
        kind: 'self',
        activeFrom: new Date(),
        activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        status: 'active',
        stripeSubscriptionId: session.id,
        stripeCustomerId: session.customer as string
      }
    });

    console.log('✅ Passe de 30 dias criado/atualizado:', subscription.id);
  }

  if (plan === 'presente') {
    // Verificar se presente já existe
    const existingGift = await prisma.gift.findFirst({
      where: { stripeSessionId: session.id }
    });

    if (existingGift) {
      console.log(`🔄 Presente já existe para sessão ${session.id}`);
      return;
    }

    // Criar presente com código único
    const giftCode = generateGiftCode();
    
    const gift = await prisma.gift.create({
      data: {
        giverUserId: userId || 'temp_user',
        recipientName: metadata.nomePresenteado || 'Presenteado',
        recipientEmail: metadata.emailPresenteado,
        recipientWhats: metadata.whatsappPresenteado,
        message: metadata.mensagem,
        code: giftCode,
        stripeSessionId: session.id,
        expiresAt: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 meses
        status: 'active'
      }
    });

    console.log('✅ Presente criado:', gift.id);

    // Enviar presente via WhatsApp (com retry)
    if (metadata.whatsappPresenteado) {
      await sendGiftMessageWithRetry(metadata.whatsappPresenteado, giftCode, metadata.mensagem);
    }
  }
}

// Handler para payment intent succeeded (Pix assíncrono)
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log('✅ PAYMENT INTENT SUCCEEDED:', paymentIntent.id);
  
  // Buscar sessão relacionada
  const session = await stripe.checkout.sessions.list({
    payment_intent: paymentIntent.id,
    limit: 1
  });

  if (session.data.length > 0) {
    const checkoutSession = session.data[0];
    await handleCheckoutCompleted(checkoutSession);
  }
}

// Handler para payment intent failed
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log('❌ PAYMENT INTENT FAILED:', paymentIntent.id);
  
  // Log do erro para análise
  console.error('Payment failed:', {
    id: paymentIntent.id,
    last_payment_error: paymentIntent.last_payment_error,
    status: paymentIntent.status
  });
}

// Função para gerar código de presente único
function generateGiftCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Função para enviar mensagem de presente com retry
// eslint-disable-next-line no-unused-vars
async function sendGiftMessageWithRetry(whatsapp: string, giftCode: string, _message?: string): Promise<void> {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Implementar envio via WhatsApp API
      console.log(`📱 Enviando presente para ${whatsapp}: ${giftCode}`);
      // await sendWhatsAppMessage(whatsapp, `🎁 Seu presente AlloeHealth: ${giftCode}`);
      break;
    } catch (error) {
      retries++;
      console.error(`❌ Erro ao enviar presente (tentativa ${retries}):`, error);
      
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Backoff exponencial
      }
    }
  }
}

// Função para validar webhook signature
export function validateWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error}`);
  }
}

// Função para processar resgate de presente
export async function redeemGiftCode(code: string, userId: string): Promise<boolean> {
  const gift = await prisma.gift.findFirst({
    where: {
      code: code,
      status: 'active',
      expiresAt: { gt: new Date() }
    }
  });

  if (!gift) {
    return false;
  }

  // Verificar se já foi resgatado
  if (gift.redeemedAt || gift.redeemedByUserId) {
    return false;
  }

  // Resgatar presente
  await prisma.gift.update({
    where: { id: gift.id },
    data: {
      redeemedAt: new Date(),
      redeemedByUserId: userId,
      status: 'redeemed'
    }
  });

  // Criar subscription de 30 dias para o usuário
  await prisma.subscription.create({
    data: {
      userId: userId,
      kind: 'gift',
      activeFrom: new Date(),
      activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      status: 'active',
      stripeSubscriptionId: `gift_${gift.id}`,
      stripeCustomerId: null
    }
  });

  return true;
}

// Função para verificar se usuário tem acesso ativo
export async function hasActiveAccess(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
      status: 'active',
      activeUntil: { gt: new Date() }
    }
  });

  return !!subscription;
}

// Função para obter subscription ativa do usuário
export async function getActiveSubscription(userId: string) {
  return await prisma.subscription.findFirst({
    where: {
      userId: userId,
      status: 'active',
      activeUntil: { gt: new Date() }
    }
  });
}
