import fs from 'node:fs';
import path from 'node:path';

import { devices, type Page } from '@playwright/test';

import { dismissCookieBanner } from '../support/auth';
import { test } from '../support/test';

/**
 * Visual parity harness Mejoy ↔ Medvi.
 *
 * Não é regressão automática: gera screenshots lado a lado em
 * qa-artifacts/medvi-parity/{desktop,mobile}/<flow>.png para
 * inspeção visual humana antes do go-live.
 *
 * Uso:
 *   PLAYWRIGHT_LANE=legacy PLAYWRIGHT_BASE_URL=https://<preview>.vercel.app \
 *     pnpm exec playwright test tests/e2e/qa/medvi-parity.spec.ts \
 *     --project=chromium
 */

const ARTIFACT_ROOT = path.resolve(process.cwd(), 'qa-artifacts/medvi-parity');

const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = devices['iPhone 13'].viewport ?? { width: 390, height: 844 };

const DEMO_REPORT_ID = process.env.MEDVI_PARITY_REPORT_ID ?? process.env.PRODUCTION_REPORT_ID ?? '';

type FlowSpec = {
  id: string;
  description: string;
  mejoyPath: string;
  medviUrl: string;
  /**
   * Permite saltar a captura de uma página inteira se ela depende de
   * recursos não disponíveis (ex.: relatório sem reportId).
   */
  skipWhen?: () => string | null;
};

const FLOWS: FlowSpec[] = [
  {
    id: 'home',
    description: 'Home institucional / hub multi-tratamento',
    mejoyPath: '/',
    medviUrl: 'https://home.medvi.org/',
  },
  {
    id: 'lpac-emagrecimento',
    description: 'LPAC GLP-1 / emagrecimento',
    mejoyPath: '/emagrecimento',
    medviUrl: 'https://glp1.medvi.org/',
  },
  {
    id: 'triagem-emagrecimento',
    description: 'Triagem / intake GLP-1',
    mejoyPath: '/triagem/emagrecimento',
    medviUrl: 'https://glp1.medvi.org/intake',
  },
  {
    id: 'relatorio-checkout',
    description: 'Relatório com checkout inline',
    mejoyPath: `/emagrecimento/relatorio?id=${encodeURIComponent(DEMO_REPORT_ID)}`,
    medviUrl: 'https://glp1.medvi.org/results',
    skipWhen: () =>
      DEMO_REPORT_ID
        ? null
        : 'MEDVI_PARITY_REPORT_ID (ou PRODUCTION_REPORT_ID) precisa estar definido para capturar o relatório.',
  },
];

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

async function captureFullPage(page: Page, screenshotPath: string) {
  ensureDir(path.dirname(screenshotPath));

  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      const total = document.body.scrollHeight;
      const step = window.innerHeight / 2;
      let y = 0;
      const interval = window.setInterval(() => {
        window.scrollTo(0, y);
        y += step;
        if (y >= total) {
          window.clearInterval(interval);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 60);
    });
  });

  await page.waitForTimeout(800);
  await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });
}

for (const flow of FLOWS) {
  const skipReason = flow.skipWhen?.() ?? null;

  test.describe(`medvi-parity ${flow.id} @medvi-parity`, () => {
    test(`desktop 1440x900 — ${flow.description}`, async ({ browser }) => {
      test.skip(Boolean(skipReason), skipReason ?? '');
      test.setTimeout(180_000);

      const ctx = await browser.newContext({ viewport: DESKTOP_VIEWPORT });
      const mejoyPage = await ctx.newPage();
      const medviPage = await ctx.newPage();

      const desktopDir = path.join(ARTIFACT_ROOT, 'desktop');
      ensureDir(desktopDir);

      try {
        await mejoyPage.goto(flow.mejoyPath, { waitUntil: 'networkidle' });
        await dismissCookieBanner(mejoyPage);
        await captureFullPage(mejoyPage, path.join(desktopDir, `${flow.id}.mejoy.png`));
      } catch (error) {
        console.warn(`[medvi-parity] mejoy desktop ${flow.id} falhou:`, error);
      }

      try {
        await medviPage.goto(flow.medviUrl, { waitUntil: 'networkidle' });
        await dismissCookieBanner(medviPage);
        await captureFullPage(medviPage, path.join(desktopDir, `${flow.id}.medvi.png`));
      } catch (error) {
        console.warn(`[medvi-parity] medvi desktop ${flow.id} falhou:`, error);
      }

      await ctx.close();
    });

    test(`mobile 390x844 — ${flow.description}`, async ({ browser }) => {
      test.skip(Boolean(skipReason), skipReason ?? '');
      test.setTimeout(180_000);

      const ctx = await browser.newContext({
        ...devices['iPhone 13'],
        viewport: MOBILE_VIEWPORT,
      });
      const mejoyPage = await ctx.newPage();
      const medviPage = await ctx.newPage();

      const mobileDir = path.join(ARTIFACT_ROOT, 'mobile');
      ensureDir(mobileDir);

      try {
        await mejoyPage.goto(flow.mejoyPath, { waitUntil: 'networkidle' });
        await dismissCookieBanner(mejoyPage);
        await captureFullPage(mejoyPage, path.join(mobileDir, `${flow.id}.mejoy.png`));
      } catch (error) {
        console.warn(`[medvi-parity] mejoy mobile ${flow.id} falhou:`, error);
      }

      try {
        await medviPage.goto(flow.medviUrl, { waitUntil: 'networkidle' });
        await dismissCookieBanner(medviPage);
        await captureFullPage(medviPage, path.join(mobileDir, `${flow.id}.medvi.png`));
      } catch (error) {
        console.warn(`[medvi-parity] medvi mobile ${flow.id} falhou:`, error);
      }

      await ctx.close();
    });
  });
}

test.afterAll(async () => {
  const reportPath = path.join(ARTIFACT_ROOT, 'REPORT.md');
  ensureDir(ARTIFACT_ROOT);
  if (fs.existsSync(reportPath)) return;

  const lines = [
    '# Medvi parity report',
    '',
    'Compare cada par de screenshots lado a lado e anote deltas em UI, copy, imagens e espaçamento.',
    '',
    '| Fluxo | Mejoy desktop | Medvi desktop | Mejoy mobile | Medvi mobile | Status |',
    '|-------|---------------|----------------|--------------|---------------|--------|',
  ];

  for (const flow of FLOWS) {
    lines.push(
      `| ${flow.id} | desktop/${flow.id}.mejoy.png | desktop/${flow.id}.medvi.png | mobile/${flow.id}.mejoy.png | mobile/${flow.id}.medvi.png | _pendente_ |`,
    );
  }

  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
});
