import crypto from 'crypto';

type ShareTokenPayload = {
  bundleId: string;
  exp: string;
};

function getShareBundleSecret() {
  return process.env.MOBILE_SHARE_BUNDLE_SECRET || process.env.HANDOFF_TOKEN_SECRET || 'mejoy-mobile-share-dev-secret';
}

function toBase64Url(input: string) {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function fromBase64Url(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

export function signShareBundleToken(payload: ShareTokenPayload) {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', getShareBundleSecret()).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifyShareBundleToken(token: string, expectedBundleId: string) {
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    return { valid: false, reason: 'TOKEN_FORMAT' as const };
  }

  const expectedSignature = crypto
    .createHmac('sha256', getShareBundleSecret())
    .update(encodedPayload)
    .digest('base64url');

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return { valid: false, reason: 'TOKEN_SIGNATURE' as const };
  }

  try {
    const parsed = JSON.parse(fromBase64Url(encodedPayload)) as ShareTokenPayload;
    if (parsed.bundleId !== expectedBundleId) {
      return { valid: false, reason: 'TOKEN_BUNDLE_MISMATCH' as const };
    }

    const expiresAt = new Date(parsed.exp).getTime();
    if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
      return { valid: false, reason: 'TOKEN_EXPIRED' as const };
    }

    return { valid: true, payload: parsed };
  } catch {
    return { valid: false, reason: 'TOKEN_PAYLOAD' as const };
  }
}
