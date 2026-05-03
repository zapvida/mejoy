import type { NextApiRequest } from 'next';
import {
  createAdminSession,
  getAdminSessionUser,
  resolveAdminRole,
  verifyAdminSecret,
} from '@/lib/admin/session';

describe('admin session helpers', () => {
  const originalAllowed = process.env.ADMIN_ALLOWED_EMAILS;
  const originalAnalysts = process.env.ADMIN_ANALYST_EMAILS;
  const originalSecret = process.env.ADMIN_SECRET_KEY;
  const originalSessionSecret = process.env.ADMIN_SESSION_SECRET;

  beforeEach(() => {
    process.env.ADMIN_ALLOWED_EMAILS = 'admin@mejoy.com.br';
    process.env.ADMIN_ANALYST_EMAILS = 'analyst@mejoy.com.br';
    process.env.ADMIN_SECRET_KEY = 'super-secret';
    process.env.ADMIN_SESSION_SECRET = 'session-secret';
  });

  afterAll(() => {
    process.env.ADMIN_ALLOWED_EMAILS = originalAllowed;
    process.env.ADMIN_ANALYST_EMAILS = originalAnalysts;
    process.env.ADMIN_SECRET_KEY = originalSecret;
    process.env.ADMIN_SESSION_SECRET = originalSessionSecret;
  });

  it('resolves RBAC roles from configured email lists', () => {
    expect(resolveAdminRole('admin@mejoy.com.br')).toBe('admin');
    expect(resolveAdminRole('analyst@mejoy.com.br')).toBe('analyst');
    expect(resolveAdminRole('client@mejoy.com.br')).toBeNull();
  });

  it('verifies admin secret server-side only', () => {
    expect(verifyAdminSecret('super-secret')).toBe(true);
    expect(verifyAdminSecret('wrong-secret')).toBe(false);
  });

  it('creates a cookie-backed admin session and reads the user from request', () => {
    const token = createAdminSession('admin@mejoy.com.br');
    expect(token).toBeTruthy();

    const req = {
      headers: {
        cookie: `mejoy_admin_session=${token}`,
      },
    } as NextApiRequest;

    expect(getAdminSessionUser(req)).toEqual(
      expect.objectContaining({
        email: 'admin@mejoy.com.br',
        role: 'admin',
      })
    );
  });
});
