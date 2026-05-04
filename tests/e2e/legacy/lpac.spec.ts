import { expect, test } from '@playwright/test';

test.describe('Alias /emagrecimento', () => {
  test('renderiza a mesma hero da home e canonicaliza para a raiz', async ({ page }) => {
    await page.goto('/');

    const rootH1 = (await page.getByRole('heading', { level: 1 }).textContent())?.replace(/\s+/g, ' ').trim();
    const rootPrimaryHref = await page.getByTestId('home-primary-cta').getAttribute('href');
    const rootTitle = await page.title();

    await page.goto('/emagrecimento');

    await expect(page).toHaveTitle(rootTitle);
    await expect(page.getByTestId('home-medvi-journey')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Emagrecimento com');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.mejoy.com.br/');
    await expect(page.getByTestId('home-primary-cta')).toHaveAttribute('href', rootPrimaryHref || '/triagem/emagrecimento');

    const aliasH1 = (await page.getByRole('heading', { level: 1 }).textContent())?.replace(/\s+/g, ' ').trim();
    expect(aliasH1).toBe(rootH1);
  });

  test('permite iniciar a triagem a partir do alias', async ({ page }) => {
    await page.goto('/emagrecimento');

    await Promise.all([
      page.waitForURL(/\/triagem\/emagrecimento/, { waitUntil: 'domcontentloaded' }),
      page.getByTestId('home-primary-cta').click(),
    ]);

    await expect(page).toHaveURL(/\/triagem\/emagrecimento/);
  });
});
