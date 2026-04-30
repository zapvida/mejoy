import Stripe from "stripe";

import { env } from "@/lib/env";

// TODO(backcompat-2025-10-23) - STRIPE_SECRET_KEY opcional
export const stripe = new Stripe((env as any).STRIPE_SECRET_KEY);

export async function getPriceIdByLookup(lookup_key: string) {
  const prices = await stripe.prices.list({ lookup_keys: [lookup_key], active: true, expand: ["data.product"] });
  if (prices.data[0]?.id) return prices.data[0].id;
  return null;
}
