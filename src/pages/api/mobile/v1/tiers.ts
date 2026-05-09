import type { NextApiRequest, NextApiResponse } from 'next';

import { getProfileFromRequest, getUserEmailFromRequest } from '@/lib/api/auth-helper';
import { methodNotAllowed } from '@/lib/mobile/http';
import { getTierDetails } from '@/lib/mobile/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    const email = await getUserEmailFromRequest(req);
    const profile = await getProfileFromRequest(req);
    const response = await getTierDetails({ email, profile });
    return res.status(200).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar tier';
    return res.status(400).json({ error: message });
  }
}
