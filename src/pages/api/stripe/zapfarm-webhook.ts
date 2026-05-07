import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { PrismaClient } from '@/lib/prisma-client';

const prisma = new PrismaClient();

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

/**
 * Webhook específico para pedidos ZapFarm
 * 
 * Este webhook processa eventos de checkout do Stripe para produtos ZapFarm
 * e persiste os pedidos no banco de dados.
 * 
 * Configuração no Stripe Dashboard:
 * 1. Ir em Developers > Webhooks
 * 2. Adicionar endpoint: https://seu-dominio.com/api/stripe/zapfarm-webhook
 * 3. Selecionar evento: checkout.session.completed
 * 4. Copiar o webhook secret e adicionar como STRIPE_WEBHOOK_SECRET_ZAPFARM
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_ZAPFARM;
  
  if (!webhookSecret) {
    console.error('[zapfarm-webhook] STRIPE_WEBHOOK_SECRET_ZAPFARM não configurado');
    return res.status(500).json({ error: 'Webhook secret não configurado' });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;
    
    if (!sig) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('[zapfarm-webhook] Erro ao validar assinatura:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Processar apenas eventos relacionados a checkout do ZapFarm
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Verificar se é um pedido ZapFarm pela metadata
    if (session.metadata?.tipo !== 'zapfarm') {
      // Não é um pedido ZapFarm, ignorar silenciosamente
      return res.status(200).json({ received: true, skipped: 'not_zapfarm' });
    }

    try {
      // Extrair dados da sessão
      const productSlug = session.metadata.product;
      const planSlug = session.metadata.plano;
      const reportId = session.metadata.reportId || null;
      const triageId = session.metadata.triageId || null;
      const customerName = session.metadata.customer_name || session.customer_details?.name || 'Cliente';
      const customerEmail = session.metadata.customer_email || session.customer_details?.email || '';
      const customerPhone = session.metadata.customer_phone || session.customer_details?.phone || null;

      // Extrair UTM se disponível
      const utmSource = session.metadata.utm_source || null;
      const utmMedium = session.metadata.utm_medium || null;
      const utmCampaign = session.metadata.utm_campaign || null;
      const utmContent = session.metadata.utm_content || null;
      const utmTerm = session.metadata.utm_term || null;

      // Validar campos obrigatórios
      if (!productSlug || !planSlug || !customerEmail) {
        console.error('[zapfarm-webhook] Dados incompletos na sessão:', {
          sessionId: session.id,
          productSlug,
          planSlug,
          customerEmail,
        });
        return res.status(400).json({ error: 'Dados incompletos na sessão' });
      }

      // Determinar status baseado no payment_status
      let status = 'PENDING';
      if (session.payment_status === 'paid') {
        status = 'PAID';
      } else if (session.payment_status === 'unpaid') {
        status = 'PENDING';
      } else if (session.status === 'expired') {
        status = 'CANCELED';
      }

      // Obter valor total (em centavos)
      const amount = session.amount_total || 0;
      const currency = session.currency?.toUpperCase() || 'BRL';

      // Tentar vincular ao Profile pelo email
      let profileId: string | null = null;
      if (customerEmail) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          
          if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', customerEmail.toLowerCase())
              .maybeSingle();
            
            if (profile?.id) {
              profileId = profile.id;
            }
          }
        } catch (profileError) {
          // Não bloquear o processamento do pedido se falhar ao buscar profile
          console.warn('[zapfarm-webhook] Erro ao buscar profile:', profileError);
        }
      }

      // Upsert do pedido (idempotente usando stripeSessionId)
      const order = await prisma.zapfarmOrder.upsert({
        where: {
          stripeSessionId: session.id,
        },
        update: {
          status,
          stripePaymentIntentId: session.payment_intent as string | null,
          amount,
          currency,
          customerName,
          customerEmail,
          customerPhone,
          reportId,
          triageId,
          profileId: profileId || undefined, // Atualizar apenas se encontrou profile
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          utmTerm,
          ...(status === 'PAID' && !session.payment_intent ? {} : { paidAt: status === 'PAID' ? new Date() : null }),
          updatedAt: new Date(),
        },
        create: {
          productSlug,
          planSlug,
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string | null,
          status,
          customerName,
          customerEmail,
          customerPhone,
          amount,
          currency,
          reportId,
          triageId,
          profileId: profileId || undefined, // Vincular ao profile se encontrado
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          utmTerm,
          paidAt: status === 'PAID' ? new Date() : null,
        },
      });

      console.log('[zapfarm-webhook] Pedido processado:', {
        orderId: order.id,
        productSlug,
        planSlug,
        status,
        amount,
        sessionId: session.id,
      });

      return res.status(200).json({ 
        received: true, 
        orderId: order.id,
        status: order.status 
      });
    } catch (error: any) {
      console.error('[zapfarm-webhook] Erro ao processar pedido:', {
        sessionId: session.id,
        error: error.message,
        stack: error.stack,
      });
      
      // Retornar 200 para evitar retries infinitos do Stripe
      // Mas logar o erro para investigação
      return res.status(200).json({ 
        received: true, 
        error: 'Erro ao processar pedido (verificar logs)' 
      });
    }
  }

  // Outros tipos de evento podem ser tratados aqui no futuro
  // Por enquanto, apenas checkout.session.completed é processado
  return res.status(200).json({ received: true, eventType: event.type });
}
