import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import { buildSuccessUrl, buildCancelUrl } from "@/lib/utils/url";
import {
  buildCheckoutMetadata,
  CheckoutPayload,
  CheckoutVariant,
  getPriceIds,
  getAddonPriceId
} from '@/lib/stripe/metadata';
import { readUtmFromReq } from '@/lib/analytics/utm';
import { detectTenantByHost } from '@/lib/tenancy/tenant';
import { isRootB2BDomain } from '@/lib/flags';
import { withRateLimit } from '@/pages/api/_utils/withRateLimit';

// Schema de validação
const validateCheckoutRequest = (body: any) => {
  const payload = body ?? {};

  const plan = payload.plan;
  const period = payload.period;
  const variant: CheckoutVariant = payload.variant === 'gift' ? 'gift' : 'standard';
  const extraSeatsRaw = typeof payload.extraSeats === 'number' ? payload.extraSeats : Number(payload.extraSeats);
  const extraSeats = Number.isFinite(extraSeatsRaw) ? Math.max(0, Math.min(10, Math.floor(extraSeatsRaw))) : 0;
  const beneficiaryEmail = typeof payload.beneficiaryEmail === 'string' ? payload.beneficiaryEmail.trim() : undefined;
  const cta_variant = typeof payload.cta_variant === 'string' ? payload.cta_variant : undefined;
  const draft_id = typeof payload.draft_id === 'string' ? payload.draft_id : undefined; // Lote H+I

  if (!plan || !period) {
    throw new Error("Plan and period are required");
  }

  if (plan !== 'plus') {
    throw new Error("Invalid plan. Must be 'plus'");
  }

  if (!['monthly', 'yearly'].includes(period)) {
    throw new Error("Invalid period. Must be 'monthly' or 'yearly'");
  }

  if (variant === 'gift' && beneficiaryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(beneficiaryEmail)) {
    throw new Error("Invalid beneficiary email");
  }

  if (variant === 'standard' && beneficiaryEmail) {
    throw new Error("Beneficiary email only allowed for gift variant");
  }

  return { plan, period, variant, extraSeats, beneficiaryEmail, cta_variant, draft_id } as CheckoutPayload & {
    variant: CheckoutVariant;
    extraSeats: number;
    beneficiaryEmail?: string;
    draft_id?: string;
  };
};

// Allowlist de URLs de retorno (segurança)
const ALLOWED_DOMAINS = [
  'localhost:3000',
  'localhost:3001', 
  'zapfarm.com.br',
  'www.zapfarm.com.br',
  'zapfarm.com',
  'www.zapfarm.com'
];

const validateReturnUrls = (successUrl: string, cancelUrl: string) => {
  const successDomain = new URL(successUrl).hostname;
  const cancelDomain = new URL(cancelUrl).hostname;
  
  if (!ALLOWED_DOMAINS.includes(successDomain) || !ALLOWED_DOMAINS.includes(cancelDomain)) {
    throw new Error("Invalid return URLs - domain not allowed");
  }
};

// Validar ENVs obrigatórias do Stripe (guard rails)
const requiredStripeEnvs = [
  'STRIPE_SECRET_KEY',
  'STRIPE_PRICE_PLUS_MONTHLY',
  'STRIPE_PRICE_PLUS_YEARLY',
  'STRIPE_PRICE_GIFT_MONTHLY',
  'STRIPE_PRICE_GIFT_YEARLY',
  'STRIPE_PRICE_ADDON_MONTHLY',
  'STRIPE_PRICE_ADDON_YEARLY',
];

// Validar ENVs na inicialização (apenas warn, não bloqueia)
for (const envKey of requiredStripeEnvs) {
  if (!process.env[envKey]) {
    console.warn(`[stripe] ENV ausente: ${envKey}`);
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    
    // Validar STRIPE_SECRET_KEY
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[stripe] STRIPE_SECRET_KEY não configurada');
      return res.status(500).json({ 
        error: 'Stripe não configurado',
        message: 'Configuração de pagamento indisponível. Entre em contato com o suporte.'
      });
    }
    
    // Validação de schema
    const { plan, period, variant, extraSeats, beneficiaryEmail, cta_variant, draft_id } = validateCheckoutRequest(req.body);
    
    // Root B2B domain: usar tenant padrão (zapfarm) como fallback seguro
    const host = (req.headers['x-forwarded-host'] || req.headers.host || '') as string;
    let tenant;
    try {
      tenant = isRootB2BDomain(host) 
        ? detectTenantByHost(process.env.DEFAULT_TENANT_HOST || 'zapfarm.com.br')
        : detectTenantByHost(host);
    } catch {
      // Fallback seguro se detectTenantByHost falhar
      tenant = detectTenantByHost(process.env.DEFAULT_TENANT_HOST || 'zapfarm.com.br');
    }
    
    // Capturar UTMs para incluir no metadata
    const utm = readUtmFromReq(req);
    const formattedUtm = {
      utm_source: utm.source,
      utm_medium: utm.medium,
      utm_campaign: utm.campaign,
      utm_content: utm.content,
      utm_term: utm.term,
      gclid: utm.gclid,
      fbclid: utm.fbclid,
      ref: utm.ref
    };

    // (Opcional) se tiver user na sessão, pegue email/phone/name
    const email = undefined, phone = undefined, name = undefined;
    
    // Lote H+I: Capturar draft_id (prioridade: body > query)
    const draftId = draft_id || req.query.draft_id;
    
    // Logs para dev/staging
    if (process.env.NODE_ENV !== 'production') {
      const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      console.log('[Checkout] Request:', {
        plan,
        period,
        cta_variant,
        tenant: tenant.id,
        variant,
        extraSeats,
        beneficiaryEmail,
        draftId,
        clientIP,
        userAgent: req.headers['user-agent'],
        utm: Object.values(utm).some(Boolean) ? utm : 'none'
      });
    }
    
    const { mainPriceId } = getPriceIds({ tenant, plan, period, variant });
    const addonPriceId = extraSeats > 0 ? getAddonPriceId({ tenant, period }) : null;

    if (!mainPriceId) {
      console.error('[stripe] Price ID ausente:', { plan, period, variant, tenant: tenant.id });
      return res.status(500).json({
        error: "Price ID ausente nas ENVs", 
        message: "Preço não configurado. Entre em contato com o suporte." 
      });
    }

    if (extraSeats > 0 && !addonPriceId) {
      return res.status(400).json({
        error: "Addon price not configured",
        message: "Preço adicional não configurado. Entre em contato com o suporte."
      });
    }

    // URLs de retorno com validação de segurança
    const successUrl = buildSuccessUrl();
    const cancelUrl = buildCancelUrl();
    validateReturnUrls(successUrl, cancelUrl);
    
    // Gerar client_reference_id único
    const client_reference_id = `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Construir metadata com UTMs, tenant e draft_id
    const metadata = {
      ...buildCheckoutMetadata({
        plan,
        period,
        variant,
        extraSeats,
        beneficiaryEmail,
        tenant: tenant.id,
        email,
        phone,
        name,
        cta_variant,
        source: draft_id ? 'lp_b2b' : 'pricing',
        ...formattedUtm
      }),
      ...(draftId ? { draft_id: String(draftId) } : {})
    };
    
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        { price: mainPriceId, quantity: 1 },
        ...(addonPriceId && extraSeats > 0 ? [{ price: addonPriceId, quantity: extraSeats }] : [])
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: false,
      client_reference_id,
      metadata,
    });
    
    // Log de sucesso
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Checkout] Session created:', {
        sessionId: session.id,
        plan,
        period,
        client_reference_id
      });
    }
    
    return res.status(200).json({ id: session.id, url: session.url });
    
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    
    // Tratar diferentes tipos de erro do Stripe
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: "Invalid request", 
        message: "Dados inválidos. Verifique as informações e tente novamente." 
      });
    }
    
    if (error.type === 'StripeAPIError') {
      return res.status(503).json({ 
        error: "Service unavailable", 
        message: "Serviço temporariamente indisponível. Tente novamente em alguns minutos." 
      });
    }
    
    return res.status(500).json({ 
      error: "Internal error", 
      message: "Erro interno. Entre em contato com o suporte se o problema persistir." 
    });
  }
}

export default withRateLimit(handler, { limit: 10, windowSec: 60 });
