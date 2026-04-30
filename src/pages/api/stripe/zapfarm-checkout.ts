import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

const ZAPFARM_PRICES: Record<string, string> = {
  mensal: process.env.STRIPE_PRICE_ZAPFARM_MENSAL || '',
  trimestral: process.env.STRIPE_PRICE_ZAPFARM_TRIMESTRAL || '',
  semestral: process.env.STRIPE_PRICE_ZAPFARM_SEMESTRAL || '',
};

const ZAPFARM_PRICES_TIRZ: Record<string, string> = {
  mensal: process.env.STRIPE_PRICE_ZAPFARM_TIRZ_MENSAL || '',
  trimestral: process.env.STRIPE_PRICE_ZAPFARM_TIRZ_TRIMESTRAL || '',
  semestral: process.env.STRIPE_PRICE_ZAPFARM_TIRZ_SEMESTRAL || '',
};

const ZAPFARM_PRICES_SEMA: Record<string, string> = {
  mensal: process.env.STRIPE_PRICE_ZAPFARM_SEMA_MENSAL || '',
  trimestral: process.env.STRIPE_PRICE_ZAPFARM_SEMA_TRIMESTRAL || '',
  semestral: process.env.STRIPE_PRICE_ZAPFARM_SEMA_SEMESTRAL || '',
};

type Plano = 'mensal' | 'trimestral' | 'semestral';

function resolvePriceId(plano: Plano, principio?: string): string | null {
  if (principio === 'tirzepatida' && ZAPFARM_PRICES_TIRZ[plano]) {
    return ZAPFARM_PRICES_TIRZ[plano];
  }
  if (principio === 'semaglutida' && ZAPFARM_PRICES_SEMA[plano]) {
    return ZAPFARM_PRICES_SEMA[plano];
  }
  // Fallback para não quebrar nada se envs não estiverem setadas
  return ZAPFARM_PRICES[plano] || null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { plano, triageId, reportId, principio } = req.body;

  if (!plano || !['mensal', 'trimestral', 'semestral'].includes(plano)) {
    return res.status(400).json({ error: 'Plano inválido' });
  }

  const priceId = resolvePriceId(plano as Plano, principio);
  if (!priceId) {
    return res.status(400).json({ error: 'Preço não configurado para este plano' });
  }

  try {
    const successUrl = `${req.headers.origin}/emagrecimento/obrigado?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${req.headers.origin}/emagrecimento/relatorio?id=${reportId || triageId}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'pix'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tipo: 'zapfarm',
        plano,
        triageId: triageId || '',
        reportId: reportId || '',
        principio: principio || 'nao_informado',
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout Zapfarm', error);
    return res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
  }
}

