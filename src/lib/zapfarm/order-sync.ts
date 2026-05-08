import type { AsaasPaymentResponse } from '@/lib/asaas/client';
import { prisma } from '@/lib/prisma';

const PAID_STATUSES = new Set(['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH']);

export function mapZapfarmOrderStatus(payment: AsaasPaymentResponse) {
  if (PAID_STATUSES.has(payment.status)) {
    return 'PAID';
  }

  if (payment.status === 'OVERDUE') {
    return 'OVERDUE';
  }

  if (payment.status === 'REFUNDED') {
    return 'REFUNDED';
  }

  if (payment.deleted) {
    return 'CANCELED';
  }

  return 'PENDING';
}

interface UpsertZapfarmOrderOptions {
  profileId?: string | null;
}

export async function upsertZapfarmOrderFromPayment(
  payment: AsaasPaymentResponse,
  options: UpsertZapfarmOrderOptions = {}
) {
  const productSlug = payment.metadata?.product || '';
  const planSlug = payment.metadata?.plano || '';
  const customerEmail = payment.metadata?.customer_email?.trim().toLowerCase() || '';

  if (!productSlug || !planSlug || !customerEmail) {
    return null;
  }

  const reportId = payment.metadata?.reportId || null;
  const triageId = payment.metadata?.triageId || null;
  const customerPhone = payment.metadata?.customer_phone || null;
  const status = mapZapfarmOrderStatus(payment);
  const amount = Math.round(payment.value * 100);
  const existingOrder = await prisma.zapfarmOrder.findUnique({
    where: { asaasPaymentId: payment.id },
    select: { status: true },
  });

  const order = await prisma.zapfarmOrder.upsert({
    where: { asaasPaymentId: payment.id },
    update: {
      status,
      amount,
      currency: 'BRL',
      billingType: payment.billingType || null,
      customerName: payment.metadata?.customer_name || 'Cliente',
      customerEmail,
      customerPhone,
      reportId,
      triageId,
      profileId: options.profileId || undefined,
      utmSource: payment.metadata?.utm_source || null,
      utmMedium: payment.metadata?.utm_medium || null,
      utmCampaign: payment.metadata?.utm_campaign || null,
      utmContent: payment.metadata?.utm_content || null,
      utmTerm: payment.metadata?.utm_term || null,
      paidAt:
        status === 'PAID'
          ? payment.paymentDate
            ? new Date(payment.paymentDate)
            : new Date()
          : null,
      updatedAt: new Date(),
    },
    create: {
      productSlug,
      planSlug,
      asaasPaymentId: payment.id,
      status,
      customerName: payment.metadata?.customer_name || 'Cliente',
      customerEmail,
      customerPhone,
      amount,
      currency: 'BRL',
      billingType: payment.billingType || null,
      reportId,
      triageId,
      profileId: options.profileId || undefined,
      utmSource: payment.metadata?.utm_source || null,
      utmMedium: payment.metadata?.utm_medium || null,
      utmCampaign: payment.metadata?.utm_campaign || null,
      utmContent: payment.metadata?.utm_content || null,
      utmTerm: payment.metadata?.utm_term || null,
      paidAt:
        status === 'PAID'
          ? payment.paymentDate
            ? new Date(payment.paymentDate)
            : new Date()
          : null,
    },
  });

  return {
    order,
    status,
    wasAlreadyPaid: existingOrder?.status === 'PAID',
  };
}
