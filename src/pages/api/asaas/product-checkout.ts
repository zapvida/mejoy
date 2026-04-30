import { NextApiRequest, NextApiResponse } from 'next';
import { asaasClient, AsaasCustomer, AsaasPayment } from '@/lib/asaas/client';
import { getProductConfig } from '@/lib/zapfarm/product-loader';
import { getAsaasPriceFromPlan } from '@/lib/asaas/utils';
import { readUtmFromReq } from '@/lib/analytics/utm';
import { calculateDueDate } from '@/lib/asaas/utils';
import { resolvePixTransaction } from '@/lib/asaas/pix';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error',
      code: 'METHOD_NOT_ALLOWED',
      message: 'Método não permitido' 
    });
  }

  const { product, plano, reportId, triageId, nome, email, telefone, paymentMethod } = req.body;

  // Validações com mensagens de erro amigáveis
  if (!product || !plano) {
    return res.status(400).json({ 
      status: 'error',
      code: 'MISSING_REQUIRED_FIELDS',
      message: 'Produto e plano são obrigatórios' 
    });
  }

  if (!['basico', 'completo', 'premium'].includes(plano)) {
    return res.status(400).json({ 
      status: 'error',
      code: 'INVALID_PLAN',
      message: 'Plano inválido. Escolha entre básico, completo ou premium' 
    });
  }

  const productConfig = getProductConfig(product);
  if (!productConfig) {
    return res.status(400).json({ 
      status: 'error',
      code: 'PRODUCT_NOT_FOUND',
      message: 'Produto não encontrado' 
    });
  }

  const planConfig = productConfig.plans[plano as 'basico' | 'completo' | 'premium'];
  if (!planConfig) {
    return res.status(400).json({ 
      status: 'error',
      code: 'PLAN_NOT_FOUND',
      message: 'Plano não encontrado para este produto' 
    });
  }

  // Validar método de pagamento (padrão: PIX)
  const billingType = paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : 'PIX';

  // Resolver preço em centavos
  let amount: number;
  try {
    amount = getAsaasPriceFromPlan(planConfig, product);
  } catch (error: any) {
    console.error(`[asaas-product-checkout] Preço não configurado para produto ${product}, plano ${plano}`);
    return res.status(400).json({ 
      status: 'error',
      code: 'MISSING_ENV',
      message: 'No momento este produto/plano não está disponível. Tente novamente mais tarde.',
      details: error.message
    });
  }

  // Validar API Key do Asaas
  if (!process.env.ASAAS_API_KEY) {
    console.error('[asaas-product-checkout] ASAAS_API_KEY não configurada');
    return res.status(500).json({ 
      status: 'error',
      code: 'ASAAS_NOT_CONFIGURED',
      message: 'Sistema de pagamento não configurado. Entre em contato com o suporte.' 
    });
  }

  try {
    // Extrair UTM params dos cookies
    const utm = readUtmFromReq(req);

    // Criar ou buscar cliente no Asaas
    const customerData: AsaasCustomer = {
      name: nome || 'Cliente',
      email: email || '',
      phone: telefone || undefined,
      externalReference: email || `zapfarm_${Date.now()}`,
    };

    let customer;
    try {
      customer = await asaasClient.createOrUpdateCustomer(customerData);
    } catch (customerError: any) {
      console.error('[asaas-product-checkout] Erro ao criar cliente:', customerError);
      return res.status(500).json({ 
        status: 'error',
        code: 'CUSTOMER_ERROR',
        message: 'Erro ao processar dados do cliente. Tente novamente.' 
      });
    }

    // Criar pagamento no Asaas
    // Converter centavos para reais (AsaasPayment espera valor em REAIS)
    const valueInReais = amount / 100;
    
    const paymentData: AsaasPayment = {
      customer: customer.id || customer.externalReference || '',
      billingType: billingType as 'PIX' | 'CREDIT_CARD',
      value: valueInReais, // Valor em REAIS (já convertido de centavos)
      dueDate: calculateDueDate(3), // Vencimento em 3 dias
      description: `${productConfig.name} - ${planConfig.name}`,
      externalReference: `zapfarm_${product}_${plano}_${Date.now()}`,
      metadata: {
        tipo: 'zapfarm',
        product,
        plano,
        reportId: reportId || '',
        triageId: triageId || '',
        customer_name: nome || '',
        customer_email: email || '',
        customer_phone: telefone || '',
        ...(utm.source && { utm_source: utm.source }),
        ...(utm.medium && { utm_medium: utm.medium }),
        ...(utm.campaign && { utm_campaign: utm.campaign }),
        ...(utm.content && { utm_content: utm.content }),
        ...(utm.term && { utm_term: utm.term }),
      },
    };

    // Criar pagamento diretamente
    const payment = await asaasClient.createPayment(paymentData);

    const pixDetails = billingType === 'PIX'
      ? await resolvePixTransaction(payment, { loggerPrefix: '[asaas-product-checkout]' })
      : null;

    if (billingType === 'PIX' && !pixDetails) {
      console.error('[asaas-product-checkout] QR Code PIX não disponível imediatamente', {
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
        billingType,
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
        pixTransaction: pixDetails ? {
          qrCode: pixDetails.qrCode,
          qrCodeBase64: pixDetails.qrCodeBase64,
          value: pixDetails.value ?? payment.value,
        } : null,
        invoiceUrl: payment.invoiceUrl,
      },
      url: payment.paymentLink || payment.invoiceUrl || null,
      billingType,
    });
  } catch (error: any) {
    console.error('[asaas-product-checkout] Erro ao criar pagamento', error);
    
    // Tratar erros específicos do Asaas
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

