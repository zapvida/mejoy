import type { NextApiRequest, NextApiResponse } from 'next';

import { getProfileFromRequest, getUserEmailFromRequest } from '@/lib/api/auth-helper';
import { methodNotAllowed } from '@/lib/mobile/http';
import { getEntitlementSnapshot } from '@/lib/mobile/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    const email = await getUserEmailFromRequest(req);
    const profile = await getProfileFromRequest(req);
    const entitlements = await getEntitlementSnapshot({ email, profile });
    return res.status(200).json(entitlements);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Falha ao montar entitlements mobile',
    });
  }
}
