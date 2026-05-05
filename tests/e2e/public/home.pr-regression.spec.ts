import { dismissCookieBanner } from '../support/auth';
import { expect, test } from '../support/test';

test.describe('MeJoy public acquisition @pr-regression', () => {
  test('home exposes the emagrecimento journey CTA', async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);

    await expect(page.getByTestId('home-medvi-journey')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('próximo passo em saúde');

    const primaryCta = page
      .locator('[data-testid="home-primary-cta"], [data-testid="home-primary-cta-desktop"]')
      .filter({ visible: true })
      .first();
    await expect(primaryCta).toBeVisible();
    await expect(primaryCta).toHaveAttribute('href', '/triagem/emagrecimento');

    await primaryCta.click();
    await expect(page).toHaveURL(/\/triagem\/emagrecimento$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/perfil clínico/i);
  });
});
