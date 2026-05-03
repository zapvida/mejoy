import type { NextApiRequest, NextApiResponse } from 'next';
import { getSampleProductSlug } from '@/lib/store-v2/catalog';
import { getFallbackSampleSlug } from '@/lib/store-v2/catalog-fallback';

/**
 * GET /api/store-v2/catalog/sample-slug
 * Retorna um slug real do banco para o script de validação.
 * Evita falso positivo 404 quando o script usava slug hardcoded diferente do catálogo.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const slug = await getSampleProductSlug();
    return res.status(200).json({ slug });
  } catch (err) {
    return res.status(200).json({
      slug: getFallbackSampleSlug(),
      degraded: true,
      error: String(err),
    });
  }
}
