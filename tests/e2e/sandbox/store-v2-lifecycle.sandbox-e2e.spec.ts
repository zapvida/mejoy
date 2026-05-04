import { loginAdmin, loginCustomer } from '../support/auth';
import { adminUser, hasEnv, isExternalBaseURL, sandboxCard, sandboxUser, webhookToken } from '../support/env';
import {
  fillCheckoutStepOne,
  openCheckoutWithSeededCart,
  submitCreditCardCheckout,
  submitPixCheckout,
} from '../support/store';
import { createEmagrecimentoReportViaApi } from '../support/triage';
import { expect, test } from '../support/test';

async function postSandboxWebhook(request: any, payload: Record<string, unknown>) {
  const response = await request.post('/api/webhooks/asaas', {
    headers: {
      'Content-Type': 'application/json',
      ...(webhookToken ? { 'x-asaas-webhook-token': webhookToken } : {}),
    },
    data: payload,
  });

  expect(response.ok()).toBeTruthy();
  return response.json();
}

async function waitForOrderStatus(
  request: any,
  orderId: string,
  expectedStatus: string,
) {
  for (let attempt = 0; attempt < 15; attempt += 1) {
    const response = await request.get(`/api/admin/store-v2/orders/${encodeURIComponent(orderId)}`);
    if (response.ok()) {
      const payload = await response.json();
      if (payload.status === expectedStatus) {
        return payload;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }

  throw new Error(`Order ${orderId} did not reach status ${expectedStatus}.`);
}

test.describe.serial('MeJoy sandbox lifecycle @sandbox-e2e', () => {
  test('arrival, report, PIX checkout, webhook idempotency and order follow-up complete end to end', async ({
    page,
    request,
  }) => {
    test.skip(!isExternalBaseURL, 'Sandbox lifecycle only runs against a deployed sandbox environment.');
    test.skip(
      !hasEnv([
        'SANDBOX_URL',
        'E2E_SANDBOX_USER_EMAIL',
        'E2E_SANDBOX_USER_PASSWORD',
        'E2E_ADMIN_EMAIL',
        'E2E_ADMIN_SECRET',
      ]),
      'Sandbox customer and admin credentials are required.',
    );

    await page.goto('/');
    await expect(page.locator('body')).toContainText(/Me Joy|MeJoy/i);

    const report = await createEmagrecimentoReportViaApi(request, {
      primeiro_nome: 'Sandbox',
      whatsapp: '11999990000',
    });

    await page.goto(report.reportPath);
    await expect(
      page.getByText('Seu programa pode ser fechado agora, nesta mesma pagina').first(),
    ).toBeVisible();

    await openCheckoutWithSeededCart(page, request);
    const identity = {
      name: `Sandbox Playwright ${Date.now()}`,
      email: sandboxUser.email,
      phone: '11999990000',
      cpf: '52998224725',
    };

    await fillCheckoutStepOne(page, { identity });
    const { response, payload } = await submitPixCheckout(page);
    expect(response.ok()).toBeTruthy();
    expect(payload.status).toBe('success');
    expect(payload.orderId).toBeTruthy();
    expect(payload.paymentId).toBeTruthy();

    const webhookPayload = {
      event: 'PAYMENT_CONFIRMED',
      payment: {
        id: payload.paymentId,
        status: 'CONFIRMED',
        value: payload.payment?.value ?? 99,
        billingType: 'PIX',
        paymentDate: new Date().toISOString(),
        metadata: {
          tipo: 'store_v2',
          customer_email: identity.email,
          customer_phone: identity.phone,
        },
      },
    };

    const firstWebhook = await postSandboxWebhook(request, webhookPayload);
    expect(firstWebhook.received).toBe(true);

    await loginAdmin(page, adminUser);
    await page.goto('/admin/store-v2/orders');
    await expect(page.getByText('Pedidos Loja (Store V2)')).toBeVisible();

    const paidOrder = await waitForOrderStatus(page.request, payload.orderId, 'PAID');
    const customerAccessUrl = paidOrder.customerAccessUrl as string;

    const repeatedWebhook = await postSandboxWebhook(request, webhookPayload);
    expect(repeatedWebhook.idempotent).toBe(true);

    const statusSelect = page.locator('label:has-text("Status") + select');
    const trackingCodeInput = page.locator('label:has-text("Código rastreio") + input');
    const trackingUrlInput = page.locator('label:has-text("URL rastreio") + input');

    await page.getByPlaceholder('Buscar por email, nome ou telefone').fill(identity.email);
    await page.getByRole('button', { name: 'Buscar' }).click();
    await page.getByRole('link', { name: new RegExp(payload.orderId.slice(-8), 'i') }).click();

    await statusSelect.selectOption('PREPARING');
    await page.getByRole('button', { name: 'Atualizar status' }).click();
    await statusSelect.selectOption('SHIPPED');
    await page.getByRole('button', { name: 'Atualizar status' }).click();
    await trackingCodeInput.fill('BR123456789MEJOY');
    await trackingUrlInput.fill('https://rastreamento.test/mejoy');
    await page.getByRole('button', { name: 'Salvar rastreio' }).click();
    await statusSelect.selectOption('DELIVERED');
    await page.getByRole('button', { name: 'Atualizar status' }).click();

    await page.goto(customerAccessUrl);
    await expect(page.locator('body')).toContainText(/Status atual: Entregue|Status atual: DELIVERED/i);
    await expect(page.locator('body')).toContainText(/Código: BR123456789MEJOY/i);

    await loginCustomer(page, sandboxUser);
    await expect(page.locator('body')).toContainText(new RegExp(`Pedido #${payload.orderId.slice(-8)}`, 'i'));
    await page.goto(`/pedidos/${encodeURIComponent(payload.orderId)}`);
    await expect(page.locator('body')).toContainText(/Status atual: Entregue|Status atual: DELIVERED/i);
    await expect(page.locator('body')).toContainText(/Rastreamento/i);
  });

  test('invalid CPF and CEP block checkout, and credit-card path can fail before retrying', async ({
    page,
    request,
    guardrails,
  }) => {
    test.skip(!isExternalBaseURL, 'Sandbox negative coverage only runs against a deployed sandbox environment.');

    await openCheckoutWithSeededCart(page, request);

    await page.getByPlaceholder('Nome completo').fill('Sandbox Negative');
    await page.getByPlaceholder('E-mail').fill(sandboxUser.email || 'sandbox-negative@mejoy.com');
    await page.getByPlaceholder(/\(11\) 99999-9999/).fill('11999990000');
    await page.getByPlaceholder('CPF (opcional)').fill('11111111111');
    await page.getByPlaceholder('CPF (opcional)').blur();
    await expect(page.locator('body')).toContainText(/CPF inválido/i);

    const cepInput = page.getByPlaceholder('CEP');
    await cepInput.fill('00000000');
    await cepInput.blur();
    await expect(page.locator('body')).toContainText(/CEP não encontrado|Erro ao buscar CEP/i);

    await fillCheckoutStepOne(page, {
      identity: { name: 'Sandbox Retry', email: sandboxUser.email || 'sandbox-retry@mejoy.com' },
    });

    await page.getByRole('button', { name: /Cartão de Crédito/i }).click();
    await page.getByRole('button', { name: /Confirmar Pedido/i }).click();
    await expect(page.locator('body')).toContainText(/Preencha todos os dados do cartão/i);

    guardrails.allowResponse(/\/api\/store-v2\/create-payment/i);
    const { response } = await submitCreditCardCheckout(page, sandboxCard);
    expect(response.status()).toBeGreaterThanOrEqual(400);

    await page.getByRole('button', { name: 'Pix' }).click();
    await expect(page.getByRole('button', { name: /Gerar PIX do Pedido/i })).toBeVisible();
  });
});
