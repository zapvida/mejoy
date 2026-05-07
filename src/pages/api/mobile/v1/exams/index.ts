import type { NextApiRequest, NextApiResponse } from 'next';

import { getProfileFromRequest, getUserEmailFromRequest } from '@/lib/api/auth-helper';
import { methodNotAllowed } from '@/lib/mobile/http';
import { listExams, resolveMobileActor } from '@/lib/mobile/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    const email = await getUserEmailFromRequest(req);
    const profile = await getProfileFromRequest(req);
    const actor = await resolveMobileActor({ email, profile });

    if (!actor.actorId) {
      return res.status(401).json({ error: 'AUTH_REQUIRED' });
    }

    const response = await listExams({ actorId: actor.actorId });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Erro ao listar exames',
    });
  }
}
