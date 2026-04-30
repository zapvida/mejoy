/**
 * Health check Store V2
 * DB ok, count produtos, last order, versão/commit, status básico
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
    const [productCount, lastOrder] = await Promise.all([
      prisma.product.count(),
      prisma.order.findFirst({ orderBy: { createdAt: 'desc' }, select: { id: true, createdAt: true, status: true } }),
    ]);

    const version = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || process.env.npm_package_version || 'unknown';

    return res.status(200).json({
      ok: true,
      storeV2Enabled: true,
      db: 'ok',
      productCount,
      lastOrder: lastOrder
        ? { id: lastOrder.id, createdAt: lastOrder.createdAt, status: lastOrder.status }
        : null,
      version,
      timestamp: new Date().toISOString(),
      timeMs: Date.now() - started,
    });
  } catch (err) {
    return res.status(503).json({
      ok: false,
      storeV2Enabled: true,
      db: 'error',
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      timeMs: Date.now() - started,
    });
  }
}
