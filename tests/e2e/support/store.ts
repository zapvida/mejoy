import crypto from 'node:crypto';

import type { APIRequestContext, Page } from '@playwright/test';

import { baseURL } from './env';
import { expect } from './test';

export type CheckoutIdentity = {
  name: string;
  email: string;
  phone: string;
  cpf: string;
};

export type CheckoutAddress = {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
};

export const DEFAULT_IDENTITY: CheckoutIdentity = {
  name: 'Playwright MeJoy',
  email: 'playwright@mejoy.local',
  phone: '11999998888',
  cpf: '52998224725',
};

export const DEFAULT_ADDRESS: CheckoutAddress = {
  cep: '01310100',
  street: 'Avenida Paulista',
  number: '1000',
  complement: 'Sala 1',
  district: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
};

export function createSessionId() {
  return crypto.randomUUID();
}

export async function attachStoreSession(page: Page, sessionId: string) {
  const origin = new URL(baseURL).origin;

  await page.context().addCookies([
    {
      name: 'store_v2_session',
      value: sessionId,
      url: origin,
    },
  ]);
}

export async function resolveSampleProductSlug(request: APIRequestContext) {
  const response = await request.get('/api/store-v2/catalog/sample-slug');
  expect(response.ok()).toBeTruthy();
  const payload = (await response.json()) as { slug?: string | null };
  expect(payload.slug, 'Sample product slug should be available for Store V2 smoke tests.').toBeTruthy();
  return payload.slug as string;
}

export async function seedCart(
  request: APIRequestContext,
  sessionId: string,
  options?: { quantity?: number; productSlug?: string },
) {
  const productSlug = options?.productSlug ?? (await resolveSampleProductSlug(request));
  const quantity = options?.quantity ?? 1;
  const headers = {
    'Content-Type': 'application/json',
    'X-Session-Id': sessionId,
  };

  const addResponse = await request.post('/api/store-v2/cart', {
    headers,
    data: {
      productSlug,
      quantity,
    },
  });
  expect(addResponse.ok()).toBeTruthy();

  const cartResponse = await request.get('/api/store-v2/cart', { headers });
  expect(cartResponse.ok()).toBeTruthy();
  const cart = (await cartResponse.json()) as {
    cartId: string;
    itemCount: number;
    items: Array<{ product?: { slug?: string } }>;
  };

  expect(cart.cartId).toBeTruthy();
  expect(cart.itemCount).toBeGreaterThan(0);

  return {
    cartId: cart.cartId,
    sessionId,
    productSlug,
    itemCount: cart.itemCount,
  };
}

export async function openCheckoutWithSeededCart(
  page: Page,
  request: APIRequestContext,
  options?: { quantity?: number; productSlug?: string; sessionId?: string },
) {
  const sessionId = options?.sessionId ?? createSessionId();
  await attachStoreSession(page, sessionId);
  const cart = await seedCart(request, sessionId, options);
  await page.goto(`/checkout?cartId=${cart.cartId}`);
  await expect(page.getByText(/Carrinho vazio/i)).toHaveCount(0);
  return cart;
}

export async function fillCheckoutStepOne(
  page: Page,
  options?: {
    identity?: Partial<CheckoutIdentity>;
    address?: Partial<CheckoutAddress>;
  },
) {
  const identity = { ...DEFAULT_IDENTITY, ...(options?.identity ?? {}) };
  const address = { ...DEFAULT_ADDRESS, ...(options?.address ?? {}) };

  await page.getByPlaceholder('Nome completo').fill(identity.name);
  await page.getByPlaceholder('E-mail').fill(identity.email);
  await page.getByPlaceholder(/\(11\) 99999-9999/).fill(identity.phone);
  await page.getByPlaceholder('CPF (opcional)').fill(identity.cpf);

  const cepInput = page.getByPlaceholder('CEP');
  await cepInput.fill(address.cep);
  await cepInput.blur();

  await page.getByPlaceholder('Rua').fill(address.street);
  await page.getByPlaceholder('Número').fill(address.number);
  if (address.complement) {
    await page.getByPlaceholder('Complemento (opcional)').fill(address.complement);
  }
  await page.getByPlaceholder('Bairro').fill(address.district);
  await page.getByPlaceholder('Cidade').fill(address.city);
  await page.getByPlaceholder('UF').fill(address.state);

  const continueButton = page.getByRole('button', { name: /Continuar para Pagamento/i }).first();
  await expect(continueButton).toBeEnabled({ timeout: 15_000 });
  await continueButton.click();
}

export async function submitPixCheckout(page: Page) {
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/store-v2/create-payment') &&
      response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: /Gerar PIX do Pedido/i }).click();
  const response = await responsePromise;
  const payload = await response.json();
  return { response, payload };
}

export async function submitCreditCardCheckout(page: Page, card: {
  holderName: string;
  number: string;
  expiry: string;
  cvv: string;
}) {
  await page.getByRole('button', { name: /Cartão de Crédito/i }).click();
  await page.getByLabel('Nome no cartão').fill(card.holderName);
  await page.getByLabel('Número do cartão').fill(card.number);
  await page.getByLabel('Validade').fill(card.expiry);
  await page.getByLabel('CVV').fill(card.cvv);

  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/store-v2/create-payment') &&
      response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: /Confirmar Pedido/i }).click();
  const response = await responsePromise;
  const payload = await response.json().catch(() => null);
  return { response, payload };
}
