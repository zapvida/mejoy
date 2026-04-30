/**
 * GET /api/store-v2/orders
 * Lista pedidos Store V2 do usuário logado (por profileId ou customerEmail).
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getProfileFromRequest, getUserEmailFromRequest } from '@/lib/api/auth-helper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = await getProfileFromRequest(req);
    const userEmail = profile?.email?.toLowerCase() ?? (await getUserEmailFromRequest(req))?.toLowerCase();

    if (!profile && !userEmail) {
      return res.status(200).json([]);
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          ...(profile?.id ? [{ profileId: profile.id }] : []),
          ...(userEmail ? [{ customerEmail: userEmail }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        totalCents: true,
        shippingCents: true,
        trackingCode: true,
        trackingUrl: true,
        createdAt: true,
        customerName: true,
      },
    });

    return res.status(200).json(
      orders.map((o) => ({
        id: o.id,
        status: o.status,
        totalCents: o.totalCents,
        shippingCents: o.shippingCents,
        trackingCode: o.trackingCode,
        trackingUrl: o.trackingUrl,
        createdAt: o.createdAt.toISOString(),
        customerName: o.customerName,
      }))
    );
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
