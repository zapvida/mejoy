// src/pages/api/gift/[code].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// TODO(backcompat-2025-10-23) - GIFT_ENABLED flag para compatibilidade
const GIFT_ENABLED = process.env.GIFT_ENABLED === '1';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!GIFT_ENABLED) {
    return res.status(501).json({ error: 'Gift disabled' });
  }

  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Código é obrigatório' });
  }

  try {
    if (!prisma) {
      return res.status(503).json({ error: "Database not available" });
    }

    // TODO(backcompat-2025-10-23) - Cast para any quando model não existe
    const prismaAny = prisma as any;
    const gift = await prismaAny.gift.findUnique({
      where: { code },
      select: {
        id: true,
        recipientName: true,
        message: true,
        created_at: true,
        redeemedAt: true,
        redeemedByUserId: true
      }
    });

    if (!gift) {
      return res.status(404).json({ error: 'Código de presente não encontrado' });
    }

    return res.status(200).json(gift);
  } catch (error) {
    console.error('Erro ao buscar presente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
