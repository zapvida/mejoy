import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { logger } from '@/lib/log';
import { checkRate } from '@/lib/security/rate-limit';

export function withRateLimit(handler: NextApiHandler, opts?: { limit?: number; windowSec?: number; keyFn?: (_req: NextApiRequest)=>string }) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || (req.socket as any)?.remoteAddress
      || 'unknown';
    const key = (opts?.keyFn?.(req)) || `rl:${req.url}:${ip}`;
    const rate = await checkRate(key, opts?.limit ?? 60, opts?.windowSec ?? 60);
    if (!rate.ok) {
      const retry = (rate as any).retryAfterSec ?? 60; // compat
      res.setHeader('Retry-After', String(retry));
      logger.warn({ path: req.url, ip }, 'rate_limited');
      return res.status(429).json({ ok: false, error: 'rate_limited' });
    }
    return handler(req, res);
  };
}
