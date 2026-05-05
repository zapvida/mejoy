import { baseURL } from '../support/env';
import { expect, test } from '../support/test';

const COOKIE_CONSENT_KEY = 'zapfarm_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'zapfarm_cookie_preferences';
const COOKIE_POLICY_VERSION_KEY = 'cookie_policy_version';
const COOKIE_POLICY_VERSION = '1.0.0';

async function grantCookieConsent(page: import('@playwright/test').Page) {
  const origin = new URL(baseURL).origin;

  await page.context().addCookies([
    {
      name: COOKIE_CONSENT_KEY,
      value: 'true',
      url: origin,
      sameSite: 'Lax',
    },
    {
      name: COOKIE_POLICY_VERSION_KEY,
      value: COOKIE_POLICY_VERSION,
      url: origin,
      sameSite: 'Lax',
    },
    {
      name: COOKIE_PREFERENCES_KEY,
      value: JSON.stringify({
        essential: true,
        analytics: true,
        marketing: true,
      }),
      url: origin,
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
          image.evaluate((element) => {
            const htmlImage = element as HTMLImageElement;
            return htmlImage.complete && htmlImage.naturalWidth > 0 && htmlImage.naturalHeight > 0;
          }),
        { timeout: 10_000 }
      )
      .toBe(true);
  }

  await section.scrollIntoViewIfNeeded();
}

test.describe('MeJoy emagrecimento visuals @pr-regression', () => {
  test('stable sections preserve the approved composition', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium');

    await grantCookieConsent(page);
    await page.goto('/emagrecimento');

    const screenshotOpts = {
      animations: 'disabled' as const,
      caret: 'hide' as const,
      maxDiffPixels: 80_000,
    };

    const hero = page.getByTestId('emagrecimento-hero');
    await waitForSectionImages(hero);
    await expect(hero).toHaveScreenshot('hero.png', screenshotOpts);

    const results = page.getByTestId('emagrecimento-results');
    await waitForSectionImages(results);
    await expect(results).toHaveScreenshot('results.png', screenshotOpts);

    const treatments = page.getByTestId('emagrecimento-treatments');
    await waitForSectionImages(treatments);
    await expect(treatments).toHaveScreenshot('treatments.png', screenshotOpts);

    const proof = page.getByTestId('emagrecimento-proof');
    await waitForSectionImages(proof);
    await expect(proof).toHaveScreenshot('proof.png', screenshotOpts);

    const decision = page.getByTestId('emagrecimento-decision');
    await waitForSectionImages(decision);
    await expect(decision).toHaveScreenshot('decision.png', screenshotOpts);
  });
});
