/**
 * Health check catálogo Store V2
 * Slugs únicos, count ativos, count drafts, sample slug
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const started = Date.now();
  const storeV2Enabled = process.env.STORE_V2 === '1' || process.env.NEXT_PUBLIC_STORE_V2 === '1';

  if (!storeV2Enabled) {
    return res.status(200).json({
      ok: true,
      storeV2Enabled: false,
      message: 'Store V2 desabilitado',
      timestamp: new Date().toISOString(),
      timeMs: Date.now() - started,
    });
  }

  try {
    const [activeCount, draftCount, allSlugs, sample] = await Promise.all([
      prisma.product.count({ where: { status: 'active' } }),
      prisma.product.count({ where: { status: 'draft' } }),
      prisma.product.findMany({ select: { slug: true } }),
      prisma.product.findFirst({ where: { status: 'active' }, select: { slug: true, name: true } }),
    ]);

    const slugs = allSlugs.map((p) => p.slug);
    const uniqueCount = new Set(slugs).size;
    const slugsUnique = uniqueCount === slugs.length;

    return res.status(200).json({
      ok: slugsUnique,
      storeV2Enabled: true,
      slugsUnique,
      activeCount,
      draftCount,
      sampleSlug: sample?.slug ?? null,
      sampleName: sample?.name ?? null,
      timestamp: new Date().toISOString(),
      timeMs: Date.now() - started,
    });
  } catch (err) {
    return res.status(503).json({
      ok: false,
      storeV2Enabled: true,
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      timeMs: Date.now() - started,
    });
  }
}
