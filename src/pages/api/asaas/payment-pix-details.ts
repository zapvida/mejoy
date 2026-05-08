import type { NextApiRequest, NextApiResponse } from 'next';
import { asaasClient } from '@/lib/asaas/client';
import { resolvePixTransaction } from '@/lib/asaas/pix';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      code: 'METHOD_NOT_ALLOWED',
      message: 'Metodo nao permitido.',
    });
  }

  if (!process.env.ASAAS_API_KEY) {
    return res.status(500).json({
      status: 'error',
      code: 'ASAAS_NOT_CONFIGURED',
      message: 'Sistema de pagamento indisponivel.',
    });
  }

  const paymentId = Array.isArray(req.query.paymentId) ? req.query.paymentId[0] : req.query.paymentId;
  if (!paymentId) {
    return res.status(400).json({
      status: 'error',
      code: 'MISSING_PAYMENT_ID',
      message: 'paymentId e obrigatorio.',
    });
  }

  try {
    const payment = await asaasClient.getPayment(paymentId);
    const pixTransaction = await resolvePixTransaction(payment, {
      loggerPrefix: '[asaas-payment-pix-details]',
    });
    const paymentLink = payment.paymentLink || payment.invoiceUrl || null;

    return res.status(200).json({
      status: 'success',
      paymentStatus: payment.status,
      retryable: !pixTransaction,
      paymentLink,
      payment: {
        id: payment.id,
        status: payment.status,
        billingType: payment.billingType,
        value: payment.value,
        dueDate: payment.dueDate,
        invoiceUrl: payment.invoiceUrl,
        paymentLink,
      },
      pixTransaction: pixTransaction
        ? {
            qrCode: pixTransaction.qrCode,
            qrCodeBase64: pixTransaction.qrCodeBase64,
            value: pixTransaction.value ?? payment.value,
          }
        : null,
    });
  } catch (error: any) {
    console.error('[asaas-payment-pix-details] failed', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        status: 'error',
        code: 'PAYMENT_NOT_FOUND',
        message: 'Pagamento nao encontrado.',
      });
    }

    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: 'Falha ao consultar os dados do PIX.',
    });
  }
}
