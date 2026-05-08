import type { NextApiRequest, NextApiResponse } from 'next';
import { asaasClient } from '@/lib/asaas/client';
import { createMagicLink } from '@/lib/auth/magic-link';
import { hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';
import { ensureCheckoutProfile } from '@/lib/zapfarm/profile-link';
import { upsertZapfarmOrderFromPayment } from '@/lib/zapfarm/order-sync';

const PAID_STATUSES = new Set(['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH']);

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

  if (!hasSupabaseAdminConfig) {
    return res.status(500).json({
      status: 'error',
      code: 'SUPABASE_NOT_CONFIGURED',
      message: 'Servico de acesso ao dashboard indisponivel.',
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

    if (!PAID_STATUSES.has(payment.status)) {
      return res.status(409).json({
        status: 'error',
        code: 'PAYMENT_NOT_CONFIRMED',
        message: 'Pagamento ainda nao confirmado.',
        paymentStatus: payment.status,
      });
    }

    const customerEmail = payment.metadata?.customer_email?.trim().toLowerCase();
    if (!customerEmail) {
      return res.status(400).json({
        status: 'error',
        code: 'MISSING_CUSTOMER_EMAIL',
        message: 'Pagamento sem e-mail associado.',
      });
    }

    const profile = await ensureCheckoutProfile({
      email: customerEmail,
      name: payment.metadata?.customer_name || null,
      whatsapp: payment.metadata?.customer_phone || null,
    });

    if (!profile?.id) {
      return res.status(500).json({
        status: 'error',
        code: 'PROFILE_CREATE_FAILED',
        message: 'Nao foi possivel liberar o dashboard.',
      });
    }

    await upsertZapfarmOrderFromPayment(payment, {
      profileId: profile.id,
    });

    const magic = await createMagicLink({
      profileId: profile.id,
      redirectPath: '/dashboard',
    });

    if (!magic?.magicUrl) {
      return res.status(500).json({
        status: 'error',
        code: 'MAGIC_LINK_FAILED',
        message: 'Nao foi possivel gerar o acesso ao dashboard.',
      });
    }

    return res.status(200).json({
      status: 'success',
      paymentStatus: payment.status,
      profileId: profile.id,
      magicUrl: magic.magicUrl,
      expiresAt: magic.expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('[payment-dashboard-link] failed', error);

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
      message: 'Falha ao liberar o dashboard.',
    });
  }
}
