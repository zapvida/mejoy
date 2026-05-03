import type { NextApiRequest } from 'next';
import { allowLegacyAdminBearer, getAdminSessionUser, verifyAdminSecret } from '@/lib/admin/session';

export function validateAdminRequest(req: NextApiRequest): boolean {
  if (getAdminSessionUser(req)) {
    return true;
  }

  if (!allowLegacyAdminBearer()) {
    return false;
  }

  const auth = req.headers.authorization || req.query.secret;
  const secret = typeof auth === 'string' ? auth.replace(/^Bearer\s+/i, '') : req.body?.secret;
  return verifyAdminSecret(secret);
}

export function requireAdmin(req: NextApiRequest, res: { status: (c: number) => { json: (o: object) => void } }) {
  if (!validateAdminRequest(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
