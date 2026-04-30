import type { NextApiRequest, NextApiResponse } from 'next';

import { logger } from '@/lib/log';
import { withRateLimit } from '@/pages/api/_utils/withRateLimit';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    if (process.env.NODE_ENV !== 'production') {
      // Evita loops: log resumido
      console.log('[WEB_VITALS]', { name: req.body?.name, value: req.body?.value });
    }
    return res.status(202).json({ ok: true });
  } catch (e: any) {
    logger.error({ err: e?.message }, 'web_vitals_error');
    return res.status(200).json({ ok: true });
  }
}

export default withRateLimit(handler, { limit: 120, windowSec: 60 });