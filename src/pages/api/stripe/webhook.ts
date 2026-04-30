import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { handleCheckoutCompleted, handleInvoicePaid } from '@/lib/stripe/handlers';
import { markEventProcessed } from '@/lib/stripe/idempotency';
import { logger } from '@/lib/log';
import { assertCriticalEnvs } from '@/lib/env';

export const config = { api: { bodyParser: false } };

assertCriticalEnvs();

// TODO(backcompat-2025-10-23) - Removido apiVersion rígida, usar default da key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  let event: Stripe.Event;
  try {
    // TODO(backcompat-2025-10-23) - buffer pode retornar diferentes tipos
    const rawBody = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err:any) {
    logger.error({ error: err?.message }, 'stripe_webhook_signature_failed');
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Verificar idempotência (não processar evento duplicado)
  const already = await markEventProcessed(event.id);
  if (!already) {
    logger.info({ eventId: event.id, type: event.type }, 'webhook_duplicate_ignored');
    return res.status(200).json({ ok: true, dedup: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }
      // (Opcional) tratar 'customer.subscription.updated'|'deleted' para churn/upgrade
      default:
        // no-op
        break;
    }
  } catch (err:any) {
    // Estratégia: não reprocessar infinitamente por falha do GHL.
    // Logamos o erro e ainda respondemos 200 para evitar retries massivos.
    logger.error({ eventType: event.type, error: err?.message }, 'stripe_webhook_handler_error');
  }

  return res.status(200).json({ received: true });
}
