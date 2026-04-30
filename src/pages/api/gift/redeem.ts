import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { track } from '@/lib/ga4';

// TODO(backcompat-2025-10-23) - GIFT_ENABLED flag para compatibilidade
const GIFT_ENABLED = process.env.GIFT_ENABLED === '1';

if (!prisma) {
  throw new Error('Prisma client not initialized');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!GIFT_ENABLED) {
    return res.status(501).json({ error: 'Gift disabled' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { giftTokenId, userId, email, name } = req.body;

    if (!giftTokenId) {
      return res.status(400).json({ error: 'Gift token ID is required' });
    }

    // TODO(backcompat-2025-10-23) - Cast para any quando model não existe
    const prismaAny = prisma as any;
    const giftToken = await prismaAny.giftToken.findUnique({
      where: { id: giftTokenId },
      include: {
        issuer: true
      }
    });

    if (!giftToken) {
      return res.status(404).json({ error: 'Gift token not found' });
    }

    if (giftToken.status !== 'issued') {
      return res.status(400).json({ error: 'Gift token already redeemed or expired' });
    }

    if (giftToken.expiresAt < new Date()) {
      // Marcar como expirado
      await prismaAny.giftToken.update({
        where: { id: giftTokenId },
        data: { status: 'expired' }
      });
      return res.status(400).json({ error: 'Gift token has expired' });
    }

    // Se userId fornecido, verificar se já tem assinatura ativa
    if (userId) {
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: 'active',
          activeUntil: { gt: new Date() }
        }
      });

      if (existingSubscription) {
        return res.status(400).json({ 
          error: 'User already has an active subscription' 
        });
      }
    }

    // Resgatar o presente
    const redeemedGiftToken = await prismaAny.giftToken.update({
      where: { id: giftTokenId },
      data: {
        status: 'redeemed',
        redeemedAt: new Date(),
        redeemedByUserId: userId || null
      }
    });

    // Criar assinatura de presente (30 dias)
    const accessEndsAt = new Date();
    accessEndsAt.setDate(accessEndsAt.getDate() + 30);

    const subscription = await prisma.subscription.create({
      data: {
        userId: userId || 'temp_' + giftTokenId,
        kind: 'gift',
        activeFrom: new Date(),
        activeUntil: accessEndsAt,
        status: 'active',
        amount: 4900, // Valor do plano Plus
        planType: 'monthly',
        planPrice: '49'
      }
    });

    // Trackear evento GA4
    trackEvent('gift_redeemed', {
      gift_token_id: giftTokenId,
      plan: 'plus',
      source: 'redeem_page',
      issuer_user_id: giftToken.issuerUserId
    });

    res.status(200).json({ 
      success: true,
      subscription: {
        id: subscription.id,
        activeUntil: subscription.activeUntil
      },
      gift: {
        id: redeemedGiftToken.id,
        issuerName: giftToken.issuer.name,
        expiresAt: giftToken.expiresAt
      }
    });

  } catch (error) {
    console.error('Gift redemption error:', error);
    res.status(500).json({ 
      error: 'Failed to redeem gift',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}