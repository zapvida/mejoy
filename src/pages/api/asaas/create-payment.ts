import { NextApiRequest, NextApiResponse } from 'next';
import { asaasClient, AsaasCustomer, AsaasPayment } from '@/lib/asaas/client';
import { advanceLead } from '@/lib/funnel/service';
import { getProductConfig } from '@/lib/zapfarm/product-loader';
import {
  getPriceCents,
  getBundlePriceCents,
  normalizeProductKey,
} from '@/lib/zapfarm/price-resolver';
import { getSubscriptionPrice } from '@/config/zapfarm/pricing';
import { calculateDueDate } from '@/lib/asaas/utils';
import { readUtmFromReq } from '@/lib/analytics/utm';
import { resolvePixTransaction } from '@/lib/asaas/pix';
import { getProfileByEmail } from '@/lib/supabase/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error',
      code: 'METHOD_NOT_ALLOWED',
      message: 'Método não permitido' 
    });
  }

  const {
    product,
    plano,
    nome,
    email,
    telefone,
    cpfCnpj,
    paymentMethod,
    reportId,
    triageId,
    quantity = 1,
    variant,
    creditCard,
    installments = 1,
    isSubscription,
    bundleId,
    assinatura6M,
    isPartner,
    /** MeJoy emagrecimento — trilha escolhida na results (metadata Asaas) */
    trilha: emagrecimentoTrilha,
    principio: emagrecimentoPrincipio,
  } = req.body;

  const validVariant = variant === 'core' || variant === 'pro' ? variant : undefined;

  // Fluxo Assinatura 6 meses: preço fixo sócio/não-sócio
  if (assinatura6M === true && product && plano) {
    const subCents = getSubscriptionPrice(isPartner === true);
    const amount = Math.round(subCents * (paymentMethod === 'PIX' ? 0.9 : 1));
    if (!nome || !email || !telefone) {
      return res.status(400).json({
        status: 'error',
        code: 'MISSING_CUSTOMER_DATA',
        message: 'Nome, e-mail e telefone são obrigatórios',
      });
    }
    if (!process.env.ASAAS_API_KEY) {
      return res.status(500).json({
        status: 'error',
        code: 'ASAAS_NOT_CONFIGURED',
        message: 'Sistema de pagamento não configurado',
      });
    }
    const utm = readUtmFromReq(req);
    const cpfCnpjCleaned = cpfCnpj?.replace(/\D/g, '') || '';
    const isValidCpfCnpj = cpfCnpjCleaned.length === 11 || cpfCnpjCleaned.length === 14;
    const customerData = {
      name: nome,
      email,
      phone: telefone.replace(/\D/g, ''),
      ...(isValidCpfCnpj && { cpfCnpj: cpfCnpjCleaned }),
      externalReference: `zapfarm_assinatura6m_${Date.now()}`,
    };
    let customer;
    try {
      customer = await asaasClient.createOrUpdateCustomer(customerData);
    } catch (err) {
      console.error('[asaas-create-payment] Erro ao criar cliente (assinatura6m):', err);
      return res.status(500).json({
        status: 'error',
        code: 'CUSTOMER_ERROR',
        message: 'Erro ao processar dados do cliente',
      });
    }
    const valueInReais = Math.max(amount, 500) / 100;
    const paymentData: AsaasPayment = {
      customer: customer.id || customer.externalReference || '',
      billingType: (paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : 'PIX') as 'PIX' | 'CREDIT_CARD',
      value: valueInReais,
      dueDate: calculateDueDate(3),
      description: `Assinatura 6 meses - ${product}`,
      externalReference: `zapfarm_assinatura6m_${product}_${Date.now()}`,
      metadata: {
        tipo: 'zapfarm',
        product,
        plano: 'assinatura6m',
        assinatura6m: 'true',
        customer_name: nome,
        customer_email: email,
        customer_phone: telefone,
        reportId: reportId || '',
        triageId: triageId || '',
        ...(utm.source && { utm_source: utm.source }),
        ...(utm.medium && { utm_medium: utm.medium }),
        ...(utm.campaign && { utm_campaign: utm.campaign }),
      },
    };
    if (paymentData.billingType === 'CREDIT_CARD' && creditCard) {
      paymentData.creditCard = {
        holderName: creditCard.holderName,
        number: creditCard.number.replace(/\s/g, ''),
        expiryMonth: creditCard.expiryMonth.padStart(2, '0'),
        expiryYear: creditCard.expiryYear,
        ccv: creditCard.ccv,
      };
      paymentData.creditCardHolderInfo = {
        name: nome,
        email,
        cpfCnpj: cpfCnpjCleaned || '',
        postalCode: req.body.cep?.replace(/\D/g, '') || '',
        addressNumber: req.body.enderecoNumero || '',
        phone: telefone.replace(/\D/g, ''),
      };
      paymentData.remoteIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
        req.socket.remoteAddress ||
        '';
    }
    try {
      const payment = await asaasClient.createPayment(paymentData);
      if (paymentData.billingType === 'PIX' && payment.id) {
        const pix = await resolvePixTransaction(payment);
        return res.status(200).json({
          status: 'success',
          paymentId: payment.id,
          payment: { ...payment, pixTransaction: pix },
        });
      }
      return res.status(200).json({ status: 'success', paymentId: payment.id, payment });
    } catch (err) {
      console.error('[asaas-create-payment] Erro assinatura 6m:', err);
      return res.status(500).json({
        status: 'error',
        code: 'PAYMENT_ERROR',
        message: 'Erro ao processar pagamento',
      });
    }
  }

  // Fluxo Bundle: quando bundleId presente, ignorar product/plano
  if (bundleId && typeof bundleId === 'string') {
    const bundleCents = getBundlePriceCents(bundleId);
    if (!bundleCents || bundleCents <= 0) {
      return res.status(400).json({
        status: 'error',
        code: 'BUNDLE_PRICE_NOT_CONFIGURED',
        message: `Preço do bundle ${bundleId} não configurado. Configure ASAAS_PRICE_BUNDLE_*`,
      });
    }
    const subscriptionDiscount = isSubscription === true ? 0.9 : 1;
    const amount = Math.round(bundleCents * subscriptionDiscount);
    const quantityNum = typeof quantity === 'number' ? quantity : parseFloat(String(quantity)) || 1;
    const totalCents = Math.round(amount * quantityNum);

    if (!nome || !email || !telefone) {
      return res.status(400).json({
        status: 'error',
        code: 'MISSING_CUSTOMER_DATA',
        message: 'Nome, e-mail e telefone são obrigatórios',
      });
    }

    const billingType = paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : 'PIX';
    if (!process.env.ASAAS_API_KEY) {
      return res.status(500).json({
        status: 'error',
        code: 'ASAAS_NOT_CONFIGURED',
        message: 'Sistema de pagamento não configurado',
      });
    }

    const utm = readUtmFromReq(req);
    const cpfCnpjCleaned = cpfCnpj?.replace(/\D/g, '') || '';
    const isValidCpfCnpj = cpfCnpjCleaned.length === 11 || cpfCnpjCleaned.length === 14;

    const customerData = {
      name: nome,
      email,
      phone: telefone.replace(/\D/g, ''),
      ...(isValidCpfCnpj && { cpfCnpj: cpfCnpjCleaned }),
      externalReference: `zapfarm_bundle_${Date.now()}`,
    };

    let customer;
    try {
      customer = await asaasClient.createOrUpdateCustomer(customerData);
    } catch (err) {
      console.error('[asaas-create-payment] Erro ao criar cliente (bundle):', err);
      return res.status(500).json({
        status: 'error',
        code: 'CUSTOMER_ERROR',
        message: 'Erro ao processar dados do cliente',
      });
    }

    const valueInReais = Math.max(totalCents, 500) / 100;
    const paymentData: AsaasPayment = {
      customer: customer.id || customer.externalReference || '',
      billingType: billingType as 'PIX' | 'CREDIT_CARD',
      value: valueInReais,
      dueDate: calculateDueDate(3),
      description: `Bundle ${bundleId}${quantityNum > 1 ? ` (${quantityNum}x)` : ''}`,
      externalReference: `zapfarm_bundle_${bundleId}_${Date.now()}`,
      metadata: {
        tipo: 'zapfarm',
        bundleId,
        quantity: String(quantityNum),
        amountCents: String(totalCents),
        ...(isSubscription === true && { is_subscription: 'true' }),
        customer_name: nome,
        customer_email: email,
        customer_phone: telefone,
        ...(utm.source && { utm_source: utm.source }),
        ...(utm.medium && { utm_medium: utm.medium }),
        ...(utm.campaign && { utm_campaign: utm.campaign }),
      },
    };

    if (billingType === 'CREDIT_CARD' && creditCard) {
      paymentData.creditCard = {
        holderName: creditCard.holderName,
        number: creditCard.number.replace(/\s/g, ''),
        expiryMonth: creditCard.expiryMonth.padStart(2, '0'),
        expiryYear: creditCard.expiryYear,
        ccv: creditCard.ccv,
      };
      paymentData.creditCardHolderInfo = {
        name: nome,
        email,
        cpfCnpj: cpfCnpjCleaned || '',
        postalCode: req.body.cep?.replace(/\D/g, '') || '',
        addressNumber: req.body.enderecoNumero || '',
        phone: telefone.replace(/\D/g, ''),
      };
      paymentData.remoteIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
        req.socket.remoteAddress ||
        '';
    }

    try {
      const payment = await asaasClient.createPayment(paymentData);
      if (billingType === 'PIX' && payment.id) {
        const pix = await resolvePixTransaction(payment);
        return res.status(200).json({
          status: 'success',
          paymentId: payment.id,
          payment: { ...payment, pixTransaction: pix },
        });
      }
      return res.status(200).json({ status: 'success', paymentId: payment.id, payment });
    } catch (err) {
      console.error('[asaas-create-payment] Erro ao criar pagamento bundle:', err);
      return res.status(500).json({
        status: 'error',
        code: 'PAYMENT_ERROR',
        message: 'Erro ao processar pagamento',
      });
    }
  }

  // Validações básicas (fluxo produto)
  if (!product || !plano) {
    return res.status(400).json({ 
      status: 'error',
      code: 'MISSING_REQUIRED_FIELDS',
      message: 'Produto e plano são obrigatórios' 
    });
  }

  // Validar dados do cliente (obrigatórios para criar pagamento)
  if (!nome || !email || !telefone) {
    return res.status(400).json({ 
      status: 'error',
      code: 'MISSING_CUSTOMER_DATA',
      message: 'Nome, e-mail e telefone são obrigatórios' 
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      status: 'error',
      code: 'INVALID_EMAIL',
      message: 'E-mail inválido' 
    });
  }

  if (!['basico', 'completo', 'premium'].includes(plano)) {
    return res.status(400).json({ 
      status: 'error',
      code: 'INVALID_PLAN',
      message: 'Plano inválido' 
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
      message: 'Plano não encontrado' 
    });
  }

  // Validar método de pagamento
  const billingType = paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : 'PIX';
  
  // Validar dados do cartão se necessário
  if (billingType === 'CREDIT_CARD') {
    if (!creditCard || !creditCard.number || !creditCard.holderName || !creditCard.expiryMonth || !creditCard.expiryYear || !creditCard.ccv) {
      return res.status(400).json({ 
        status: 'error',
        code: 'MISSING_CREDIT_CARD_DATA',
        message: 'Todos os dados do cartão de crédito são obrigatórios' 
      });
    }
    
    // Validar número do cartão (deve ter 13-19 dígitos)
    const cardNumber = creditCard.number.replace(/\s/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      return res.status(400).json({ 
        status: 'error',
        code: 'INVALID_CARD_NUMBER',
        message: 'Número do cartão inválido' 
      });
    }
    
    // Validar CVV (3 ou 4 dígitos)
    if (creditCard.ccv.length < 3 || creditCard.ccv.length > 4) {
      return res.status(400).json({ 
        status: 'error',
        code: 'INVALID_CVV',
        message: 'CVV inválido' 
      });
    }
  }

  // Validar e converter quantidade
  const quantityNum = typeof quantity === 'number' ? quantity : parseFloat(String(quantity));
  
  if (isNaN(quantityNum) || quantityNum <= 0) {
    console.error('[asaas-create-payment] Quantidade inválida:', {
      quantity,
      quantityNum,
    });
    return res.status(400).json({ 
      status: 'error',
      code: 'INVALID_QUANTITY',
      message: 'Quantidade inválida'
    });
  }

  // Obter preço via resolver (env como fonte única)
  let amount: number;
  const planKey = plano as 'basico' | 'completo' | 'premium';
  const envKey = normalizeProductKey(product);
  const envVarUsed = validVariant
    ? `ASAAS_PRICE_${envKey}_${validVariant.toUpperCase()}_${planKey.toUpperCase()}`
    : `ASAAS_PRICE_${envKey}_${planKey.toUpperCase()}`;

  try {
    const unitPriceCents = getPriceCents(product, planKey, validVariant, true);
    if (unitPriceCents === null || unitPriceCents <= 0) {
      throw new Error(`Preço não encontrado para ${product}/${plano}${validVariant ? `/${validVariant}` : ''}`);
    }
    amount = Math.round(unitPriceCents * quantityNum);

    console.log('[asaas-create-payment] Cálculo do valor:', JSON.stringify({
      timestamp: new Date().toISOString(),
      unitPriceCents,
      unitPriceReais: unitPriceCents / 100,
      quantity,
      quantityNum,
      amountCents: amount,
      amountReais: amount / 100,
      product,
      plano,
      variant: validVariant ?? null,
      envVarUsed,
    }));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[asaas-create-payment] Preço não configurado:`, error);
    return res.status(400).json({
      status: 'error',
      code: 'MISSING_ENV',
      message: 'Preço não configurado para este produto/plano. Entre em contato com o suporte.',
      details: msg,
    });
  }

  // Desconto assinatura -10% (quando flag habilitada e isSubscription=true)
  const subscriptionDiscount = isSubscription === true ? 0.9 : 1;
  amount = Math.round(amount * subscriptionDiscount);
  
  // Validar valor mínimo do Asaas (R$ 5,00 = 500 centavos)
  const MINIMUM_VALUE_CENTS = 500; // R$ 5,00 mínimo do Asaas
  if (amount < MINIMUM_VALUE_CENTS) {
    console.error('[asaas-create-payment] Valor abaixo do mínimo:', {
      amount,
      amountReais: amount / 100,
      unitPrice: planConfig.unitPrice,
      quantity,
      minimum: MINIMUM_VALUE_CENTS / 100,
    });
    return res.status(400).json({ 
      status: 'error',
      code: 'MINIMUM_VALUE_ERROR',
      message: `O valor mínimo para pagamento é R$ ${MINIMUM_VALUE_CENTS / 100},00. Valor atual: R$ ${(amount / 100).toFixed(2)}`,
      details: {
        amountReais: amount / 100,
        minimumReais: MINIMUM_VALUE_CENTS / 100,
        unitPrice: planConfig.unitPrice,
        quantity,
      }
    });
  }

  // Validar API Key do Asaas
  if (!process.env.ASAAS_API_KEY) {
    console.error('[asaas-create-payment] ASAAS_API_KEY não configurada');
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
    // Validar CPF/CNPJ antes de enviar (deve ter 11 ou 14 dígitos)
    const cpfCnpjCleaned = cpfCnpj?.replace(/\D/g, '') || '';
    const isValidCpfCnpj = cpfCnpjCleaned.length === 11 || cpfCnpjCleaned.length === 14;
    
    const customerData: AsaasCustomer = {
      name: nome,
      email: email,
      phone: telefone.replace(/\D/g, ''),
      // Só incluir CPF/CNPJ se for válido (Asaas requer formato correto)
      ...(isValidCpfCnpj && { cpfCnpj: cpfCnpjCleaned }),
      externalReference: `zapfarm_${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`,
    };

    let customer;
    try {
      customer = await asaasClient.createOrUpdateCustomer(customerData);
    } catch (customerError: any) {
      console.error('[asaas-create-payment] Erro ao criar cliente:', customerError);
      return res.status(500).json({ 
        status: 'error',
        code: 'CUSTOMER_ERROR',
        message: 'Erro ao processar dados do cliente' 
      });
    }

    // Criar pagamento no Asaas
    // IMPORTANTE: Garantir que o valor seja pelo menos R$ 5,00 (mínimo do Asaas)
    const finalAmountCents = Math.max(amount, MINIMUM_VALUE_CENTS);
    const valueInReais = finalAmountCents / 100; // Converter centavos para reais
    
    console.log('[asaas-create-payment] Criando pagamento:', {
      unitPriceCents: amount / (quantityNum || 1),
      quantity,
      amountCents: amount,
      amountReais: amount / 100,
      finalAmountCents,
      finalAmountReais: valueInReais,
      billingType,
      product,
      plano,
    });
    
    // A interface AsaasPayment espera valor em REAIS
    // O client.ts não divide mais por 100, então passamos diretamente em REAIS
    const trilhaMeta =
      product === 'emagrecimento' &&
      typeof emagrecimentoTrilha === 'string' &&
      ['tirzepatida', 'semaglutida', 'contrave', 'alternativas_clinicas'].includes(emagrecimentoTrilha)
        ? emagrecimentoTrilha
        : '';
    const principioMeta =
      product === 'emagrecimento' &&
      typeof emagrecimentoPrincipio === 'string' &&
      emagrecimentoPrincipio.length > 0 &&
      emagrecimentoPrincipio.length < 64
        ? emagrecimentoPrincipio
        : '';

    const paymentData: AsaasPayment = {
      customer: customer.id || customer.externalReference || '',
      billingType: billingType as 'PIX' | 'CREDIT_CARD',
      value: valueInReais, // Valor em REAIS (convertido de centavos)
      dueDate: calculateDueDate(3),
      description: `${productConfig.name} - ${planConfig.name}${quantity > 1 ? ` (${quantity}x)` : ''}`,
      externalReference: `zapfarm_${product}_${plano}_${Date.now()}`,
      metadata: {
        tipo: 'zapfarm',
        product,
        plano,
        quantity: String(quantity),
        amountCents: String(amount),
        envVarUsed,
        reportId: reportId || '',
        triageId: triageId || '',
        customer_name: nome,
        customer_email: email,
        customer_phone: telefone,
        ...(validVariant && { variant: validVariant }),
        ...(isSubscription === true && { is_subscription: 'true' }),
        ...(bundleId && { bundleId: String(bundleId) }),
        ...(trilhaMeta && { emagrecimento_trilha: trilhaMeta }),
        ...(principioMeta && { emagrecimento_principio: principioMeta }),
        ...(utm.source && { utm_source: utm.source }),
        ...(utm.medium && { utm_medium: utm.medium }),
        ...(utm.campaign && { utm_campaign: utm.campaign }),
        ...(utm.content && { utm_content: utm.content }),
        ...(utm.term && { utm_term: utm.term }),
      },
    };

    // Se for cartão de crédito, adicionar dados do cartão
    if (billingType === 'CREDIT_CARD' && creditCard) {
      paymentData.creditCard = {
        holderName: creditCard.holderName,
        number: creditCard.number.replace(/\s/g, ''),
        expiryMonth: creditCard.expiryMonth.padStart(2, '0'),
        expiryYear: creditCard.expiryYear,
        ccv: creditCard.ccv,
      };
      
      // Validar CPF/CNPJ para dados do cartão
      const cpfCnpjForCard = cpfCnpj?.replace(/\D/g, '') || '';
      const isValidCpfCnpjForCard = cpfCnpjForCard.length === 11 || cpfCnpjForCard.length === 14;
      
      paymentData.creditCardHolderInfo = {
        name: nome,
        email: email,
        cpfCnpj: isValidCpfCnpjForCard ? cpfCnpjForCard : '',
        postalCode: req.body.cep?.replace(/\D/g, '') || '',
        addressNumber: req.body.enderecoNumero || req.body.numero || '',
        phone: telefone.replace(/\D/g, ''),
      };

      paymentData.remoteIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                            (req.headers['x-real-ip'] as string) || 
                            req.socket.remoteAddress || '';

      if (installments > 1) {
        paymentData.installmentCount = installments;
        // Valores também em reais (dividir por 100)
        paymentData.installmentValue = (amount / installments) / 100;
        paymentData.totalValue = amount / 100;
      }
    }

    // Criar pagamento
    const payment = await asaasClient.createPayment(paymentData);

    // Log da resposta completa para debug
    console.log('[asaas-create-payment] Resposta do Asaas:', {
      id: payment.id,
      status: payment.status,
      billingType: payment.billingType,
      hasPixTransaction: !!payment.pixTransaction,
      pixTransaction: payment.pixTransaction,
    });

    // Se for PIX e não tiver pixTransaction, buscar novamente o pagamento
    // O Asaas pode demorar até 30 segundos para gerar o QR Code PIX
    let finalPayment = payment;
    if (billingType === 'PIX' && !payment.pixTransaction) {
      console.log('[asaas-create-payment] ⚠️ QR Code não veio na resposta inicial, tentando buscar novamente...');
      console.log('[asaas-create-payment] Resposta completa do Asaas:', JSON.stringify(payment, null, 2));
      
      // Tentar buscar até 10 vezes com intervalos crescentes (total até ~55 segundos)
      // O Asaas pode demorar bastante para gerar o QR Code, especialmente em produção
      for (let attempt = 1; attempt <= 10; attempt++) {
        try {
          // Aguardar progressivamente: 2s, 3s, 4s, 5s, 6s, 7s, 8s, 9s, 10s, 11s
          const delay = (attempt + 1) * 1000;
          console.log(`[asaas-create-payment] 🔄 Tentativa ${attempt}/10: aguardando ${delay}ms antes de buscar...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          finalPayment = await asaasClient.getPayment(payment.id);
          console.log(`[asaas-create-payment] 📦 Tentativa ${attempt}/10 - Pagamento buscado:`, {
            id: finalPayment.id,
            status: finalPayment.status,
            billingType: finalPayment.billingType,
            hasPixTransaction: !!finalPayment.pixTransaction,
            pixTransactionKeys: finalPayment.pixTransaction ? Object.keys(finalPayment.pixTransaction) : null,
            invoiceUrl: finalPayment.invoiceUrl,
            paymentLink: finalPayment.paymentLink,
          });
          
          // Se encontrou o QR Code, parar de tentar
          if (finalPayment.pixTransaction && (finalPayment.pixTransaction.qrCode || finalPayment.pixTransaction.qrCodeBase64)) {
            console.log('[asaas-create-payment] ✅ QR Code encontrado na tentativa', attempt);
            console.log('[asaas-create-payment] QR Code:', {
              hasQrCode: !!finalPayment.pixTransaction.qrCode,
              hasQrCodeBase64: !!finalPayment.pixTransaction.qrCodeBase64,
              qrCodeLength: finalPayment.pixTransaction.qrCode?.length || 0,
            });
            break;
          } else if (finalPayment.pixTransaction) {
            console.log('[asaas-create-payment] ⚠️ pixTransaction existe mas sem QR Code:', finalPayment.pixTransaction);
          }
        } catch (fetchError: any) {
          console.error(`[asaas-create-payment] ❌ Erro na tentativa ${attempt}/10:`, {
            message: fetchError.message,
            status: fetchError.response?.status,
            data: fetchError.response?.data,
          });
          // Continuar tentando se não for a última tentativa
          if (attempt === 10) {
            console.error('[asaas-create-payment] ❌ Todas as 10 tentativas falharam, usando pagamento original');
          }
        }
      }
    }

    const pixDetails = billingType === 'PIX'
      ? await resolvePixTransaction(finalPayment, { loggerPrefix: '[asaas-create-payment]' })
      : null;

    // Validar se temos QR Code para PIX
    // Se não tiver QR Code, usar invoiceUrl como fallback (contém QR Code na página do Asaas)
    if (billingType === 'PIX' && !pixDetails) {
      console.error('[asaas-create-payment] ⚠️ QR Code PIX não encontrado após todas as tentativas:', {
        paymentId: finalPayment.id,
        status: finalPayment.status,
        billingType: finalPayment.billingType,
        invoiceUrl: finalPayment.invoiceUrl,
        paymentLink: finalPayment.paymentLink,
        responseKeys: Object.keys(finalPayment),
      });
      
      // Se temos invoiceUrl, podemos usar ele (a página do Asaas tem o QR Code)
      // Mas vamos retornar um erro para o frontend tentar buscar novamente ou usar o link
      return res.status(200).json({ 
        status: 'success',
        paymentId: finalPayment.id,
        payment: {
          id: finalPayment.id,
          status: finalPayment.status,
          billingType: finalPayment.billingType,
          value: finalPayment.value,
          pixTransaction: null,
          invoiceUrl: finalPayment.invoiceUrl,
          dueDate: finalPayment.dueDate,
          paymentLink: finalPayment.paymentLink || finalPayment.invoiceUrl,
        },
        warning: 'QR Code PIX não disponível imediatamente. O link de pagamento contém o QR Code.',
        paymentLink: finalPayment.invoiceUrl || finalPayment.paymentLink,
        // Adicionar flag para o frontend tentar buscar novamente
        retryable: true,
      });
    }

    const profile = await getProfileByEmail(email);
    if (profile?.id) {
      advanceLead({
        profileId: profile.id,
        productSlug: product,
        step: 'checkout_started',
        source: 'create_payment',
      }).catch((e) => console.warn('[asaas-create-payment] advanceLead:', e));

      // Salvar checkout_cache para "never repeat" (CPF, CEP, endereço)
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const newCache: Record<string, string> = {};
        if (req.body.cpfCnpj) newCache.cpfCnpj = String(req.body.cpfCnpj).replace(/\D/g, '');
        if (req.body.cep) newCache.cep = String(req.body.cep).replace(/\D/g, '');
        if (req.body.endereco) newCache.endereco = String(req.body.endereco);
        if (req.body.enderecoNumero) newCache.enderecoNumero = String(req.body.enderecoNumero);
        if (req.body.complemento) newCache.complemento = String(req.body.complemento);
        if (req.body.bairro) newCache.bairro = String(req.body.bairro);
        if (req.body.cidade) newCache.cidade = String(req.body.cidade);
        if (req.body.estado) newCache.estado = String(req.body.estado);
        if (Object.keys(newCache).length > 0) {
          const { data: current } = await supabase.from('profiles').select('checkout_cache').eq('id', profile.id).maybeSingle();
          const existing = (current?.checkout_cache as Record<string, string>) || {};
          await supabase.from('profiles').update({
            checkout_cache: { ...existing, ...newCache },
            updated_at: new Date().toISOString(),
          }).eq('id', profile.id).then(() => {});
        }
      }
    }

    return res.status(200).json({ 
      status: 'success',
      paymentId: finalPayment.id, // Adicionar paymentId no nível raiz para compatibilidade
      payment: {
        id: finalPayment.id,
        status: finalPayment.status,
        billingType: finalPayment.billingType,
        value: finalPayment.value,
        pixTransaction: pixDetails ? {
          qrCode: pixDetails.qrCode,
          qrCodeBase64: pixDetails.qrCodeBase64,
          value: pixDetails.value ?? finalPayment.value,
        } : null,
        invoiceUrl: finalPayment.invoiceUrl,
        dueDate: finalPayment.dueDate,
      }
    });
  } catch (error: any) {
    console.error('[asaas-create-payment] Erro ao criar pagamento', error);
    
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
