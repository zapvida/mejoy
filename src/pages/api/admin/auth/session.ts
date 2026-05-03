import type { NextApiRequest, NextApiResponse } from 'next';
import {
  clearAdminSessionCookie,
  createAdminSession,
  getAdminSessionUser,
  resolveAdminRole,
  setAdminSessionCookie,
  verifyAdminSecret,
} from '@/lib/admin/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const user = getAdminSessionUser(req);
    if (!user) {
      return res.status(401).json({ authenticated: false, error: 'Sessão admin ausente' });
    }

    return res.status(200).json({
      authenticated: true,
      user,
    });
  }

  if (req.method === 'POST') {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const secret = String(req.body?.secret || '');

    if (!email || !secret) {
      return res.status(400).json({ error: 'email e secret são obrigatórios' });
    }

    if (!verifyAdminSecret(secret)) {
      return res.status(401).json({ error: 'Credencial admin inválida' });
    }

    if (!resolveAdminRole(email)) {
      return res.status(403).json({ error: 'Email sem role administrativa configurada' });
    }

    const token = createAdminSession(email);
    if (!token) {
      return res.status(500).json({ error: 'Não foi possível criar a sessão admin' });
    }

    setAdminSessionCookie(res, token);

    return res.status(200).json({
      authenticated: true,
      user: getAdminSessionUser({
        ...req,
        headers: {
          ...req.headers,
          cookie: `mejoy_admin_session=${token}`,
        },
      } as NextApiRequest),
    });
  }

  if (req.method === 'DELETE') {
    clearAdminSessionCookie(res);
    return res.status(200).json({ authenticated: false });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
