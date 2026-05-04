import { expect, test } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844, stickyVisible: true },
  { name: 'tablet-768', width: 768, height: 1024, stickyVisible: false },
  { name: 'desktop-1440', width: 1440, height: 900, stickyVisible: false },
];

test.describe('Responsividade da Home Medvi', () => {
  for (const viewport of VIEWPORTS) {
    test(`layout sem quebra em ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByTestId('home-medvi-journey')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('[data-home-section="hero"]')).toBeVisible();
      await expect(page.locator('[data-home-section="plans"]')).toBeVisible();
      await expect(page.locator('[data-home-section="faq"]')).toBeVisible();

      const scrollWidth = await page.evaluate(() =>
        Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
      );
      expect(scrollWidth).toBeLessThanOrEqual(viewport.width + 8);

      if (viewport.stickyVisible) {
        await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
        await expect(page.getByTestId('home-medvi-sticky-cta')).toBeVisible();
        await expect(page.getByTestId('home-sticky-cta-link')).toHaveAttribute('href', '/triagem/emagrecimento');
      } else {
        await expect(page.getByTestId('home-medvi-sticky-cta')).toBeHidden();
      }

      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toMatch(/Mais buscados|Mais vendidos|Alloe Health|ZapFarm/i);
    });
  }
});
