// src/pages/api/stripe/checkout.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const priceMap: Record<string, string> = {
  pass: 'price_pass_zapfarm_49',     // R$ 49 - passe de 30 dias
  presente: 'price_presente_zapfarm_89', // R$ 89 - presente
  assinatura: 'price_pass_zapfarm_49',    // Alias para compatibilidade
  // Preços antigos mantidos para compatibilidade
  starter: 'price_1RoZ6p2Nl0Zqe3RCE7dl2oj5',
  whiteLabel: 'price_1RoZ7t2Nl0Zqe3RC8lPlMlmX',
  scalePro: 'price_1RoZBX2Nl0Zqe3RCAAXDuRB8',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { plan, metadata } = req.body;

  const priceId = priceMap[plan];
  if (!priceId) {
    return res.status(400).json({ error: 'Plano inválido' });
  }

  try {
    // URLs de sucesso específicas
    let successUrl = `${req.headers.origin}/obrigado?tipo=${plan}`;
    let cancelUrl = `${req.headers.origin}/triagem`;

    const sessionConfig: any = {
      payment_method_types: ['card', 'pix'], // Suporte a Pix
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        plan,
        priceId,
        ...metadata
      }
    };

    // Configurar modo baseado no tipo de plano
    // Todos os planos são pagamentos únicos (não assinaturas recorrentes)
    sessionConfig.mode = 'payment';

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout', error);
    return res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
  }
}
