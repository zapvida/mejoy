import type { Tenant } from '@/lib/tenancy/tenant';
import { getPriceIds as resolveTenantPriceIds, getAddonPriceId as resolveTenantAddonPriceId } from '@/lib/tenancy/tenant';

export type CheckoutVariant = 'standard' | 'gift';

export interface CheckoutPayload {
  plan: 'plus';
  period: 'monthly' | 'yearly';
  variant?: CheckoutVariant;
  extraSeats?: number;
  beneficiaryEmail?: string;
  cta_variant?: string;
  source?: string;
}

export interface UTM {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  ref?: string;
}

const clampExtraSeats = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(10, Math.floor(value)));
};

export function buildCheckoutMetadata(
  input: CheckoutPayload &
    { tenant: string } &
    UTM &
    { email?: string; phone?: string; name?: string }
): Record<string, string> {
  const metadata: Record<string, string> = {
    tenant: input.tenant,
    plan: input.plan,
    period: input.period,
    variant: (input.variant ?? 'standard'),
    source: input.source ?? 'pricing',
    cta_variant: input.cta_variant ?? 'default',
  };

  const extraSeats = clampExtraSeats(input.extraSeats);
  if (extraSeats > 0) metadata.extraSeats = String(extraSeats);

  const beneficiaryEmail = input.beneficiaryEmail?.trim();
  if (input.variant === 'gift' && beneficiaryEmail) {
    metadata.beneficiaryEmail = beneficiaryEmail;
  }

  if (input.email) metadata.email = input.email;
  if (input.phone) metadata.phone = input.phone;
  if (input.name) metadata.name = input.name;

  if (input.utm_source) metadata.utm_source = input.utm_source;
  if (input.utm_medium) metadata.utm_medium = input.utm_medium;
  if (input.utm_campaign) metadata.utm_campaign = input.utm_campaign;
  if (input.utm_content) metadata.utm_content = input.utm_content;
  if (input.utm_term) metadata.utm_term = input.utm_term;
  if (input.gclid) metadata.gclid = input.gclid;
  if (input.fbclid) metadata.fbclid = input.fbclid;
  if (input.ref) metadata.ref = input.ref;

  return metadata;
}

export function getPriceIds(args: {
  tenant: Tenant;
  plan: CheckoutPayload['plan'];
  period: CheckoutPayload['period'];
  variant?: CheckoutVariant;
}): { mainPriceId: string } {
  return resolveTenantPriceIds(args);
}

export function getAddonPriceId(args: {
  tenant: Tenant;
  period: CheckoutPayload['period'];
}): string | null {
  return resolveTenantAddonPriceId(args);
}

export function extractContactFromMetadata(md: Record<string,string|number|boolean>|null|undefined) {
  const meta = (md ?? {}) as Record<string, any>;
  const email = meta.email as string | undefined;
  const phone = meta.phone as string | undefined;
  const name  = meta.name  as string | undefined;
  const utm: UTM = {
    utm_source: meta.utm_source, utm_medium: meta.utm_medium, utm_campaign: meta.utm_campaign,
    utm_content: meta.utm_content, utm_term: meta.utm_term, gclid: meta.gclid, fbclid: meta.fbclid, ref: meta.ref
  };
  return { email, phone, name, utm };
}
