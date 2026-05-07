import type { NextApiRequest, NextApiResponse } from 'next';

import { getProfileFromRequest, getUserEmailFromRequest } from '@/lib/api/auth-helper';
import { methodNotAllowed } from '@/lib/mobile/http';
import { getNotificationFeed } from '@/lib/mobile/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    const email = await getUserEmailFromRequest(req);
    const profile = await getProfileFromRequest(req);
    const response = await getNotificationFeed({ email, profile });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro ao montar notificações mobile',
    });
  }
}
