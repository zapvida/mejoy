import { test, expect } from "@playwright/test";

test.describe("Relatório mobile-first", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__copiedTexts = [];
      (window as any).__openedUrls = [];

      try {
        Object.defineProperty(navigator, "clipboard", {
          value: {
            writeText: (text: string) => {
              (window as any).__copiedTexts.push(text);
              return Promise.resolve();
            },
          },
          configurable: true,
        });
      } catch {
        // ignore when clipboard API is locked
      }

      window.open = ((url: string) => {
        (window as any).__openedUrls.push(url);
        return window;
      }) as any;
    });

    await page.route("**/api/report/whatsapp", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ text: "Mensagem teste" }),
      });
    });
  });

  test("garante experiência mobile completa", async ({ page }) => {
    await page.goto("/relatorio/demo");
    await expect(page.locator('[data-testid="report-hero"]')).toBeVisible();

    const heroHeight = await page.locator('[data-testid="report-hero"]').evaluate((el) => el.getBoundingClientRect().height);
    expect(heroHeight).toBeLessThanOrEqual(600);

    const actionBar = page.locator('[aria-label="Ações rápidas do relatório"]');
    await expect(actionBar).toBeVisible();
    await expect(actionBar).toHaveCSS("position", "fixed");

    await page.getByRole("button", { name: /Sono recuperador/i }).click();
    await expect(page.locator("#pillar-panel-sono")).toBeVisible();

    await page.getByRole("button", { name: /Nutrição inteligente/i }).click();
    await expect(page.locator("#pillar-panel-sono")).toBeHidden();
    await expect(page.locator("#pillar-panel-nutricao")).toBeVisible();

    const openPanels = await page.locator('[id^="pillar-panel-"]:not([hidden])').count();
    expect(openPanels).toBe(1);

    const evidenceChip = page.locator('button[data-citation-id]').first();
    await evidenceChip.click();
    await expect(page.getByRole("heading", { name: "Referências" })).toBeVisible();
    await page.getByRole("button", { name: "Fechar" }).click();
    await expect(page.getByRole("heading", { name: "Referências" })).toBeHidden();

    await page.getByRole("button", { name: "Copiar pedido" }).click();
    const copied = await page.evaluate(() => (window as any).__copiedTexts.length);
    expect(copied).toBeGreaterThan(0);

    const [whatsappRequest] = await Promise.all([
      page.waitForRequest("**/api/report/whatsapp"),
      page.getByRole("button", { name: "WhatsApp" }).click(),
    ]);
    expect(whatsappRequest.method()).toBe("POST");

    await expect(page.getByRole("button", { name: /acompanhamento premium/i })).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.5));
    await expect(page.getByRole("button", { name: /quero acompanhamento premium agora/i })).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(page.getByRole("button", { name: /quero acompanhamento premium agora/i })).toBeHidden();

    const noOverflow360 = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(noOverflow360).toBeTruthy();

    await page.setViewportSize({ width: 320, height: 740 });
    await page.waitForTimeout(100);
    const noOverflow320 = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(noOverflow320).toBeTruthy();
  });
});
