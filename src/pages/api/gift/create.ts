import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { track } from '@/lib/ga4';

// TODO(backcompat-2025-10-23) - GIFT_ENABLED flag para compatibilidade
const GIFT_ENABLED = process.env.GIFT_ENABLED === '1';

if (!prisma) {
  throw new Error('Prisma client not initialized');
}

// Rate limiting simples por IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 }); // 1 hora
    return true;
  }
  
  if (limit.count >= 3) { // Máximo 3 presentes por hora por IP
    return false;
  }
  
  limit.count++;
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!GIFT_ENABLED) {
    return res.status(501).json({ error: 'Gift disabled' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, recipientName, recipientEmail, message } = req.body;
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

    if (!userId || !recipientName || !recipientEmail) {
      return res.status(400).json({ error: 'Missing required fields: userId, recipientName, recipientEmail' });
    }

    // Rate limiting
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({ error: 'Rate limit exceeded. Maximum 3 gifts per hour.' });
    }

    // Verificar se o usuário tem plano Plus ativo
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
        activeUntil: { gt: new Date() },
        planPrice: '49' // Apenas plano Plus pode criar presentes
      }
    });

    if (!activeSubscription) {
      return res.status(403).json({ error: 'Active Plus subscription required to create gifts' });
    }

    // Verificar limite de 1 presente por mês por usuário
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // TODO(backcompat-2025-10-23) - Cast para any quando model não existe
    const prismaAny = prisma as any;
    const recentGifts = await prismaAny.giftToken.count({
      where: {
        issuerUserId: userId,
        created_at: { gte: oneMonthAgo }
      }
    });

    if (recentGifts >= 1) {
      return res.status(429).json({ error: 'Maximum 1 gift per month allowed' });
    }

    // Criar token de presente
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expira em 30 dias

    const giftToken = await prismaAny.giftToken.create({
      data: {
        issuerUserId: userId,
        status: 'issued',
        expiresAt,
        asaasPaymentId: null // Será preenchido após pagamento
      }
    });

    // Criar sessão de checkout para o presente usando Asaas
    const checkoutApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/asaas/subscription-checkout`;
    
    const checkoutResponse = await fetch(checkoutApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan: 'plus',
        period: 'monthly',
        variant: 'gift',
        email: recipientEmail,
        name: recipientName,
        beneficiaryEmail: recipientEmail,
      }),
    });

    if (!checkoutResponse.ok) {
      // Se falhar, deletar o token criado
      await prisma.giftToken.delete({
        where: { id: giftToken.id }
      });
      
      return res.status(500).json({ error: 'Failed to create checkout session' });
    }

    const checkoutData = await checkoutResponse.json();
    const checkoutUrl = checkoutData.status === 'success' 
      ? (checkoutData.url || `/checkout/pix?paymentId=${checkoutData.paymentId}`)
      : null;

    // Trackear evento GA4
    trackEvent('gift_created', {
      gift_token_id: giftToken.id,
      plan: 'plus',
      source: 'dashboard',
      recipient_email: recipientEmail
    });

    res.status(200).json({
      success: true,
      giftTokenId: giftToken.id,
      checkoutUrl,
      expiresAt: giftToken.expiresAt,
      message: 'Gift token created successfully. Complete payment to activate.'
    });

  } catch (error) {
    console.error('Gift creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create gift',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
