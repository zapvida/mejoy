// src/pages/api/gift/[code]/redeem.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// TODO(backcompat-2025-10-23) - GIFT_ENABLED flag para compatibilidade
const GIFT_ENABLED = process.env.GIFT_ENABLED === '1';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!GIFT_ENABLED) {
    return res.status(501).json({ error: 'Gift disabled' });
  }
  if (req.method !== 'POST') {
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
      include: {
        giver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!gift) {
      return res.status(404).json({ error: 'Código de presente não encontrado' });
    }

    if (gift.redeemedAt) {
      return res.status(400).json({ error: 'Este presente já foi resgatado' });
    }

    // Verificar se já existe uma assinatura ativa para o presenteado
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: gift.giverUserId, // Por enquanto usando o ID do doador
        status: 'active',
        activeUntil: {
          gt: new Date()
        }
      }
    });

    if (existingSubscription) {
      return res.status(400).json({ error: 'Você já possui uma assinatura ativa' });
    }

    // Criar nova assinatura
    const subscription = await prisma.subscription.create({
      data: {
        userId: gift.giverUserId, // Em produção, você criaria um novo usuário se necessário
        kind: 'gift',
        activeFrom: new Date(),
        activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        status: 'active'
      }
    });

    // Marcar presente como resgatado
    await prismaAny.gift.update({
      where: { id: gift.id },
      data: {
        redeemedAt: new Date(),
        redeemedByUserId: gift.giverUserId
      }
    });

    console.log('✅ Presente resgatado com sucesso:', {
      giftId: gift.id,
      subscriptionId: subscription.id,
      recipientName: gift.recipientName
    });

    return res.status(200).json({
      success: true,
      subscriptionId: subscription.id,
      activeUntil: subscription.activeUntil,
      message: 'Presente resgatado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao resgatar presente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
