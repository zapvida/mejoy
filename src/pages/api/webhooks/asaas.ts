import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import type { AsaasWebhookEvent, AsaasPaymentResponse } from '@/lib/asaas/client';
import { advanceLead } from '@/lib/funnel/service';
import { storeLogger } from '@/lib/store-v2/logger';
import { sendPaymentConfirmedEmail, sendStoreV2OrderConfirmedEmail, sendWelcomeEmail } from '@/lib/email';
import { createMagicLink } from '@/lib/auth/magic-link';
import { sendEvolutionMessage, sendEvolutionMessageStoreV2 } from '@/lib/evolution/client';
import { prisma } from '@/lib/prisma';
import { buildOrderAccessUrl } from '@/lib/store-v2/order-access';
import { ensureCheckoutProfile } from '@/lib/zapfarm/profile-link';
import { upsertZapfarmOrderFromPayment } from '@/lib/zapfarm/order-sync';

export const config = { api: { bodyParser: false } };

/**
 * Valida token do webhook.
 * Em produção, ASAAS_WEBHOOK_TOKEN é obrigatório e falha fechado se ausente.
 */
function validateWebhookToken(req: NextApiRequest): { ok: boolean; reason?: string; status?: number } {
  const expected = process.env.ASAAS_WEBHOOK_TOKEN;

  if (!expected || expected.trim() === '') {
    if (process.env.NODE_ENV === 'production') {
      storeLogger.error('ASAAS_WEBHOOK_TOKEN missing in production', undefined, { env: 'production' });
      return { ok: false, reason: 'Webhook não configurado', status: 500 };
    }
    return { ok: true };
  }

  const token =
    (req.headers['asaas-access-token'] as string) ||
    (req.headers['x-asaas-webhook-token'] as string) ||
    (req.query.token as string);
  if (!token || token !== expected) {
    storeLogger.error('Webhook token invalid or missing', undefined, { env: process.env.NODE_ENV });
    return { ok: false, reason: 'Token inválido', status: 401 };
  }
  return { ok: true };
}

/**
 * Webhook do Asaas para notificações de pagamento
 *
 * URL: https://www.mejoy.com.br/api/webhooks/asaas
 * Configuração no Asaas Dashboard:
 * 1. Ir em Configurações > Webhooks
 * 2. URL: https://www.mejoy.com.br/api/webhooks/asaas
 * 3. Selecionar eventos: PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE
   * 4. Token obrigatório em produção: ASAAS_WEBHOOK_TOKEN deve ser enviado no header x-asaas-webhook-token
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const tokenCheck = validateWebhookToken(req);
  if (!tokenCheck.ok) {
    return res.status(tokenCheck.status || 401).json({ error: tokenCheck.reason || 'Token inválido' });
  }

  try {
    const rawBody = await buffer(req);
    const body = JSON.parse(rawBody.toString()) as AsaasWebhookEvent;

    if (!body.event || !body.payment) {
      return res.status(400).json({ error: 'Evento inválido' });
    }

    const event = body.event;
    const payment = body.payment as AsaasPaymentResponse;
    const eventId = `asaas_${payment.id}_${event}`;

    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });
    if (existingEvent) {
      return res.status(200).json({ received: true, event, idempotent: true });
    }

    const tipo = payment.metadata?.tipo;
    if (!tipo || (!tipo.startsWith('zapfarm') && tipo !== 'store_v2')) {
      return res.status(200).json({ received: true, skipped: 'not_our_order' });
    }

    if (tipo === 'store_v2') {
      storeLogger.webhook('Store V2 webhook received', {
        event,
        paymentId: payment.id,
        eventId,
      });
      await processStoreV2Payment(payment);
      await prisma.webhookEvent.create({
        data: { provider: 'asaas', eventId },
      });
      storeLogger.webhook('Store V2 webhook processed', {
        event,
        paymentId: payment.id,
      });
      return res.status(200).json({ received: true, event });
    }

    if (['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED', 'PAYMENT_UPDATED'].includes(event)) {
      await processPayment(payment);
    } else if (event === 'PAYMENT_OVERDUE') {
      await processOverduePayment(payment);
    } else if (event === 'PAYMENT_DELETED') {
      await processDeletedPayment(payment);
    } else if (event === 'PAYMENT_REFUNDED') {
      await processRefundedPayment(payment);
    }

    if (body.subscription && ['SUBSCRIPTION_CREATED', 'SUBSCRIPTION_UPDATED', 'SUBSCRIPTION_DELETED'].includes(event)) {
      await processSubscription(body.subscription, payment);
    }

    await prisma.webhookEvent.create({
      data: { provider: 'asaas', eventId },
    });
    return res.status(200).json({ received: true, event });
  } catch (error: unknown) {
    storeLogger.error('Webhook processing failed', error as Error, {
      message: (error as Error)?.message,
      stack: (error as Error)?.stack,
    });
    return res.status(200).json({
      received: true,
      error: 'Erro ao processar webhook (verificar logs)',
    });
  }
}

async function processPayment(payment: AsaasPaymentResponse) {
  try {
    const tipo = payment.metadata?.tipo || '';

    if (tipo === 'zapfarm_subscription') {
      await processSubscriptionPayment(payment);
      return;
    }

    const customerEmail = payment.metadata?.customer_email || '';
    const customerPhone = payment.metadata?.customer_phone || null;
    const productSlug = payment.metadata?.product || '';
    const planSlug = payment.metadata?.plano || '';

    if (!productSlug || !planSlug || !customerEmail) {
      console.error('[webhooks/asaas] Dados incompletos no pagamento:', {
        paymentId: payment.id,
        productSlug,
        planSlug,
        hasCustomerEmail: Boolean(customerEmail),
      });
      return;
    }

    const profile = await ensureCheckoutProfile({
      email: customerEmail,
      name: payment.metadata?.customer_name || null,
      whatsapp: customerPhone,
    });

    const synced = await upsertZapfarmOrderFromPayment(payment, {
      profileId: profile?.id ?? null,
    });

    if (!synced) {
      return;
    }

    const { order, status, wasAlreadyPaid } = synced;
    const profileId = profile?.id ?? null;

    console.log('[webhooks/asaas] Pedido processado:', {
      orderId: order.id,
      productSlug,
      planSlug,
      status,
      amount: order.amount,
      paymentId: payment.id,
    });

    if (status === 'PAID' && profileId) {
      advanceLead({
        profileId,
        productSlug: productSlug || undefined,
        step: 'paid',
        source: 'asaas_webhook',
      }).catch((e) => console.warn('[webhooks/asaas] advanceLead:', e));
    }

    if (status === 'PAID' && !wasAlreadyPaid && customerEmail) {
      const customerName = payment.metadata?.customer_name || 'Cliente';
      const productName = `${productSlug} - ${planSlug}`;
      const amountInReais = order.amount / 100;

      try {
        await sendPaymentConfirmedEmail(customerEmail, {
          name: customerName,
          firstName: customerName.split(' ')[0],
          productName,
          amount: amountInReais,
          orderId: order.id,
          paymentMethod: payment.billingType === 'PIX' ? 'PIX' : payment.billingType === 'CREDIT_CARD' ? 'Cartão de crédito' : 'Boleto',
        });
        await sendWelcomeEmail(customerEmail, {
          name: customerName,
          firstName: customerName.split(' ')[0],
        });
      } catch (emailError) {
        console.error('[webhooks/asaas] Erro ao enviar emails:', emailError);
      }

      if (profileId && customerPhone) {
        try {
          const magic = await createMagicLink({ profileId, redirectPath: '/dashboard' });
          if (magic?.magicUrl) {
            const nome = customerName.split(' ')[0] || 'Cliente';
            const msg1 = `Olá ${nome}! Sua compra foi processada. Acesse seu painel: ${magic.magicUrl}`;
            await sendEvolutionMessage(customerPhone, msg1);
            const msg2 = 'Você receberá mais informações por WhatsApp e Email em algumas horas. Qualquer dúvida, use o link anterior para acessar seu dashboard. Digite MENU para opções; uma secretária inteligente irá responder. Aguarde.';
            await sendEvolutionMessage(customerPhone, msg2);
          }
        } catch (waError) {
          console.warn('[webhooks/asaas] Erro ao enviar WhatsApp:', waError);
        }
      }
    }
  } catch (error: unknown) {
    console.error('[webhooks/asaas] Erro ao processar pedido:', {
      paymentId: payment.id,
      error: (error as Error)?.message,
      stack: (error as Error)?.stack,
    });
    throw error;
  }
}

async function processOverduePayment(payment: AsaasPaymentResponse) {
  await prisma.zapfarmOrder.updateMany({
    where: { asaasPaymentId: payment.id },
    data: { status: 'OVERDUE', updatedAt: new Date() },
  });
}

async function processDeletedPayment(payment: AsaasPaymentResponse) {
  await prisma.zapfarmOrder.updateMany({
    where: { asaasPaymentId: payment.id },
    data: { status: 'CANCELED', updatedAt: new Date() },
  });
}

async function processRefundedPayment(payment: AsaasPaymentResponse) {
  await prisma.zapfarmOrder.updateMany({
    where: { asaasPaymentId: payment.id },
    data: { status: 'REFUNDED', updatedAt: new Date() },
  });
}

async function processSubscriptionPayment(payment: AsaasPaymentResponse) {
  const plan = payment.metadata?.plan || 'plus';
  const period = payment.metadata?.period || 'monthly';
  const variant = payment.metadata?.variant || 'standard';
  const customerEmail = payment.metadata?.customer_email || payment.customer || '';
  const status =
    payment.status === 'CONFIRMED' || payment.status === 'RECEIVED' || payment.status === 'RECEIVED_IN_CASH'
      ? 'PAID'
      : 'PENDING';

  console.log('[webhooks/asaas] Pagamento de assinatura processado:', {
    paymentId: payment.id,
    plan,
    period,
    variant,
    status,
    customerEmail,
  });
}

async function processStoreV2Payment(payment: AsaasPaymentResponse) {
  const status =
    payment.status === 'CONFIRMED' || payment.status === 'RECEIVED' || payment.status === 'RECEIVED_IN_CASH'
      ? 'PAID'
      : payment.status === 'OVERDUE'
        ? 'OVERDUE'
        : payment.status === 'REFUNDED'
          ? 'REFUNDED'
          : payment.deleted
            ? 'CANCELED'
            : 'PENDING_PAYMENT';

  const existing = await prisma.order.findFirst({
    where: { asaasPaymentId: payment.id },
    select: { status: true },
  });
  const wasAlreadyPaid = existing?.status === 'PAID';

  await prisma.order.updateMany({
    where: { asaasPaymentId: payment.id },
    data: { status, updatedAt: new Date() },
  });

  const customerEmail = payment.metadata?.customer_email;
  const customerPhone = payment.metadata?.customer_phone as string | undefined;
  if (status === 'PAID' && customerEmail && !wasAlreadyPaid) {
    const order = await prisma.order.findFirst({
      where: { asaasPaymentId: payment.id },
    });
    if (order) {
      const snap = order.snapshot as {
        items?: Array<{ name: string; quantity: number; priceCents: number }>;
        subtotalCents?: number;
        shippingCents?: number;
        totalCents?: number;
      } | null;
      const items = snap?.items ?? [];
      try {
        await sendStoreV2OrderConfirmedEmail(customerEmail, {
          name: order.customerName,
          firstName: order.customerName?.split(' ')[0] || 'Cliente',
          orderId: order.id,
          items,
          totalCents: order.totalCents,
          shippingCents: order.shippingCents,
          shippingDays: order.shippingDays ?? undefined,
          orderUrl: buildOrderAccessUrl({
            orderId: order.id,
            customerEmail,
          }),
        });
      } catch (emailErr) {
        storeLogger.error('Store V2 confirmation email failed', emailErr as Error, {
          orderId: order.id,
          customerEmail,
        });
      }

      // WhatsApp (Evolution) + Magic Link para acesso ao dashboard
      if (customerPhone) {
        try {
          let profileId: string | null = order.profileId;
          if (!profileId) {
            let profile = await prisma.profile.findFirst({
              where: { email: { equals: customerEmail, mode: 'insensitive' } },
            });
            if (!profile) {
              profile = await prisma.profile.create({
                data: {
                  email: customerEmail.toLowerCase(),
                  name: order.customerName ?? undefined,
                  whatsapp: customerPhone ?? undefined,
                },
              });
            }
            profileId = profile.id;
            await prisma.order.update({
              where: { id: order.id },
              data: { profileId },
            });
          }

          const magic = await createMagicLink({ profileId, redirectPath: '/dashboard' });
          if (magic?.magicUrl) {
            const nome = (order.customerName?.split(' ')[0]) || 'Cliente';
            const msg = `Olá ${nome}! Sua compra MeJoy foi confirmada. Acesse seu painel para acompanhar o pedido: ${magic.magicUrl}`;
            const sent = await sendEvolutionMessageStoreV2(customerPhone, msg);
            if (!sent.success) {
              storeLogger.error('Store V2 WhatsApp failed', new Error(sent.error ?? 'Unknown'), {
                orderId: order.id,
                customerPhone,
              });
            }
          }
        } catch (waErr) {
          storeLogger.error('Store V2 Evolution/magic-link failed', waErr as Error, {
            orderId: order.id,
            customerPhone,
          });
        }
      }
    }
  }
}

async function processSubscription(subscription: unknown, payment: AsaasPaymentResponse) {
  console.log('[webhooks/asaas] Evento de assinatura:', {
    subscriptionId: (subscription as { id?: string })?.id,
    paymentId: payment.id,
  });
}
