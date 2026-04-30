import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getProfileFromRequest } from '@/lib/api/auth-helper';

const prisma = new PrismaClient();

type Order = {
  id: string;
  productSlug: string;
  planSlug: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  paidAt: string | null;
  customerName: string;
  customerEmail: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Order[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Buscar Profile do usuário autenticado
    const profile = await getProfileFromRequest(req);

    if (!profile) {
      // Se não houver profile, retornar array vazio
      return res.status(200).json([]);
    }

    const userEmail = profile.email?.toLowerCase();

    // Buscar pedidos do usuário
    const orders = await prisma.zapfarmOrder.findMany({
      where: {
        OR: [
          ...(userEmail ? [{ customerEmail: userEmail }] : []),
          { profileId: profile.id },
        ],
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        productSlug: true,
        planSlug: true,
        status: true,
        amount: true,
        currency: true,
        createdAt: true,
        paidAt: true,
        customerName: true,
        customerEmail: true,
      },
    });

    const formattedOrders: Order[] = orders.map(order => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      paidAt: order.paidAt ? order.paidAt.toISOString() : null,
    }));

    return res.status(200).json(formattedOrders);
  } catch (error: any) {
    console.error('[orders] Error:', error);
    return res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
}

