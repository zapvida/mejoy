import type { NextApiRequest, NextApiResponse } from 'next';

import { getProfileFromRequest, getUserEmailFromRequest } from '@/lib/api/auth-helper';
import { methodNotAllowed } from '@/lib/mobile/http';
import { getJourney } from '@/lib/mobile/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    const email = await getUserEmailFromRequest(req);
    const profile = await getProfileFromRequest(req);
    const response = await getJourney({ email, profile });
    return res.status(200).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar jornada';
    return res.status(message === 'AUTH_REQUIRED' ? 401 : 400).json({ error: message });
  }
}
