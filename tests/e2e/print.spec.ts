import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

const REPORT_URL = process.env.REPORT_URL ?? "https://alloehealth.com.br/relatorio/demo?print=true";

test("PDF claro e sem críticos de A11y", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "PDF print only in Chromium");
  await page.goto(REPORT_URL, { waitUntil: "networkidle" });

  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.filter(v => v.impact === "critical")).toHaveLength(0);

  // @ts-ignore chromium only
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  expect(pdf.byteLength).toBeGreaterThan(10000);
});
