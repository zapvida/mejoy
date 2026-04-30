import { warnMissingOptionalEnvs } from '@/lib/env';

warnMissingOptionalEnvs();

export type Tenant = {
  id: string;
  name: string;
  hostnameMatch: (host: string) => boolean;
  brand: {
    primary: string; // ex: "#16a34a"
    secondary: string;
    logoPath: string; // ex: `/tenants/zapfarm/logo.svg`
  };
  stripe: {
    prices: {
      plus: { monthly: string; yearly: string };
      gift: { monthly: string; yearly: string };
      addon: { monthly: string; yearly: string };
    };
  };
  ghl: {
    locationId: string;
    pipelineId: string;
    stage: { visit: string; triage: string; checkout: string; won: string };
  };
};

const SHARED_PRICES = {
  plus: {
    monthly: process.env.STRIPE_PRICE_PLUS_MONTHLY ?? '',
    yearly: process.env.STRIPE_PRICE_PLUS_YEARLY ?? ''
  },
  gift: {
    monthly: process.env.STRIPE_PRICE_GIFT_MONTHLY ?? '',
    yearly: process.env.STRIPE_PRICE_GIFT_YEARLY ?? ''
  },
  addon: {
    monthly: process.env.STRIPE_PRICE_ADDON_MONTHLY ?? '',
    yearly: process.env.STRIPE_PRICE_ADDON_YEARLY ?? ''
  }
} as const;

const ALL: Tenant[] = [
  {
    id: 'mejoy',
    name: 'Me Joy',
    hostnameMatch: (h) => /(^|\.)mejoy\.com\.br$/.test(h),
    brand: {
      primary: '#10b981',
      secondary: '#059669',
      logoPath: '/tenants/zapfarm/logo.svg'
    },
    stripe: {
      prices: SHARED_PRICES
    },
    ghl: {
      locationId: process.env.GHL_LOCATION_ID ?? '',
      pipelineId: process.env.GHL_PIPELINE_ID ?? '',
      stage: {
        visit:    process.env.GHL_STAGE_VISIT ?? '',
        triage:   process.env.GHL_STAGE_TRIAGE ?? '',
        checkout: process.env.GHL_STAGE_CHECKOUT ?? '',
        won:      process.env.GHL_STAGE_WON ?? ''
      }
    }
  },
  {
    id: 'zapfarm',
    name: 'Me Joy',
    hostnameMatch: (h) => /(^|\.)zapfarm\.com\.br$/.test(h) || /(^|\.)zapfarm\.com$/.test(h),
    brand: {
      primary: '#16a34a',
      secondary: '#065f46',
      logoPath: '/tenants/zapfarm/logo.svg'
    },
    stripe: {
      prices: SHARED_PRICES
    },
    ghl: {
      locationId: process.env.GHL_LOCATION_ID ?? '',
      pipelineId: process.env.GHL_PIPELINE_ID ?? '',
      stage: {
        visit:    process.env.GHL_STAGE_VISIT ?? '',
        triage:   process.env.GHL_STAGE_TRIAGE ?? '',
        checkout: process.env.GHL_STAGE_CHECKOUT ?? '',
        won:      process.env.GHL_STAGE_WON ?? ''
      }
    }
  },
];

export function detectTenantByHost(hostHeader?: string): Tenant {
  const host = (hostHeader || '').toLowerCase().trim();
  const t = ALL.find(tn => tn.hostnameMatch(host));
  if (t) return t;
  const fallback = ALL.find(tn => tn.id === (process.env.DEFAULT_TENANT || 'mejoy'));
  if (!fallback) throw new Error('No default tenant configured');
  return fallback;
}

export function getPriceIds(args: {
  tenant: Tenant;
  plan: 'plus';
  period: 'monthly' | 'yearly';
  variant?: 'standard' | 'gift';
}): { mainPriceId: string } {
  const variant = args.variant ?? 'standard';
  const prices = args.tenant.stripe.prices;
  const mainPriceId =
    variant === 'gift'
      ? prices.gift[args.period]
      : prices.plus[args.period];

  if (!mainPriceId) {
    throw new Error(`Stripe price not configured for ${args.tenant.id} (${variant}/${args.period})`);
  }

  return { mainPriceId };
}

export function getAddonPriceId(args: {
  tenant: Tenant;
  period: 'monthly' | 'yearly';
}): string | null {
  return args.tenant.stripe.prices.addon[args.period] || null;
}
