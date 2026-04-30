import type { NextApiRequest, NextApiResponse } from 'next';
import { searchProductsIntelligent } from '@/lib/store-v2/search-intelligent';
import { getCopyV4BySku } from '@/lib/store-v2/copy-v2';
import { isCopyV4Enabled } from '@/lib/flags';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

function isDataStoreUnavailable(err: unknown): boolean {
  const msg = getErrorMessage(err).toLowerCase();
  return (
    msg.includes('denied access') ||
    msg.includes("can't reach database") ||
    msg.includes('prismaclientinitializationerror') ||
    msg.includes('p1000') ||
    msg.includes('p1001') ||
    msg.includes('p1010')
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const q = (req.query.q as string) ?? '';
  if (!q || q.length < 2) {
    return res.status(200).json({ results: [] });
  }

  try {
    let results = await searchProductsIntelligent(q);
    if (isCopyV4Enabled()) {
      results = results.map((p) => {
        if (!p.sku) return p;
        const copy = getCopyV4BySku(p.sku);
        if (!copy?.shortBenefit && !copy?.hero_benefit) return p;
        return { ...p, shortBenefit: copy.shortBenefit || copy.hero_benefit || p.shortBenefit };
      });
    }
    return res.status(200).json({ results });
  } catch (err) {
    if (isDataStoreUnavailable(err)) {
      return res.status(200).json({ results: [], degraded: true });
    }
    return res.status(500).json({ results: [], error: getErrorMessage(err) });
  }
}
