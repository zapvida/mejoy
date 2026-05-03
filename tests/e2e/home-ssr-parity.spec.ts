import { expect, test } from '@playwright/test';

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;!?])/g, '$1')
    .trim();
}

test.describe('Homepage SSR parity', () => {
  test('HTML bruto e DOM hidratado concordam em metadata, H1 e CTA principal', async ({ page, request }) => {
    let response = await request.get('/');
    for (let attempt = 0; attempt < 3 && !response.ok(); attempt += 1) {
      await page.waitForTimeout(1000);
      response = await request.get('/');
    }
    expect(response.ok()).toBe(true);

    const html = await response.text();
    const rawTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
    const rawDescription = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? '';
    const rawCanonical = html.match(/<link rel="canonical" href="([^"]*)"/i)?.[1] ?? '';
    const rawH1 = normalizeText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
    const rawPrimaryHref =
      html.match(/<a[^>]*data-testid="home-primary-cta"[^>]*href="([^"]*)"/i)?.[1] ??
      html.match(/<a[^>]*href="([^"]*)"[^>]*data-testid="home-primary-cta"/i)?.[1] ??
      '';
    const rawPrimaryText = normalizeText(
      html.match(/<a[^>]*data-testid="home-primary-cta"[^>]*>([\s\S]*?)<\/a>/i)?.[1],
    );

    await page.goto('/');

    const domTitle = await page.title();
    const domDescription = await page.locator('meta[name="description"]').getAttribute('content');
    const domCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    const domH1 = normalizeText(await page.getByRole('heading', { level: 1 }).textContent());
    const domPrimaryHref = await page.getByTestId('home-primary-cta').getAttribute('href');
    const domPrimaryText = normalizeText(await page.getByTestId('home-primary-cta').textContent());

    expect(rawTitle).toBe(domTitle);
    expect(rawDescription).toBe(domDescription);
    expect(rawCanonical).toBe(domCanonical);
    expect(rawH1).toBe(domH1);
    expect(rawPrimaryHref).toBe(domPrimaryHref);
    expect(rawPrimaryText).toBe(domPrimaryText);
  });
});
