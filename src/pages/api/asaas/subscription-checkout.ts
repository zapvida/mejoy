import { NextApiRequest, NextApiResponse } from 'next';
import { asaasClient, AsaasCustomer, AsaasPayment } from '@/lib/asaas/client';
import { calculateDueDate } from '@/lib/asaas/utils';
import { readUtmFromReq } from '@/lib/analytics/utm';
import { resolvePixTransaction } from '@/lib/asaas/pix';

const PLAN_PRICES = {
  plus: {
    monthly: 2990, // R$ 29,90 em centavos
    yearly: 29900, // R$ 299,00 em centavos (10 meses)
  },
  gift: {
    monthly: 1990, // R$ 19,90 em centavos
    yearly: 19900, // R$ 199,00 em centavos
  },
} as const;

const ADDON_PRICES = {
  monthly: 990, // R$ 9,90 em centavos
  yearly: 9900, // R$ 99,00 em centavos
} as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error',
      code: 'METHOD_NOT_ALLOWED',
      message: 'Método não permitido' 
    });
  }

  const { 
    plan, 
    period, 
    variant, 
    extraSeats, 
    beneficiaryEmail,
    email,
    name,
    phone,
  } = req.body;

  // Validações
  if (!plan || !period) {
    return res.status(400).json({ 
      status: 'error',
      code: 'MISSING_REQUIRED_FIELDS',
      message: 'Plano e período são obrigatórios' 
    });
  }

  if (!['monthly', 'yearly'].includes(period)) {
    return res.status(400).json({ 
      status: 'error',
      code: 'INVALID_PERIOD',
      message: 'Período inválido' 
    });
  }

  const checkoutVariant = variant === 'gift' ? 'gift' : 'standard';
  const baseAmount = PLAN_PRICES[checkoutVariant][period];
  const extraSeatsClamped = Math.max(0, Math.min(10, Math.floor(extraSeats || 0)));
  const addonAmount = ADDON_PRICES[period] * extraSeatsClamped;
  const totalAmount = baseAmount + addonAmount;

  // Validar API Key do Asaas
  if (!process.env.ASAAS_API_KEY) {
    console.error('[asaas-subscription-checkout] ASAAS_API_KEY não configurada');
    return res.status(500).json({ 
      status: 'error',
      code: 'ASAAS_NOT_CONFIGURED',
      message: 'Sistema de pagamento não configurado' 
    });
  }

  try {
    // Extrair UTM params
    const utm = readUtmFromReq(req);

    // Criar ou buscar cliente no Asaas
    const customerData: AsaasCustomer = {
      name: name || 'Cliente',
      email: email || '',
      phone: phone || undefined,
      externalReference: email || `zapfarm_${Date.now()}`,
    };

    let customer;
    try {
      customer = await asaasClient.createOrUpdateCustomer(customerData);
    } catch (customerError: any) {
      console.error('[asaas-subscription-checkout] Erro ao criar cliente:', customerError);
      return res.status(500).json({ 
        status: 'error',
        code: 'CUSTOMER_ERROR',
        message: 'Erro ao processar dados do cliente' 
      });
    }

    // Criar pagamento no Asaas
    // Converter centavos para reais (AsaasPayment espera valor em REAIS)
    const valueInReais = totalAmount / 100;
    
    const paymentData: AsaasPayment = {
      customer: customer.id || customer.externalReference || '',
      billingType: 'PIX', // Por padrão PIX, pode ser alterado no frontend
      value: valueInReais, // Valor em REAIS (já convertido de centavos)
      dueDate: calculateDueDate(3),
      description: `Me Joy Plus - ${period === 'monthly' ? 'Mensal' : 'Anual'}${checkoutVariant === 'gift' ? ' (Presente)' : ''}${extraSeatsClamped > 0 ? ` + ${extraSeatsClamped} assentos` : ''}`,
      externalReference: `zapfarm_plus_${period}_${checkoutVariant}_${Date.now()}`,
      metadata: {
        tipo: 'zapfarm_subscription',
        plan: 'plus',
        period,
        variant: checkoutVariant,
        extraSeats: String(extraSeatsClamped),
        ...(beneficiaryEmail && { beneficiaryEmail }),
        ...(utm.source && { utm_source: utm.source }),
        ...(utm.medium && { utm_medium: utm.medium }),
        ...(utm.campaign && { utm_campaign: utm.campaign }),
        ...(utm.content && { utm_content: utm.content }),
        ...(utm.term && { utm_term: utm.term }),
      },
    };

    // Criar pagamento
    const payment = await asaasClient.createPayment(paymentData);

    const pixDetails = await resolvePixTransaction(payment, { loggerPrefix: '[asaas-subscription-checkout]' });

    if (!pixDetails) {
      console.error('[asaas-subscription-checkout] QR Code PIX não disponível imediatamente', {
        paymentId: payment.id,
        status: payment.status,
      });

      return res.status(200).json({
        status: 'success',
        paymentId: payment.id,
        payment: {
          id: payment.id,
          status: payment.status,
          billingType: payment.billingType,
          value: payment.value,
          pixTransaction: null,
          invoiceUrl: payment.invoiceUrl,
        },
        warning: 'QR Code PIX não disponível imediatamente. O link de pagamento contém o QR Code.',
        paymentLink: payment.invoiceUrl || payment.paymentLink,
        retryable: true,
        url: payment.paymentLink || payment.invoiceUrl || null,
      });
    }

    // Retornar dados do pagamento
    return res.status(200).json({ 
      status: 'success',
      paymentId: payment.id,
      payment: {
        id: payment.id,
        status: payment.status,
        billingType: payment.billingType,
        value: payment.value,
        pixTransaction: {
          qrCode: pixDetails.qrCode,
          qrCodeBase64: pixDetails.qrCodeBase64,
          value: pixDetails.value ?? payment.value,
        },
        invoiceUrl: payment.invoiceUrl,
      },
      url: payment.paymentLink || payment.invoiceUrl || null,
    });
  } catch (error: any) {
    console.error('[asaas-subscription-checkout] Erro ao criar pagamento', error);
    
    if (error.response?.status === 400) {
      return res.status(400).json({ 
        status: 'error',
        code: 'ASAAS_ERROR',
        message: 'Erro ao processar pagamento. Verifique os dados e tente novamente.',
        details: error.response?.data?.errors || error.message
      });
    }
    
    return res.status(500).json({ 
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: 'Erro ao processar pagamento. Tente novamente em alguns instantes.' 
    });
  }
}

