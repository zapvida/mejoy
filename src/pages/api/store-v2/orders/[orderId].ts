/**
 * GET /api/store-v2/orders/[orderId]
 * Retorna detalhes do pedido por ID (orderId é CUID, aceitável para leitura pública por link).
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

type SnapshotItem = {
  productId: string;
  productSlug: string;
  name: string;
  quantity: number;
  priceCents: number;
  lineTotalCents?: number;
};

type Snapshot = {
  items: SnapshotItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const orderId = req.query.orderId as string;
  if (!orderId) {
    return res.status(400).json({ error: 'orderId obrigatório' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const snap = order.snapshot as Snapshot | null;
    const items: SnapshotItem[] = snap?.items ?? order.items.map((i) => ({
      productId: i.productId,
      productSlug: '',
      name: 'Produto',
      quantity: i.quantity,
      priceCents: i.priceCents,
      lineTotalCents: i.priceCents * i.quantity,
    }));

    const addr = order.shippingAddress as {
      cep?: string;
      endereco?: string;
      numero?: string;
      complemento?: string;
      bairro?: string;
      cidade?: string;
      estado?: string;
    } | null;

    return res.status(200).json({
      id: order.id,
      status: order.status,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      totalCents: order.totalCents,
      shippingCents: order.shippingCents,
      shippingDays: order.shippingDays,
      shippingAddress: addr,
      trackingCode: order.trackingCode,
      trackingUrl: order.trackingUrl,
      shippedAt: order.shippedAt?.toISOString() ?? null,
      deliveredAt: order.deliveredAt?.toISOString() ?? null,
      items,
      snapshot: snap,
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod,
      asaasPaymentId: order.asaasPaymentId,
    });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
