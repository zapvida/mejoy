import Stripe from 'stripe';
import { extractContactFromMetadata } from './metadata';
import { upsertContact, upsertOpportunity, sendMessage, buildCheckoutContextNotes } from '@/lib/crm/ghl';
import { sendPaymentConfirmedEmail, sendWelcomeEmail } from '@/lib/email';

const PIPELINE = process.env.GHL_PIPELINE_ID!;
const STAGE_WON = process.env.GHL_STAGE_WON!;
const STAGE_CHECKOUT = process.env.GHL_STAGE_CHECKOUT!;

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {};
  const amount = (session.amount_total ?? 0) / 100; // em reais, supondo BRL
  const { email, phone, name, utm } = extractContactFromMetadata(meta);
  const variant = typeof meta.variant === 'string' ? meta.variant : undefined;
  const extraSeatsRaw = typeof meta.extraSeats === 'string' ? Number(meta.extraSeats) : meta.extraSeats;
  const extraSeats = typeof extraSeatsRaw === 'number' && Number.isFinite(extraSeatsRaw) ? extraSeatsRaw : undefined;
  const beneficiaryEmail = typeof meta.beneficiaryEmail === 'string' ? meta.beneficiaryEmail : undefined;
  const tenantId = typeof meta.tenant === 'string' ? meta.tenant : undefined;

  const checkoutNotes = buildCheckoutContextNotes({
    tenant: tenantId,
    variant,
    extraSeats,
    beneficiaryEmail
  });

  // 1) Upsert contato no GHL
  const contactId = await upsertContact({ name, email, phone, utm });

  // 2) Mover oportunidade -> WON
  await upsertOpportunity({
    contactId, pipelineId: PIPELINE, stageId: STAGE_WON,
    title: checkoutNotes
      ? `Pago via Stripe - ${meta?.plan ?? 'plan'}/${meta?.period ?? 'period'} - ${checkoutNotes}`
      : `Pago via Stripe - ${meta?.plan ?? 'plan'}/${meta?.period ?? 'period'}`,
    monetary: amount,
    notes: checkoutNotes || undefined
  });

  // 3) Mensagem de boas-vindas (WhatsApp)
  await sendMessage({
    contactId,
    message: 'Pagamento confirmado! Bem-vindo(a). Em instantes você receberá seu acesso e orientações personalizadas.',
    channel: 'whatsapp'
  });

  // 4) Email de confirmação de pagamento
  if (email) {
    try {
      await sendPaymentConfirmedEmail(email, {
        name,
        firstName: name?.split(' ')[0],
        productName: meta?.plan ? `Plano ${meta.plan}` : 'Acesso MeJoy',
        amount,
        orderId: session.id,
        paymentMethod: session.payment_method_types?.[0] || 'Cartão de crédito',
      });
      // Email de boas-vindas (se for primeiro pagamento)
      await sendWelcomeEmail(email, {
        name,
        firstName: name?.split(' ')[0],
      });
    } catch (emailError) {
      console.error('Erro ao enviar emails de pagamento:', emailError);
      // Não falhar o webhook se email falhar
    }
  }

  // (Opcional) criar/atualizar assinatura local via Prisma (se existir)
  // await prisma.subscription.upsert({ ... })
}

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Renovação/primeiro pagamento de assinatura
  const subscriptionId = invoice.subscription as string | undefined;
  const amount = (invoice.amount_paid ?? 0) / 100;

  const customer = invoice.customer as string | Stripe.Customer | null;
  let email: string | undefined;
  if (customer && typeof customer !== 'string') email = customer.email ?? undefined;
  if (!email && typeof customer === 'string') {
    // Pega email do "invoice.customer_email" como fallback
    email = invoice.customer_email ?? undefined;
  }

  // NOTE: obter metadata exata aqui varia; nem sempre vem no invoice.
  // Para robustez, preferimos confiar no "checkout.session.completed".
  // Aqui apenas garantimos que já pago => ok.
  // Poderia buscar subscription/customer no Stripe e recuperar metadata.

  // Como não temos metadata completo aqui, não movemos estágio de novo para WON
  // (evita duplicidade). Apenas placeholder para futura lógica de renovação.
}
