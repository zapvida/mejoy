import type { NextApiRequest, NextApiResponse } from 'next';

import { logger } from '@/lib/log';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    logger.warn({ nel: req.body }, 'network_error_logged');
  } catch {}
  res.status(204).end();
}
