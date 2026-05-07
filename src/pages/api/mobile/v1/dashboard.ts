import type { NextApiRequest, NextApiResponse } from 'next';

import { getProfileFromRequest, getUserEmailFromRequest } from '@/lib/api/auth-helper';
import { buildMobileDashboard } from '@/lib/mobile/service';
import { methodNotAllowed } from '@/lib/mobile/http';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    const email = await getUserEmailFromRequest(req);
    const profile = await getProfileFromRequest(req);
    const dashboard = await buildMobileDashboard({ email, profile });
    return res.status(200).json(dashboard);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Falha ao montar dashboard mobile',
    });
  }
}
