/**
 * GET /api/admin/store-v2/orders
 * Lista pedidos Store V2 com filtros. Protegido por ADMIN_SECRET_KEY.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAdmin(req, res)) return;

  try {
    const { status, search } = req.query;
    const where: Record<string, unknown> = {};

    if (typeof status === 'string' && status) {
      where.status = status;
    }

    if (typeof search === 'string' && search.trim()) {
      const term = search.trim();
      const phoneDigits = term.replace(/\D/g, '');
      where.OR = [
        { customerEmail: { contains: term, mode: 'insensitive' } },
        { customerName: { contains: term, mode: 'insensitive' } },
        ...(phoneDigits.length >= 3
          ? [{ customerPhone: { contains: phoneDigits } }]
          : []),
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          select: { quantity: true, priceCents: true, productId: true },
        },
      },
    });

    return res.status(200).json(
      orders.map((o) => ({
        id: o.id,
        status: o.status,
        customerEmail: o.customerEmail,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        totalCents: o.totalCents,
        shippingCents: o.shippingCents,
        shippingAddress: o.shippingAddress,
        trackingCode: o.trackingCode,
        trackingUrl: o.trackingUrl,
        shippedAt: o.shippedAt?.toISOString() ?? null,
        deliveredAt: o.deliveredAt?.toISOString() ?? null,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        itemsCount: o.items.length,
      }))
    );
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
