import { test, expect } from '@playwright/test';

const LANDING_PATH = '/emagrecimento';
const BASE_URL = process.env.PRODUCTION_URL || 'http://localhost:3000';
const COOKIE_CONSENT_KEY = 'zapfarm_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'zapfarm_cookie_preferences';
const COOKIE_POLICY_VERSION_KEY = 'cookie_policy_version';
const COOKIE_POLICY_VERSION = '1.0.0';

async function grantCookieConsent(page: import('@playwright/test').Page) {
  const url = new URL(BASE_URL);

  await page.context().addCookies([
    {
      name: COOKIE_CONSENT_KEY,
      value: 'true',
      url: url.origin,
      sameSite: 'Lax',
    },
    {
      name: COOKIE_POLICY_VERSION_KEY,
      value: COOKIE_POLICY_VERSION,
      url: url.origin,
      sameSite: 'Lax',
    },
    {
      name: COOKIE_PREFERENCES_KEY,
      value: JSON.stringify({
        essential: true,
        analytics: true,
        marketing: true,
      }),
      url: url.origin,
      sameSite: 'Lax',
    },
  ]);
}

async function waitForSectionImages(section: import('@playwright/test').Locator) {
  const images = section.locator('img:visible');
  const imageCount = await images.count();

  for (let index = 0; index < imageCount; index += 1) {
    const image = images.nth(index);

    await image.scrollIntoViewIfNeeded();

    await expect
      .poll(
        async () =>
          image.evaluate(
            (element) => {
              const htmlImage = element as HTMLImageElement;
              return htmlImage.complete && htmlImage.naturalWidth > 0 && htmlImage.naturalHeight > 0;
            }
          ),
        {
          timeout: 10000,
        }
      )
      .toBe(true);
  }

  await section.scrollIntoViewIfNeeded();
}

test.describe('Emagrecimento visual parity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LANDING_PATH, { waitUntil: 'domcontentloaded' });
  });

  test('mobile first paint keeps hero readable above cookie banner', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile Safari');

    const hero = page.getByTestId('emagrecimento-hero');
    const headline = hero.getByRole('heading', { level: 1 });
    const cta = hero.getByRole('link', { name: 'Começar minha triagem' });
    const priceHook = page
      .getByText(
        /Consulte a faixa do programa após a triagem|triagem você vê a faixa do programa|Programas com avaliação médica e acompanhamento/i
      )
      .first();

    await expect(headline).toBeVisible();
    await expect(cta).toBeVisible();
    await expect(priceHook).toBeVisible();

    const ctaBox = await cta.boundingBox();
    expect(ctaBox).not.toBeNull();
    expect((ctaBox?.y ?? 0) + (ctaBox?.height ?? 0)).toBeLessThan(760);
  });

  test('approved visual frames stay stable', async ({ page }, testInfo) => {
    test.skip(!['chromium', 'Mobile Safari'].includes(testInfo.project.name));

    await grantCookieConsent(page);
    await page.goto(LANDING_PATH, { waitUntil: 'domcontentloaded' });

    const hero = page.getByTestId('emagrecimento-hero');
    await waitForSectionImages(hero);
    await expect(hero).toHaveScreenshot(`hero-${testInfo.project.name}.png`, {
      animations: 'disabled',
      caret: 'hide',
    });

    const proof = page.getByTestId('emagrecimento-proof');
    await proof.scrollIntoViewIfNeeded();
    await waitForSectionImages(proof);
    await expect(proof).toHaveScreenshot(`proof-${testInfo.project.name}.png`, {
      animations: 'disabled',
      caret: 'hide',
    });

    const treatments = page.getByTestId('emagrecimento-treatments');
    await treatments.scrollIntoViewIfNeeded();
    await waitForSectionImages(treatments);
    await expect(treatments).toHaveScreenshot(`treatments-${testInfo.project.name}.png`, {
      animations: 'disabled',
      caret: 'hide',
    });

    const results = page.getByTestId('emagrecimento-results');
    await results.scrollIntoViewIfNeeded();
    await waitForSectionImages(results);
    await expect(results).toHaveScreenshot(`results-${testInfo.project.name}.png`, {
      animations: 'disabled',
      caret: 'hide',
    });

    const decision = page.getByTestId('emagrecimento-decision');
    await decision.scrollIntoViewIfNeeded();
    await waitForSectionImages(decision);
    await expect(decision).toHaveScreenshot(`decision-${testInfo.project.name}.png`, {
      animations: 'disabled',
      caret: 'hide',
    });
  });
});
