import { loginCustomer } from '../support/auth';
import {
  hasEnv,
  isExternalBaseURL,
  prodUser,
  productionOrderId,
} from '../support/env';
import { expect, test } from '../support/test';

test.describe('MeJoy customer authenticated smoke @prod-smoke', () => {
  test('customer dashboard, profile and stable order stay readable', async ({ page, request }) => {
    test.skip(!isExternalBaseURL, 'Customer prod smoke only runs against a deployed environment.');
    test.skip(
      !hasEnv(['E2E_PROD_USER_EMAIL', 'E2E_PROD_USER_PASSWORD', 'E2E_PROD_ORDER_ID']),
      'E2E_PROD_USER_EMAIL, E2E_PROD_USER_PASSWORD and E2E_PROD_ORDER_ID are required.',
    );

    const unauthorizedOrderResponse = await request.get(
      `/api/store-v2/orders/${encodeURIComponent(productionOrderId)}?access=invalid-token`,
    );
    expect([401, 403]).toContain(unauthorizedOrderResponse.status());

    await loginCustomer(page, prodUser);

    await expect(page.getByRole('heading', { name: 'Timeline da sua jornada' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Compras e entregas' })).toBeVisible();

    await page.goto('/perfil');
    await expect(page.getByRole('heading', { name: 'Meu Perfil' })).toBeVisible();

    await page.goto(`/pedidos/${encodeURIComponent(productionOrderId)}`);
    await expect(page.getByRole('heading', { name: new RegExp(`Pedido #${productionOrderId.slice(-8)}`, 'i') })).toBeVisible();
    await expect(page.locator('body')).toContainText(/Status atual:/i);
  });
});
