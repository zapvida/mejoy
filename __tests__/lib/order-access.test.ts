import {
  buildOrderAccessUrl,
  createOrderAccessToken,
  verifyOrderAccessToken,
} from '@/lib/store-v2/order-access';

describe('order access token', () => {
  const originalSecret = process.env.ORDER_ACCESS_TOKEN_SECRET;
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    process.env.ORDER_ACCESS_TOKEN_SECRET = 'test-order-secret';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.mejoy.com.br';
  });

  afterAll(() => {
    process.env.ORDER_ACCESS_TOKEN_SECRET = originalSecret;
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  });

  it('creates and validates a signed token for the expected order', () => {
    const token = createOrderAccessToken({
      orderId: 'ord_123',
      customerEmail: 'cliente@mejoy.com.br',
      ttlSeconds: 300,
    });

    expect(token).toBeTruthy();
    expect(verifyOrderAccessToken(token, 'ord_123')).toEqual(
      expect.objectContaining({
        valid: true,
        payload: expect.objectContaining({
          orderId: 'ord_123',
          email: 'cliente@mejoy.com.br',
        }),
      })
    );
  });

  it('rejects token for another order id', () => {
    const token = createOrderAccessToken({
      orderId: 'ord_123',
      customerEmail: 'cliente@mejoy.com.br',
      ttlSeconds: 300,
    });

    expect(verifyOrderAccessToken(token, 'ord_456')).toEqual({
      valid: false,
      reason: 'invalid_payload',
    });
  });

  it('builds an order url with access token', () => {
    const url = buildOrderAccessUrl({
      orderId: 'ord_123',
      customerEmail: 'cliente@mejoy.com.br',
      ttlSeconds: 300,
    });

    expect(url).toContain('https://www.mejoy.com.br/pedidos/ord_123?access=');
  });
});
