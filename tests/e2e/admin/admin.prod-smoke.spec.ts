import { loginAdmin } from '../support/auth';
import { adminUser, hasEnv, isExternalBaseURL } from '../support/env';
import { expect, test } from '../support/test';

test.describe('MeJoy admin smoke @prod-smoke', () => {
  test('admin login, cockpit and protected order list stay readable', async ({ page, request }) => {
    test.skip(!isExternalBaseURL, 'Admin prod smoke only runs against a deployed environment.');
    test.skip(
      !hasEnv(['E2E_ADMIN_EMAIL', 'E2E_ADMIN_SECRET']),
      'E2E_ADMIN_EMAIL and E2E_ADMIN_SECRET are required.',
    );

    const unauthorizedOrders = await request.get('/api/admin/store-v2/orders');
    expect(unauthorizedOrders.status()).toBe(401);

    await loginAdmin(page, adminUser);

    await expect(page.getByText('Cockpit MeJoy')).toBeVisible();
    await expect(page.locator('body')).toContainText(/Operação, comercial, clínico e saúde técnica/i);

    await page.goto('/admin/store-v2/orders');
    await expect(page.getByText('Pedidos Loja (Store V2)')).toBeVisible();
    await expect(page.locator('body')).toContainText(/Gerencie status e rastreamento/i);
  });
});
