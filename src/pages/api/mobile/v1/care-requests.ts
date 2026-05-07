import type { NextApiRequest, NextApiResponse } from 'next';

import { getProfileFromRequest, getUserEmailFromRequest } from '@/lib/api/auth-helper';
import { methodNotAllowed } from '@/lib/mobile/http';
import { createCareRequest, resolveMobileActor } from '@/lib/mobile/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  try {
    const email = await getUserEmailFromRequest(req);
    const profile = await getProfileFromRequest(req);
    const actor = await resolveMobileActor({ email, profile });

    if (!actor.actorId) {
      return res.status(401).json({ error: 'AUTH_REQUIRED' });
    }

    const response = await createCareRequest({
      actor,
      input: req.body,
    });

    return res.status(200).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao solicitar consulta';
    const status = message === 'AUTH_REQUIRED' ? 401 : 400;
    return res.status(status).json({ error: message });
  }
}
