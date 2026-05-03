/**
 * GET /api/store-v2/orders/[orderId]
 * Retorna detalhes do pedido por ID apenas para o dono autenticado ou via link assinado.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getProfileFromRequest, getUserEmailFromRequest } from '@/lib/api/auth-helper';
import { verifyOrderAccessToken } from '@/lib/store-v2/order-access';

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

    const accessToken = typeof req.query.access === 'string' ? req.query.access : undefined;
    const access = verifyOrderAccessToken(accessToken, orderId);
    const profile = await getProfileFromRequest(req);
    const userEmail = (profile?.email?.toLowerCase() || (await getUserEmailFromRequest(req))?.toLowerCase() || null);
    const ownsByProfile = Boolean(profile?.id && order.profileId && profile.id === order.profileId);
    const ownsByEmail = Boolean(userEmail && order.customerEmail.toLowerCase() === userEmail);

    if (!access.valid && !ownsByProfile && !ownsByEmail) {
      return res.status(userEmail || profile ? 403 : 401).json({
        error: userEmail || profile ? 'Você não tem acesso a este pedido' : 'Autenticação necessária para abrir este pedido',
      });
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
      createdAt: order.createdAt.toISOString(),
      paymentMethod: order.paymentMethod,
      asaasPaymentId: order.asaasPaymentId,
    });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
