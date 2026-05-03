/**
 * Health check catálogo Store V2
 * Slugs únicos, count ativos, count drafts, sample slug
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getFallbackCatalogStats } from '@/lib/store-v2/catalog-fallback';
import { getRuntimeErrorMessage, isDataStoreUnavailable } from '@/lib/prisma/runtime-errors';

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
    if (isDataStoreUnavailable(err)) {
      const fallback = getFallbackCatalogStats();
      return res.status(200).json({
        ok: true,
        degraded: true,
        storeV2Enabled: true,
        slugsUnique: fallback.slugsUnique,
        activeCount: fallback.total,
        draftCount: 0,
        sampleSlug: fallback.sampleSlug,
        sampleName: fallback.sampleName,
        source: 'fallback_catalog',
        error: getRuntimeErrorMessage(err),
        timestamp: new Date().toISOString(),
        timeMs: Date.now() - started,
      });
    }

    return res.status(503).json({
      ok: false,
      storeV2Enabled: true,
      error: getRuntimeErrorMessage(err),
      timestamp: new Date().toISOString(),
      timeMs: Date.now() - started,
    });
  }
}
