import type { NextApiRequest, NextApiResponse } from 'next';
import { buildAdminCustomerView } from '@/lib/dashboard/service';
import { ensureRole, UnauthorizedError } from '@/lib/rbac';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const profileId = req.query.id as string;
  if (!profileId) {
    return res.status(400).json({ error: 'id obrigatório' });
  }

  try {
    ensureRole(req, ['admin', 'analyst']);
    const payload = await buildAdminCustomerView(profileId);
    return res.status(200).json(payload);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }

    const message = (error as Error).message || 'Erro ao carregar visão 360 do cliente';
    const status = message === 'Perfil não encontrado' ? 404 : 500;
    return res.status(status).json({ error: message });
  }
}
