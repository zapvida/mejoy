/**
 * API de preços ZapFarm
 * GET ?product=slug&variant=core|pro
 * Retorna preços em centavos para uso no checkout (SSR-safe; nunca expõe env no client)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductConfig } from '@/lib/zapfarm/product-loader';
import { getPricesForProduct, getBundlePriceCents } from '@/lib/zapfarm/price-resolver';
import { getBundleConfig } from '@/config/zapfarm/bundles';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const product = req.query.product as string;
  const variant = req.query.variant as string | undefined;
  const bundleId = req.query.bundle as string | undefined;
  const validVariant = variant === 'core' || variant === 'pro' ? variant : undefined;

  // Fluxo bundle: ?bundle=sono-ansiedade
  if (bundleId) {
    const config = getBundleConfig(bundleId);
    if (!config) {
      return res.status(404).json({ error: 'Bundle not found', bundleId });
    }
    const cents = getBundlePriceCents(bundleId);
    return res.status(200).json({
      product: null,
      bundleId,
      pricesCents: cents,
      priceReais: cents != null ? cents / 100 : null,
    });
  }

  if (!product) {
    return res.status(400).json({
      error: 'Missing product',
      message: 'Query param product=slug or bundle=id is required',
    });
  }

  const config = getProductConfig(product);
  if (!config) {
    return res.status(404).json({
      error: 'Product not found',
      product,
    });
  }

  try {
    const prices = getPricesForProduct(product, validVariant, true);
    return res.status(200).json({
      product,
      variant: validVariant ?? null,
      pricesCents: {
        basico: prices.basico,
        completo: prices.completo,
        premium: prices.premium,
      },
      source: prices.source,
      missing: prices.missing,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const missingMatch = message.match(/Preços ausentes para .+?: (.+)/);
    const missing = missingMatch ? missingMatch[1].split(', ') : [];
    return res.status(500).json({
      error: 'Price configuration missing',
      product,
      message,
      missing,
    });
  }
}
