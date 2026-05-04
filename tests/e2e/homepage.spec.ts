import { expect, test } from '@playwright/test';

const EXPECTED_SECTION_ORDER = [
  'hero',
  'trust-bar',
  'zero-cost',
  'how-it-works',
  'benefits',
  'tailored',
  'app-features',
  'testimonials',
  'plans',
  'decision',
  'faq',
  'legal-disclaimer',
  'footer',
];

test.describe('Homepage Medvi Journey', () => {
  test('renderiza a jornada Medvi na raiz com header, hero e CTA principal', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Emagrecimento com avaliacao medica/i);
    await expect(page.getByTestId('home-medvi-journey')).toBeVisible();
    await expect(page.getByTestId('home-medvi-header')).toBeVisible();
    await expect(page.getByTestId('home-medvi-hero')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Emagrecimento com');
    await expect(page.getByTestId('home-primary-cta')).toHaveAttribute('href', '/triagem/emagrecimento');
  });

  test('mantem a ordem canonica das secoes da home', async ({ page }) => {
    await page.goto('/');

    const sections = await page.locator('[data-home-section]').evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('data-home-section')),
    );

    expect(sections).toEqual(EXPECTED_SECTION_ORDER);
  });

  test('usa ancoras da raiz no header desktop e navega para as secoes corretas', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const desktopNav = page.locator('header nav');
    await expect(desktopNav).toBeVisible();

    await expect(desktopNav.getByRole('link', { name: 'Programa' })).toHaveAttribute('href', '/#programa');
    await expect(desktopNav.getByRole('link', { name: 'Como funciona' })).toHaveAttribute('href', '/#como-funciona');
    await expect(desktopNav.getByRole('link', { name: 'Planos' })).toHaveAttribute('href', '/#planos');
    await expect(desktopNav.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/#faq');

    await desktopNav.getByRole('link', { name: 'Como funciona' }).click();
    await expect(page).toHaveURL(/#como-funciona$/);
    await expect(page.locator('#como-funciona')).toBeInViewport();
  });

  test('nao renderiza blocos de storefront nem branding legado na raiz', async ({ page }) => {
    await page.goto('/');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toMatch(/Alloe Health|AlloeHealth|ZapFarm|Mais buscados|Mais vendidos/i);
  });

  test('o CTA principal inicia a triagem de emagrecimento', async ({ page }) => {
    await page.goto('/');

    await Promise.all([
      page.waitForURL(/\/triagem\/emagrecimento/),
      page.getByTestId('home-primary-cta').click(),
    ]);

    await expect(page).toHaveURL(/\/triagem\/emagrecimento/);
  });
});
