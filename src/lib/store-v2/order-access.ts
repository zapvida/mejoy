import crypto from 'crypto';
import { abs } from '@/lib/utils/url';

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 45;

type OrderAccessPayload = {
  v: 1;
  orderId: string;
  email: string;
  exp: number;
};

function base64urlEncode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64urlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function getOrderAccessSecret(): string | null {
  return (
    process.env.ORDER_ACCESS_TOKEN_SECRET ||
    process.env.ADMIN_SECRET_KEY ||
    (process.env.NODE_ENV !== 'production' ? 'local-mejoy-order-access-secret' : null)
  );
}

function sign(encodedPayload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

export function createOrderAccessToken(params: {
  orderId: string;
  customerEmail: string;
  ttlSeconds?: number;
}): string | null {
  const secret = getOrderAccessSecret();
  if (!secret) {
    return null;
  }

  const payload: OrderAccessPayload = {
    v: 1,
    orderId: params.orderId,
    email: params.customerEmail.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + (params.ttlSeconds ?? DEFAULT_TTL_SECONDS),
  };

  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifyOrderAccessToken(
  token: string | null | undefined,
  orderId: string
): { valid: true; payload: OrderAccessPayload } | { valid: false; reason: string } {
  if (!token) {
    return { valid: false, reason: 'missing_token' };
  }

  const secret = getOrderAccessSecret();
  if (!secret) {
    return { valid: false, reason: 'missing_secret' };
  }

  const [encodedPayload, providedSignature] = token.split('.');
  if (!encodedPayload || !providedSignature) {
    return { valid: false, reason: 'malformed_token' };
  }

  const expectedSignature = sign(encodedPayload, secret);
  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(providedSignature);

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return { valid: false, reason: 'invalid_signature' };
  }

  try {
    const payload = JSON.parse(base64urlDecode(encodedPayload)) as OrderAccessPayload;

    if (payload.v !== 1 || payload.orderId !== orderId) {
      return { valid: false, reason: 'invalid_payload' };
    }

    if (!payload.email || payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, reason: 'expired_token' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, reason: 'invalid_payload' };
  }
}

export function buildOrderAccessUrl(params: {
  orderId: string;
  customerEmail: string;
  ttlSeconds?: number;
}): string {
  const token = createOrderAccessToken(params);
  const basePath = `/pedidos/${params.orderId}`;
  return token ? abs(`${basePath}?access=${encodeURIComponent(token)}`) : abs(basePath);
}
