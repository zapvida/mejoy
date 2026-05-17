import type { Page } from "@playwright/test";

import { dismissCookieBanner } from "../support/auth";
import { expect, test } from "../support/test";

async function waitForVisibleImages(page: Page) {
  await page
    .waitForLoadState("networkidle", { timeout: 15_000 })
    .catch(() => undefined);
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images)
        .filter((image) => {
          const rect = image.getBoundingClientRect();
          return (
            rect.bottom > 0 &&
            rect.top < window.innerHeight &&
            rect.right > 0 &&
            rect.left < window.innerWidth
          );
        })
        .map(
          (image) =>
            image.complete ||
            new Promise((resolve) => {
              const done = () => resolve(true);
              image.addEventListener("load", done, { once: true });
              image.addEventListener("error", done, { once: true });
              window.setTimeout(done, 5000);
            }),
        ),
    ),
  );
}

test.describe("MeJoy first-frame freeze @pr-regression", () => {
  test("home and emagrecimento first viewport remain visually frozen", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "first-frame visual baseline is pinned to chromium",
    );

    const screenshotOptions = {
      animations: "disabled" as const,
      caret: "hide" as const,
      fullPage: false,
      maxDiffPixels: 55_000,
    };

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await dismissCookieBanner(page);
    await expect(page.getByTestId("home-hub-hero")).toBeVisible();
    await waitForVisibleImages(page);
    await expect(page).toHaveScreenshot(
      "home-first-frame-mobile.png",
      screenshotOptions,
    );

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await dismissCookieBanner(page);
    await expect(page.getByTestId("home-hub-hero")).toBeVisible();
    await waitForVisibleImages(page);
    await expect(page).toHaveScreenshot(
      "home-first-frame-desktop.png",
      screenshotOptions,
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/emagrecimento");
    await dismissCookieBanner(page);
    await expect(page.getByTestId("emagrecimento-hero")).toBeVisible();
    await waitForVisibleImages(page);
    await expect(page).toHaveScreenshot(
      "emagrecimento-first-frame-mobile.png",
      screenshotOptions,
    );

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/emagrecimento");
    await dismissCookieBanner(page);
    await expect(page.getByTestId("emagrecimento-hero")).toBeVisible();
    await waitForVisibleImages(page);
    await expect(page).toHaveScreenshot(
      "emagrecimento-first-frame-desktop.png",
      screenshotOptions,
    );
  });
});
