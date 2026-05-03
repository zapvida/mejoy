import type { NextApiRequest, NextApiResponse } from 'next';
import { buildAdminDashboard } from '@/lib/dashboard/service';
import { ensureRole, UnauthorizedError } from '@/lib/rbac';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    ensureRole(req, ['admin', 'analyst']);
    const dashboard = await buildAdminDashboard(req.query.period as string | undefined);
    return res.status(200).json(dashboard);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({
      error: (error as Error).message || 'Erro ao montar dashboard admin',
    });
  }
}
