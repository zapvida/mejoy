import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductsBySlugs } from '@/lib/store-v2/catalog';
import { getCopyV4BySku } from '@/lib/store-v2/copy-v2';
import { isCopyV4Enabled } from '@/lib/flags';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const slugsParam = (req.query.slugs as string) ?? '';
  const slugs = slugsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!slugs.length) {
    return res.status(200).json({ products: [] });
  }

  try {
    let products = await getProductsBySlugs(slugs);
    if (isCopyV4Enabled()) {
      products = products.map((p) => {
        if (!p.sku) return p;
        const copy = getCopyV4BySku(p.sku);
        if (!copy?.shortBenefit && !copy?.hero_benefit) return p;
        return { ...p, shortBenefit: copy.shortBenefit || copy.hero_benefit || p.shortBenefit };
      });
    }
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ products: [], error: String(err) });
  }
}
