import type { NextApiRequest, NextApiResponse } from 'next';

import { logger } from '@/lib/log';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const report = req.body || {};
    logger.warn({ report }, 'csp_violation');
    return res.status(204).end();
  } catch {
    return res.status(204).end();
  }
}
