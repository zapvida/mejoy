/**
 * Cria pedido Store V2 + pagamento Asaas
 * Recebe: cartId, customer data, address, paymentMethod
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { asaasClient, AsaasCustomer, AsaasPayment } from '@/lib/asaas/client';
import { calculateDueDate } from '@/lib/asaas/utils';
import { resolvePixTransaction } from '@/lib/asaas/pix';
import { prisma } from '@/lib/prisma';
import { calculateShippingAsync } from '@/lib/store-v2/shipping';
import { storeLogger } from '@/lib/store-v2/logger';
import { assertPriceAudit } from '@/lib/pricing/audit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido' });
  }

  const {
    cartId,
    orderId,
    nome,
    email,
    telefone,
    cpfCnpj,
    cep,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    paymentMethod,
  } = req.body;

  if (!nome || !email || !telefone) {
    return res.status(400).json({
      status: 'error',
      code: 'MISSING_FIELDS',
      message: 'Nome, e-mail e telefone são obrigatórios',
    });
  }
  if (!cartId && !orderId) {
    return res.status(400).json({
      status: 'error',
      code: 'MISSING_CART_OR_ORDER',
      message: 'cartId ou orderId é obrigatório',
    });
  }

  // Validação de endereço para novos pedidos (cart)
  if (!orderId) {
    const cepVal = (cep || '').replace(/\D/g, '');
    if (cepVal.length !== 8) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_CEP',
        message: 'CEP inválido. Informe um CEP com 8 dígitos.',
      });
    }
    if (!endereco?.trim() || !numero?.trim() || !bairro?.trim() || !cidade?.trim() || !estado?.trim()) {
      return res.status(400).json({
        status: 'error',
        code: 'INCOMPLETE_ADDRESS',
        message: 'Endereço incompleto. Preencha rua, número, bairro, cidade e UF.',
      });
    }
  }

  storeLogger.checkout('create-payment request', {
    cartId: cartId ?? undefined,
    orderId: orderId ?? undefined,
    email,
  });

  if (!process.env.ASAAS_API_KEY) {
    return res.status(500).json({
      status: 'error',
      code: 'ASAAS_NOT_CONFIGURED',
      message: 'Sistema de pagamento não configurado',
    });
  }

  const billingType = paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : 'PIX';

  type SnapshotItem = {
    productId: string;
    productSlug: string;
    name: string;
    quantity: number;
    priceCents: number;
    lineTotalCents: number;
  };
  const snapshotItems: SnapshotItem[] = [];
  let cart: { id: string; profileId: string | null; items: { id: string; productId: string; variantId: string | null; quantity: number }[] } | null = null;
  let existingOrder: Awaited<ReturnType<typeof prisma.order.findUnique>> & { items: { productId: string; variantId: string | null }[] } | null = null;
  let subtotalCents = 0;
  let shippingCents = 0;
  let shippingDays = 10;
  let shippingRegion = 'Brasil';
  let snapshot: { items: SnapshotItem[]; subtotalCents: number; shippingCents: number; totalCents: number };

  if (orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order || order.items.length === 0) {
      return res.status(400).json({
        status: 'error',
        code: 'ORDER_NOT_FOUND',
        message: 'Pedido não encontrado ou inválido',
      });
    }
    if (order.asaasPaymentId) {
      return res.status(400).json({
        status: 'error',
        code: 'ORDER_ALREADY_PAID',
        message: 'Este pedido já possui pagamento',
      });
    }
    if (order.requiresRxValidation && order.rxValidationStatus !== 'approved') {
      return res.status(400).json({
        status: 'error',
        code: 'RX_NOT_APPROVED',
        message: 'Aguarde a validação da receita para realizar o pagamento',
      });
    }
    const snap = order.snapshot as { items?: Array<{ productId: string; productSlug: string; name: string; quantity: number; priceCents: number }>; subtotalCents?: number; shippingCents?: number; totalCents?: number } | null;
    if (!snap?.items?.length || snap.subtotalCents == null || snap.shippingCents == null || snap.totalCents == null) {
      return res.status(400).json({
        status: 'error',
        code: 'ORDER_SNAPSHOT_INVALID',
        message: 'Pedido sem snapshot válido',
      });
    }
    existingOrder = order;
    subtotalCents = snap.subtotalCents;
    shippingCents = snap.shippingCents;
    shippingRegion = order.shippingRegion ?? 'Brasil';
    shippingDays = order.shippingDays ?? 10;
    for (const si of snap.items) {
      const lt = si.priceCents * si.quantity;
      snapshotItems.push({
        productId: si.productId,
        productSlug: si.productSlug,
        name: si.name,
        quantity: si.quantity,
        priceCents: si.priceCents,
        lineTotalCents: lt,
      });
    }
    snapshot = {
      items: snapshotItems,
      subtotalCents,
      shippingCents,
      totalCents: snap.totalCents,
    };
  } else {
    cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        status: 'error',
        code: 'CART_EMPTY',
        message: 'Carrinho vazio ou inválido',
      });
    }

  const removedUnavailable: string[] = [];
  for (const item of cart.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: {
        variants: true,
        priceVersions: { where: { validTo: null }, take: 1 },
      },
    });
    if (!product || product.status !== 'active') {
      removedUnavailable.push(product?.name ?? 'Produto');
      await prisma.cartItem.deleteMany({ where: { id: item.id } });
      continue;
    }
    const priceCents = product.variants[0]?.priceCents ?? product.priceVersions[0]?.priceCents ?? null;
    if (!priceCents || priceCents <= 0) {
      return res.status(400).json({
        status: 'error',
        code: 'PRODUCT_NO_PRICE',
        message: `Produto ${product.name} sem preço definido`,
      });
    }
    const lineTotal = priceCents * item.quantity;
    subtotalCents += lineTotal;
    snapshotItems.push({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      quantity: item.quantity,
      priceCents,
      lineTotalCents: lineTotal,
    });
  }

  if (snapshotItems.length === 0) {
    return res.status(400).json({
      status: 'error',
      code: 'CART_EMPTY_AFTER_CLEANUP',
      message: removedUnavailable.length > 0
        ? `Os produtos ${removedUnavailable.join(', ')} estão indisponíveis. Adicione outros itens ao carrinho.`
        : 'Carrinho vazio ou inválido',
    });
  }

  const cepClean = (cep || existingOrder?.shippingCep || '').replace(/\D/g, '');
  if (!existingOrder) {
    if (cepClean.length === 8) {
      const ship = await calculateShippingAsync(cep, subtotalCents);
      shippingCents = ship.shippingCents;
      shippingDays = ship.shippingDays;
      shippingRegion = ship.region;
    } else {
      shippingCents = 2990; // R$ 29,90 padrão se CEP ausente (fallback)
    }
  }

  const totalCents = existingOrder ? snapshot.totalCents : subtotalCents + shippingCents;
  if (!existingOrder) {
    snapshot = {
      items: snapshotItems,
      subtotalCents,
      shippingCents,
      totalCents,
    };
  }
  }

  const valueInReais = Math.max(snapshot.totalCents / 100, 5);
  try {
    assertPriceAudit(snapshot, valueInReais);
  } catch (auditErr) {
    storeLogger.error('Price audit blocked payment', auditErr, {
      orderId: orderId ?? undefined,
      cartId: cartId ?? undefined,
      snapshotTotalCents: snapshot.totalCents,
      valueInReais,
    });
    return res.status(400).json({
      status: 'error',
      code: 'PRICE_AUDIT_FAILED',
      message: auditErr instanceof Error ? auditErr.message : 'Divergência de preço detectada',
    });
  }

  const cpfCnpjCleaned = (cpfCnpj || '').replace(/\D/g, '');
  const isValidCpf = cpfCnpjCleaned.length === 11 || cpfCnpjCleaned.length === 14;

  const cepClean = (cep || existingOrder?.shippingCep || '').replace(/\D/g, '');
  const shipAddr = existingOrder?.shippingAddress as { cep?: string; endereco?: string; numero?: string; complemento?: string; bairro?: string; cidade?: string; estado?: string } | null;
  const customerData: AsaasCustomer = {
    name: nome,
    email,
    phone: telefone.replace(/\D/g, ''),
    ...(isValidCpf && { cpfCnpj: cpfCnpjCleaned }),
    postalCode: cepClean || shipAddr?.cep || undefined,
    address: endereco || shipAddr?.endereco,
    addressNumber: numero || shipAddr?.numero,
    complement: complemento || shipAddr?.complemento,
    province: bairro || shipAddr?.bairro,
    city: cidade || shipAddr?.cidade,
    state: estado || shipAddr?.estado,
    externalReference: `store_v2_${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`,
  };

  let customer: AsaasCustomer;
  try {
    customer = await asaasClient.createOrUpdateCustomer(customerData);
  } catch (err) {
    storeLogger.error('Asaas customer error', err);
    return res.status(500).json({
      status: 'error',
      code: 'CUSTOMER_ERROR',
      message: 'Erro ao processar dados do cliente',
    });
  }

  const paymentData: AsaasPayment = {
    customer: (customer as any).id || customer.externalReference || '',
    billingType: billingType as 'PIX' | 'CREDIT_CARD',
    value: valueInReais,
    dueDate: calculateDueDate(3),
    description: `Pedido MeJoy - ${snapshotItems.length} item(ns)`,
    externalReference: `store_v2_${Date.now()}`,
    metadata: {
      tipo: 'store_v2',
      ...(orderId ? { orderId } : { cartId }),
      customer_name: nome,
      customer_email: email,
      customer_phone: telefone,
      totalCents: String(snapshot.totalCents),
      shippingCents: String(snapshot.shippingCents),
    },
  };

  if (billingType === 'CREDIT_CARD' && req.body.creditCard) {
    const cc = req.body.creditCard;
    paymentData.creditCard = {
      holderName: cc.holderName,
      number: cc.number.replace(/\s/g, ''),
      expiryMonth: String(cc.expiryMonth).padStart(2, '0'),
      expiryYear: cc.expiryYear,
      ccv: cc.ccv,
    };
    paymentData.creditCardHolderInfo = {
      name: nome,
      email,
      cpfCnpj: cpfCnpjCleaned || '',
      postalCode: cepClean || '',
      addressNumber: numero || '',
      phone: telefone.replace(/\D/g, ''),
    };
    paymentData.remoteIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket?.remoteAddress || '';
  }

  try {
    const payment = await asaasClient.createPayment(paymentData);

    let order: { id: string };
    if (existingOrder) {
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          customerEmail: email,
          customerName: nome,
          customerPhone: telefone,
          customerCpf: isValidCpf ? cpfCnpjCleaned : null,
          status: 'PENDING_PAYMENT',
          paymentMethod: billingType,
          asaasPaymentId: payment.id,
          shippingAddress: cep ? { cep, endereco, numero, complemento, bairro, cidade, estado } : existingOrder.shippingAddress,
        },
      });
      order = { id: existingOrder.id };
    } else {
      const created = await prisma.order.create({
        data: {
          customerEmail: email,
          customerName: nome,
          customerPhone: telefone,
          customerCpf: isValidCpf ? cpfCnpjCleaned : null,
          status: 'PENDING_PAYMENT',
          paymentMethod: billingType,
          asaasPaymentId: payment.id,
          totalCents: snapshot.totalCents,
          shippingCents: snapshot.shippingCents,
          shippingCep: cepClean || null,
          shippingDays,
          shippingRegion,
          shippingAddress: cep ? { cep, endereco, numero, complemento, bairro, cidade, estado } : null,
          snapshot,
          profileId: cart!.profileId,
        },
      });
      for (let i = 0; i < snapshotItems.length; i++) {
        const si = snapshotItems[i];
        const cartItem = cart!.items[i];
        await prisma.orderItem.create({
          data: {
            orderId: created.id,
            productId: si.productId,
            variantId: cartItem?.variantId ?? null,
            quantity: si.quantity,
            priceCents: si.priceCents,
          },
        });
      }
      await prisma.cartItem.deleteMany({ where: { cartId: cart!.id } });
      order = { id: created.id };
    }

    let pixDetails = null;
    if (billingType === 'PIX') {
      pixDetails = await resolvePixTransaction(payment, { loggerPrefix: '[store-v2-create-payment]' });
    }

    storeLogger.payment(existingOrder ? 'Order payment linked' : 'Order created', {
      orderId: order.id,
      asaasPaymentId: payment.id,
      totalCents: snapshot.totalCents,
    });

    return res.status(200).json({
      status: 'success',
      orderId: order.id,
      paymentId: payment.id,
      payment: {
        id: payment.id,
        status: payment.status,
        billingType: payment.billingType,
        value: payment.value,
        pixTransaction: pixDetails
          ? {
              qrCode: pixDetails.qrCode,
              qrCodeBase64: pixDetails.qrCodeBase64,
              value: pixDetails.value ?? payment.value,
            }
          : null,
        invoiceUrl: payment.invoiceUrl,
      },
    });
  } catch (err: any) {
    storeLogger.error('Create payment failed', err);
    return res.status(500).json({
      status: 'error',
      code: 'PAYMENT_ERROR',
      message: err?.response?.data?.errors?.[0]?.description || 'Erro ao processar pagamento',
    });
  }
}
