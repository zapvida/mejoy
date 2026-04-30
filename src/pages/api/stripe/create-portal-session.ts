import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { STRIPE_CONFIG } from '@/lib/stripe-config';
import { prisma } from '@/lib/prisma';

if (!prisma) {
  throw new Error('Prisma client not initialized');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // TODO: Implementar autenticação real aqui
    // const session = await getServerSession(req, res, authOptions);
    // if (!session || session.user.id !== userId) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    // Buscar assinatura ativa do usuário
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
        stripeCustomerId: { not: null }
      },
      orderBy: { created_at: 'desc' }
    });

    if (!subscription?.stripeCustomerId) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Criar sessão do portal de cobrança
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: STRIPE_CONFIG.CHECKOUT.billingPortalReturnUrl,
    });

    res.status(200).json({ 
      url: portalSession.url 
    });

  } catch (error) {
    console.error('Billing portal error:', error);
    res.status(500).json({ 
      error: 'Failed to create billing portal session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
