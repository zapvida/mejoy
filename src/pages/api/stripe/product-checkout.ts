import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getProductConfig } from '@/lib/zapfarm/product-loader';
import { getStripePriceIdFromPlan } from '@/lib/zapfarm/stripe-utils';
import { readUtmFromReq } from '@/lib/analytics/utm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error',
      code: 'METHOD_NOT_ALLOWED',
      message: 'Método não permitido' 
    });
  }

  const { product, plano, reportId, triageId, nome, email, telefone } = req.body;

  // Validações com mensagens de erro amigáveis
  if (!product || !plano) {
    return res.status(400).json({ 
      status: 'error',
      code: 'MISSING_REQUIRED_FIELDS',
      message: 'Produto e plano são obrigatórios' 
    });
  }

  if (!['basico', 'completo', 'premium'].includes(plano)) {
    return res.status(400).json({ 
      status: 'error',
      code: 'INVALID_PLAN',
      message: 'Plano inválido. Escolha entre básico, completo ou premium' 
    });
  }

  const productConfig = getProductConfig(product);
  if (!productConfig) {
    return res.status(400).json({ 
      status: 'error',
      code: 'PRODUCT_NOT_FOUND',
      message: 'Produto não encontrado' 
    });
  }

  const planConfig = productConfig.plans[plano as 'basico' | 'completo' | 'premium'];
  if (!planConfig) {
    return res.status(400).json({ 
      status: 'error',
      code: 'PLAN_NOT_FOUND',
      message: 'Plano não encontrado para este produto' 
    });
  }

  // Resolver price ID da env var usando helper
  let priceId: string;
  try {
    priceId = getStripePriceIdFromPlan(planConfig);
  } catch (error: any) {
    console.error(`[product-checkout] Price ID não configurado: ${planConfig.stripePriceId}`);
    return res.status(400).json({ 
      status: 'error',
      code: 'MISSING_ENV',
      message: 'No momento este produto/plano não está disponível. Tente novamente mais tarde.',
      details: `Variável de ambiente ${planConfig.stripePriceId} não configurada`
    });
  }

  try {
    const successUrl = `${req.headers.origin}/${product}/obrigado?session_id={CHECKOUT_SESSION_ID}`;
    
    // Para produtos sem triagem obrigatória, cancelar volta para LPAC
    // Para emagrecimento (com triagem), volta para relatório se houver reportId
    const isEmagrecimento = product === 'emagrecimento';
    const cancelUrl = isEmagrecimento && (reportId || triageId)
      ? `${req.headers.origin}/${product}/relatorio?id=${reportId || triageId}`
      : `${req.headers.origin}/${product}`;

    // Extrair UTM params dos cookies (já capturados pelo middleware)
    const utm = readUtmFromReq(req);

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
      // Preencher dados do cliente se disponíveis (opcional)
      ...(email && { customer_email: email }),
      metadata: {
        tipo: 'zapfarm',
        product,
        plano,
        reportId: reportId || '',
        triageId: triageId || '',
        ...(nome && { customer_name: nome }),
        ...(email && { customer_email: email }),
        ...(telefone && { customer_phone: telefone }),
        // Incluir UTM params se disponíveis
        ...(utm.source && { utm_source: utm.source }),
        ...(utm.medium && { utm_medium: utm.medium }),
        ...(utm.campaign && { utm_campaign: utm.campaign }),
        ...(utm.content && { utm_content: utm.content }),
        ...(utm.term && { utm_term: utm.term }),
      },
    });

    return res.status(200).json({ 
      status: 'success',
      url: session.url 
    });
  } catch (error: any) {
    console.error('[product-checkout] Erro ao criar sessão de checkout', error);
    
    // Tratar erros específicos do Stripe
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        status: 'error',
        code: 'STRIPE_ERROR',
        message: 'Erro ao processar pagamento. Verifique os dados e tente novamente.' 
      });
    }
    
    return res.status(500).json({ 
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: 'Erro ao processar pagamento. Tente novamente em alguns instantes.' 
    });
  }
}

