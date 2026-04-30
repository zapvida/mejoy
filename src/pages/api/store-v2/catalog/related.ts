import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductBySlug, getRelatedProducts } from '@/lib/store-v2/catalog';
import { getCopyV4BySku } from '@/lib/store-v2/copy-v2';
import { isCopyV4Enabled } from '@/lib/flags';

/**
 * GET /api/store-v2/catalog/related?slug=X&limit=N
 * Retorna produtos relacionados (mesmo objective) para upsell no carrinho.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const slug = typeof req.query.slug === 'string' ? req.query.slug : null;
  const limit = Math.min(8, Math.max(1, parseInt(String(req.query.limit || '6'), 10)));

  if (!slug) {
    return res.status(400).json({ error: 'slug obrigatório', products: [] });
  }

  try {
    const product = await getProductBySlug(slug, false);
    if (!product || !product.objective) {
      return res.status(200).json({ products: [] });
    }

    let products = await getRelatedProducts(product.objective, slug, limit);
    if (isCopyV4Enabled()) {
      products = products.map((p) => {
        if (!p.sku) return p;
        const copy = getCopyV4BySku(p.sku);
        if (!copy?.shortBenefit && !copy?.hero_benefit) return p;
        return { ...p, shortBenefit: copy.shortBenefit || copy.hero_benefit || p.shortBenefit };
      });
    }
    return res.status(200).json({
      products: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        shortBenefit: p.shortBenefit,
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents,
        image: p.image,
        formDisplay: p.formDisplay,
      })),
    });
  } catch (err) {
    console.error('[catalog/related]', err);
    return res.status(500).json({ products: [], error: String(err) });
  }
}
