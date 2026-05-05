import { expect, test } from '../support/test';

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;!?])/g, '$1')
    .trim();
}

test.describe('MeJoy SSR and responsive parity @pr-regression', () => {
  test('homepage raw HTML and hydrated DOM keep title, H1 and primary CTA aligned', async ({
    page,
    request,
  }) => {
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();

    const html = await response.text();
    const rawTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
    const rawH1 = normalizeText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
    const rawPrimaryHref =
      html.match(/<a[^>]*data-testid="home-primary-cta"[^>]*href="([^"]*)"/i)?.[1] ??
      html.match(/<a[^>]*href="([^"]*)"[^>]*data-testid="home-primary-cta"/i)?.[1] ??
      html.match(/<a[^>]*data-testid="home-primary-cta-desktop"[^>]*href="([^"]*)"/i)?.[1] ??
      html.match(/<a[^>]*href="([^"]*)"[^>]*data-testid="home-primary-cta-desktop"/i)?.[1] ??
      '';

    await page.goto('/');
    const domTitle = await page.title();
    const domH1 = normalizeText(await page.getByRole('heading', { level: 1 }).textContent());
    const domPrimaryHref = await page
      .locator('[data-testid="home-primary-cta"], [data-testid="home-primary-cta-desktop"]')
      .filter({ visible: true })
      .first()
      .getAttribute('href');

    expect(rawTitle).toBe(domTitle);
    expect(rawH1).toBe(domH1);
    expect(rawPrimaryHref).toBe(domPrimaryHref);
  });

  for (const viewport of [
    { name: 'mobile', width: 390, height: 844, stickyVisible: true },
    { name: 'tablet', width: 768, height: 1024, stickyVisible: false },
    { name: 'desktop', width: 1440, height: 900, stickyVisible: false },
  ]) {
    test(`emagrecimento landing remains stable on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/emagrecimento');

      await expect(page.getByTestId('home-medvi-journey')).toBeVisible();
      await expect(page.getByTestId('home-medvi-hero')).toBeVisible();
      await expect(page.getByTestId('emagrecimento-results')).toBeVisible();
      await expect(page.getByTestId('emagrecimento-treatments')).toBeVisible();
      await expect(page.getByTestId('emagrecimento-faq')).toBeVisible();

      const scrollWidth = await page.evaluate(() =>
        Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
      );
      expect(scrollWidth).toBeLessThanOrEqual(viewport.width + 8);

      await page.evaluate(() => window.scrollTo({ top: 1_200, behavior: 'instant' }));
      const stickyCta = page.getByTestId('home-medvi-sticky-cta');

      if (viewport.stickyVisible) {
        await expect(stickyCta).toBeVisible();
      } else {
        await expect(stickyCta).toBeHidden();
      }
    });
  }
});
