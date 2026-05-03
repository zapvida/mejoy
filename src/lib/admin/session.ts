import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { AdminRole, AdminUser } from '@/lib/rbac';

export const ADMIN_SESSION_COOKIE = 'mejoy_admin_session';
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

type AdminSessionPayload = {
  v: 1;
  email: string;
  role: AdminRole;
  exp: number;
};

function base64urlEncode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64urlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function getSessionSecret(): string | null {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_SECRET_KEY ||
    (process.env.NODE_ENV !== 'production' ? 'local-mejoy-admin-session-secret' : null)
  );
}

function sign(encodedPayload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

function parseCookieHeader(header: string | undefined): Record<string, string> {
  if (!header) return {};

  return header.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawValue] = part.trim().split('=');
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rawValue.join('='));
    return acc;
  }, {});
}

function serializeCookie(name: string, value: string, maxAge: number): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }

  return parts.join('; ');
}

function getAdminEmailSets() {
  const adminEmails = new Set(
    (process.env.ADMIN_ALLOWED_EMAILS ||
      'admin@mejoy.com.br,admin@zapfarm.com.br')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  );

  const analystEmails = new Set(
    (process.env.ADMIN_ANALYST_EMAILS ||
      'analyst@mejoy.com.br,analyst@zapfarm.com.br')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  );

  return { adminEmails, analystEmails };
}

export function resolveAdminRole(email: string): AdminRole | null {
  const normalizedEmail = email.trim().toLowerCase();
  const { adminEmails, analystEmails } = getAdminEmailSets();

  if (adminEmails.has(normalizedEmail)) return 'admin';
  if (analystEmails.has(normalizedEmail)) return 'analyst';

  return null;
}

export function verifyAdminSecret(secret: string | null | undefined): boolean {
  const expected = process.env.ADMIN_SECRET_KEY;
  if (!expected) {
    return process.env.NODE_ENV !== 'production' && secret === 'admin-secret-key';
  }

  return secret === expected;
}

export function createAdminSession(email: string): string | null {
  const role = resolveAdminRole(email);
  const secret = getSessionSecret();
  if (!role || !secret) {
    return null;
  }

  const payload: AdminSessionPayload = {
    v: 1,
    email: email.trim().toLowerCase(),
    role,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
  };

  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

function decodeAdminSession(token: string | null | undefined): AdminSessionPayload | null {
  if (!token) return null;

  const secret = getSessionSecret();
  if (!secret) return null;

  const [encodedPayload, providedSignature] = token.split('.');
  if (!encodedPayload || !providedSignature) return null;

  const expectedSignature = sign(encodedPayload, secret);
  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(providedSignature);

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(base64urlDecode(encodedPayload)) as AdminSessionPayload;
    if (payload.v !== 1 || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    if (!resolveAdminRole(payload.email) || resolveAdminRole(payload.email) !== payload.role) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getAdminSessionUser(req: NextApiRequest): AdminUser | null {
  const cookies = parseCookieHeader(req.headers.cookie);
  const payload = decodeAdminSession(cookies[ADMIN_SESSION_COOKIE]);
  if (!payload) return null;

  return {
    id: payload.email,
    email: payload.email,
    role: payload.role,
    has2FA: true,
  };
}

export function allowLegacyAdminBearer(): boolean {
  return process.env.ALLOW_LEGACY_ADMIN_BEARER === '1' || process.env.NODE_ENV !== 'production';
}

export function setAdminSessionCookie(res: NextApiResponse, token: string) {
  res.setHeader('Set-Cookie', serializeCookie(ADMIN_SESSION_COOKIE, token, ADMIN_SESSION_TTL_SECONDS));
}

export function clearAdminSessionCookie(res: NextApiResponse) {
  res.setHeader('Set-Cookie', serializeCookie(ADMIN_SESSION_COOKIE, '', 0));
}
