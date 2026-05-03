import type { NextApiRequest, NextApiResponse } from 'next';
import { getProfileFromRequest, getUserEmailFromRequest } from '@/lib/api/auth-helper';
import { buildMeDashboard } from '@/lib/dashboard/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const email = await getUserEmailFromRequest(req);
    if (!email) {
      return res.status(401).json({ error: 'AUTH_REQUIRED' });
    }

    const profile = await getProfileFromRequest(req);
    const dashboard = await buildMeDashboard({ email, profile });

    return res.status(200).json(dashboard);
  } catch (error) {
    return res.status(500).json({
      error: (error as Error).message || 'Erro ao montar dashboard do cliente',
    });
  }
}
