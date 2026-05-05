import { expect, test } from '@playwright/test';

/** Ordem das seções em `MedviHomeHub` (hub multi-tratamento na raiz). */
const EXPECTED_SECTION_ORDER = [
  'hero',
  'trust-marquee',
  'weight_loss_feature',
  'editorial_triptych',
  'treatments',
  'how_it_works',
  'why_choose',
  'testimonials',
  'cta_banner',
  'faq',
  'footer',
];

test.describe('Homepage Medvi Journey @pr-regression', () => {
  test('renderiza o hub na raiz com header, hero e CTA principal', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Triagem online|Me Joy/i);
    await expect(page.getByTestId('home-medvi-journey')).toBeVisible();
    await expect(page.getByTestId('home-medvi-header')).toBeVisible();
    await expect(page.getByTestId('home-hub-hero')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/vida real/i);
    await expect(page.getByTestId('home-primary-cta')).toHaveAttribute('href', '/triagem/emagrecimento');
  });

  test('mantem a ordem canonica das secoes da home', async ({ page }) => {
    await page.goto('/');

    const sections = await page.locator('[data-home-section]').evaluateAll(elements =>
      elements.map(element => element.getAttribute('data-home-section')),
    );

    expect(sections).toEqual(EXPECTED_SECTION_ORDER);
  });

  test('menu (header minimal) abre dialog com ancora para secoes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Abrir menu' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('link', { name: 'Programa' })).toHaveAttribute('href', '/#tratamentos');
    await expect(dialog.getByRole('link', { name: 'Como funciona' })).toHaveAttribute('href', '/#como-funciona');
    await expect(dialog.getByRole('link', { name: 'Planos' })).toHaveAttribute('href', '/emagrecimento#tratamentos');
    await expect(dialog.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/#faq');

    await dialog.getByRole('link', { name: 'Como funciona' }).click();
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
      page
        .locator('[data-testid="home-primary-cta"], [data-testid="home-primary-cta-desktop"]')
        .filter({ visible: true })
        .click(),
    ]);

    await expect(page).toHaveURL(/\/triagem\/emagrecimento/);
  });
});
