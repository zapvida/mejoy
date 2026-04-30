/**
 * Submit RX/Validação: cria Order (sem pagamento), RxSubmission, dispara Evolution
 * Ordem só pode ser paga após admin aprovar (rxValidationStatus=approved)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { calculateShippingAsync } from '@/lib/store-v2/shipping';
import { storeLogger } from '@/lib/store-v2/logger';
import { sendEvolutionMessageStoreV2 } from '@/lib/evolution/client';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mejoy.com.br';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido' });
  }

  const { cartId, nome, email, telefone, cpfCnpj, cep, endereco, numero, complemento, bairro, cidade, estado, rxPayload } = req.body as {
    cartId?: string;
    nome?: string;
    email?: string;
    telefone?: string;
    cpfCnpj?: string;
    cep?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    rxPayload?: { sintomaMotivo?: string; observacoes?: string };
  };

  if (!cartId || !nome || !email || !telefone) {
    return res.status(400).json({
      status: 'error',
      code: 'MISSING_FIELDS',
      message: 'cartId, nome, email e telefone são obrigatórios',
    });
  }

  const cart = await prisma.cart.findUnique({
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

  let subtotalCents = 0;
  const snapshotItems: Array<{ productId: string; productSlug: string; name: string; quantity: number; priceCents: number }> = [];
  let anyRequiresRx = false;

  for (const item of cart.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: { variants: true, priceVersions: { where: { validTo: null }, take: 1 } },
    });
    if (!product || product.status !== 'active') {
      return res.status(400).json({
        status: 'error',
        code: 'PRODUCT_UNAVAILABLE',
        message: `Produto ${product?.name ?? 'inválido'} indisponível`,
      });
    }
    const priceCents = product.variants[0]?.priceCents ?? product.priceVersions[0]?.priceCents ?? null;
    if (!priceCents || priceCents <= 0) {
      return res.status(400).json({
        status: 'error',
        code: 'PRODUCT_NO_PRICE',
        message: `Produto ${product.name} sem preço`,
      });
    }
    if (product.requiresRx || product.requiresValidation) anyRequiresRx = true;
    const lineTotal = priceCents * item.quantity;
    subtotalCents += lineTotal;
    snapshotItems.push({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      quantity: item.quantity,
      priceCents,
    });
  }

  if (!anyRequiresRx) {
    return res.status(400).json({
      status: 'error',
      code: 'RX_NOT_REQUIRED',
      message: 'Este pedido não exige validação de receita',
    });
  }

  const cepClean = (cep || '').replace(/\D/g, '');
  let shippingCents = 2990;
  let shippingDays = 10;
  let shippingRegion = 'Brasil';
  if (cepClean.length === 8) {
    const ship = await calculateShippingAsync(cep, subtotalCents);
    shippingCents = ship.shippingCents;
    shippingDays = ship.shippingDays;
    shippingRegion = ship.region;
  }

  const totalCents = subtotalCents + shippingCents;
  const snapshot = {
    items: snapshotItems.map((i) => ({ ...i, lineTotalCents: i.priceCents * i.quantity })),
    subtotalCents,
    shippingCents,
    totalCents,
  };

  const cpfCnpjCleaned = (cpfCnpj || '').replace(/\D/g, '');

  const order = await prisma.order.create({
    data: {
      customerEmail: email,
      customerName: nome,
      customerPhone: telefone,
      customerCpf: cpfCnpjCleaned.length === 11 || cpfCnpjCleaned.length === 14 ? cpfCnpjCleaned : null,
      status: 'PENDING_RX_VALIDATION',
      requiresRxValidation: true,
      rxValidationStatus: 'pending',
      totalCents,
      shippingCents,
      shippingCep: cepClean || null,
      shippingDays,
      shippingRegion,
      shippingAddress: cep ? { cep, endereco, numero, complemento, bairro, cidade, estado } : null,
      snapshot,
      profileId: cart.profileId,
    },
  });

  for (let i = 0; i < snapshotItems.length; i++) {
    const si = snapshotItems[i];
    const cartItem = cart.items[i];
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: si.productId,
        variantId: cartItem?.variantId ?? null,
        quantity: si.quantity,
        priceCents: si.priceCents,
      },
    });
  }

  const payload = {
    nome,
    cpf: cpfCnpjCleaned,
    sintomaMotivo: rxPayload?.sintomaMotivo,
    observacoes: rxPayload?.observacoes,
  };

  await prisma.rxSubmission.create({
    data: {
      orderId: order.id,
      payloadJson: payload,
      uploadedFiles: [],
    },
  });

  await prisma.cartItem.deleteMany({ where: { cartId } });

  const itemsList = snapshotItems.map((i) => `• ${i.name} (${i.quantity}x)`).join('\n');
  const msg = `*Pedido #${order.id.slice(-8)} - Validação de receita*

Cliente: ${nome}
Email: ${email}
Telefone: ${telefone}

*Itens:*
${itemsList}

*Instruções:* Valide a receita no painel admin e aprove para liberar o pagamento.
${BASE_URL}/admin/store-v2/orders`;

  const evolutionResult = await sendEvolutionMessageStoreV2(telefone, msg);
  if (!evolutionResult.success) {
    storeLogger.error('Evolution RX message failed', new Error(evolutionResult.error), { orderId: order.id });
  }

  storeLogger.checkout('RX submitted', { orderId: order.id, cartId });

  return res.status(200).json({
    status: 'success',
    orderId: order.id,
    message: 'Receita enviada. Nossa equipe validará e você receberá o link de pagamento por WhatsApp.',
  });
}
