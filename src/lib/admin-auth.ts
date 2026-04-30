import type { NextApiRequest } from 'next';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'admin-secret-key';

export function validateAdminRequest(req: NextApiRequest): boolean {
  const auth = req.headers.authorization || req.query.secret;
  const secret = typeof auth === 'string' ? auth.replace(/^Bearer\s+/i, '') : req.body?.secret;
  return secret === ADMIN_SECRET;
}

export function requireAdmin(req: NextApiRequest, res: { status: (c: number) => { json: (o: object) => void } }) {
  if (!validateAdminRequest(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
