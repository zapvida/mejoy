#!/usr/bin/env tsx

import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { rename } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium, type Page } from '@playwright/test';

type FixtureSummary = {
  email: string;
  password: string;
  profileId: string | null;
  orderId: string | null;
  triageId: string | null;
  reportUrl: string | null;
  dashboardMagicUrl: string | null;
};

const BASE_URL = process.env.PRODUCTION_URL || 'https://www.mejoy.com.br';
const APP_RETURN_URL = 'mejoy://dashboard';
const PNPM_BIN = process.env.MEJOY_PNPM_BIN || '/opt/homebrew/bin/pnpm';
const FFMPEG_BIN = process.env.MEJOY_FFMPEG_BIN || '/opt/homebrew/bin/ffmpeg';
const VIEWPORT = { width: 390, height: 844 };
const OUTPUT_DIR = path.join(process.cwd(), 'artifacts', 'mejoy-launch-final');
const RAW_DIR = path.join(OUTPUT_DIR, 'raw');
const APP_DIR = path.join(OUTPUT_DIR, 'app-sequence');
const NATIVE_PNG_DIR = path.join(
  process.cwd(),
  'artifacts',
  'mejoy-native-release-review',
  'screenshots',
  'iphone-png'
);
const WEB_VIDEO_MP4 = path.join(OUTPUT_DIR, 'mejoy-launch-web.mp4');
const APP_VIDEO_MP4 = path.join(OUTPUT_DIR, 'mejoy-launch-app.mp4');
const FINAL_VIDEO_MP4 = path.join(OUTPUT_DIR, 'mejoy-launch-final.mp4');
const WEB_VIDEO_WEBM = path.join(RAW_DIR, 'web-flow.webm');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');

const APP_SEQUENCE = [
  '00-splash-premium.png',
  '01-onboarding-premium.png',
  '03-checkup-resultado.png',
  '04-hoje-dashboard.png',
  '05-plano-90-dias.png',
  '17-telemedicine.png',
  '25-order-status.png',
  '28-plan-membership.png',
] as const;

function ensureDir(dirPath: string) {
  mkdirSync(dirPath, { recursive: true });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function run(command: string, args: string[], cwd = process.cwd()) {
  return execFileSync(command, args, {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    env: process.env,
  });
}

function parseFixtureSummary(raw: string): FixtureSummary {
  const lastLine = raw
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1);

  if (!lastLine) {
    throw new Error('Fixture script returned no JSON output.');
  }

  return JSON.parse(lastLine) as FixtureSummary;
}

async function dismissCookieBanner(page: Page) {
  const acceptButton = page
    .locator('button:has-text("Aceitar"), button:has-text("Aceitar todos")')
    .first();

  if (await acceptButton.isVisible({ timeout: 1200 }).catch(() => false)) {
    await sleep(700);
    await acceptButton.click();
    await sleep(500);
  }
}

async function smoothScroll(page: Page, totalY: number, steps: number, pauseMs: number) {
  const delta = Math.round(totalY / steps);
  for (let index = 0; index < steps; index += 1) {
    await page.evaluate((value) => window.scrollBy({ top: value, behavior: 'instant' }), delta);
    await sleep(pauseMs);
  }
}

async function openAndSettle(page: Page, url: string, waitMs = 1800) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(waitMs);
}

async function waitForLoadedImages(page: Page, minimumCount: number, timeoutMs = 15000) {
  await page
    .waitForFunction(
      (count) =>
        Array.from(document.images).filter((image) => image.complete && image.naturalWidth > 0).length >= count,
      minimumCount,
      { timeout: timeoutMs }
    )
    .catch(() => {});
  await sleep(700);
}

async function assertNoFatalPageCopy(page: Page, text: string) {
  const body = (await page.textContent('body')) || '';
  if (body.includes(text)) {
    throw new Error(`Unexpected fatal copy found: ${text}`);
  }
}

async function loginIntoDashboard(page: Page, fixture: FixtureSummary) {
  await openAndSettle(page, `${BASE_URL}/login?redirect=/dashboard`, 2200);
  await dismissCookieBanner(page);
  const passwordTab = page.getByRole('button', { name: /^Senha$/i }).first();
  if (await passwordTab.isVisible({ timeout: 2000 }).catch(() => false)) {
    await passwordTab.click();
    await sleep(400);
  }
  const emailField = page.locator('input[type="email"], input[name="email"]').first();
  const passwordField = page.locator('input[type="password"], input[name="password"]').first();
  const submitButton = page
    .locator('button:has-text("Entrar"), button:has-text("Acessar"), button[type="submit"]')
    .first();

  await emailField.fill(fixture.email);
  await passwordField.fill(fixture.password);
  await sleep(300);
  await submitButton.click();
  await sleep(5200);

  if (!page.url().includes('/dashboard')) {
    throw new Error(`Password login did not reach /dashboard. Current URL: ${page.url()}`);
  }
}

async function captureWebFlow(fixture: FixtureSummary) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    locale: 'pt-BR',
    colorScheme: 'light',
    deviceScaleFactor: 2,
    recordVideo: {
      dir: RAW_DIR,
      size: VIEWPORT,
    },
  });
  const page = await context.newPage();
  const video = page.video();

  try {
    await openAndSettle(page, `${BASE_URL}/`);
    await waitForLoadedImages(page, 4);
    await dismissCookieBanner(page);
    await smoothScroll(page, 620, 4, 450);

    await openAndSettle(page, `${BASE_URL}/emagrecimento`);
    await waitForLoadedImages(page, 3);
    await dismissCookieBanner(page);
    await smoothScroll(page, 920, 5, 450);

    await openAndSettle(page, `${BASE_URL}/triagem/emagrecimento`, 2200);
    await dismissCookieBanner(page);
    await smoothScroll(page, 1120, 6, 420);

    if (!fixture.reportUrl) {
      throw new Error('Missing reportUrl from fixture.');
    }
    await openAndSettle(page, fixture.reportUrl, 2400);
    await dismissCookieBanner(page);
    await assertNoFatalPageCopy(page, 'Relatório não encontrado');
    await smoothScroll(page, 1720, 8, 420);

    if (!fixture.triageId) {
      throw new Error('Missing triageId from fixture.');
    }
    const checkoutUrl =
      `${BASE_URL}/emagrecimento/checkout?` +
      new URLSearchParams({
        reportId: fixture.triageId,
        triageId: fixture.triageId,
        plano: 'programa-6m',
        trilha: 'tirzepatida',
        appReturnUrl: APP_RETURN_URL,
      }).toString();
    await openAndSettle(page, checkoutUrl, 2200);
    await dismissCookieBanner(page);
    await smoothScroll(page, 1280, 6, 440);

    const obrigadoUrl =
      `${BASE_URL}/emagrecimento/obrigado?` +
      new URLSearchParams({
        reportId: fixture.triageId,
        appReturnUrl: APP_RETURN_URL,
      }).toString();
    await openAndSettle(page, obrigadoUrl, 2200);
    await assertNoFatalPageCopy(page, 'Pagamento aguardando confirmação');
    await sleep(1400);

    if (fixture.dashboardMagicUrl) {
      await openAndSettle(page, fixture.dashboardMagicUrl, 5200);
    } else {
      await loginIntoDashboard(page, fixture);
    }

    if (!page.url().includes('/dashboard')) {
      throw new Error(`Dashboard flow did not reach /dashboard. Current URL: ${page.url()}`);
    }
    await smoothScroll(page, 860, 4, 500);
    await sleep(1600);
  } finally {
    await context.close();
    await browser.close();
  }

  if (!video) {
    throw new Error('Web flow video was not recorded.');
  }

  const videoPath = await video.path();
  await rename(videoPath, WEB_VIDEO_WEBM);
}

function buildAppSequence() {
  ensureDir(APP_DIR);

  const concatFilePath = path.join(APP_DIR, 'app-sequence.txt');
  const concatLines: string[] = [];

  APP_SEQUENCE.forEach((filename, index) => {
    const source = path.join(NATIVE_PNG_DIR, filename);
    const target = path.join(APP_DIR, `${String(index + 1).padStart(2, '0')}-${filename}`);
    copyFileSync(source, target);
    concatLines.push(`file '${target}'`);
    concatLines.push('duration 1.9');
  });

  const lastTarget = path.join(APP_DIR, `${String(APP_SEQUENCE.length).padStart(2, '0')}-${APP_SEQUENCE.at(-1)}`);
  concatLines.push(`file '${lastTarget}'`);
  writeFileSync(concatFilePath, concatLines.join('\n'));

  return concatFilePath;
}

function transcodeWebVideo() {
  run(FFMPEG_BIN, [
    '-y',
    '-ss',
    '2.0',
    '-i',
    WEB_VIDEO_WEBM,
    '-vf',
    `scale=${VIEWPORT.width}:${VIEWPORT.height}:force_original_aspect_ratio=increase,crop=${VIEWPORT.width}:${VIEWPORT.height},format=yuv420p`,
    '-r',
    '30',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '24',
    '-pix_fmt',
    'yuv420p',
    WEB_VIDEO_MP4,
  ]);
}

function renderAppVideo(concatFilePath: string) {
  run(FFMPEG_BIN, [
    '-y',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    concatFilePath,
    '-vf',
    `scale=${VIEWPORT.width}:${VIEWPORT.height}:force_original_aspect_ratio=increase,crop=${VIEWPORT.width}:${VIEWPORT.height},format=yuv420p`,
    '-fps_mode',
    'vfr',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '22',
    '-pix_fmt',
    'yuv420p',
    APP_VIDEO_MP4,
  ]);
}

function concatFinalVideo() {
  const concatFilePath = path.join(OUTPUT_DIR, 'final-video.txt');
  writeFileSync(
    concatFilePath,
    [`file '${WEB_VIDEO_MP4}'`, `file '${APP_VIDEO_MP4}'`].join('\n')
  );

  run(FFMPEG_BIN, [
    '-y',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    concatFilePath,
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '23',
    '-pix_fmt',
    'yuv420p',
    FINAL_VIDEO_MP4,
  ]);
}

async function main() {
  ensureDir(OUTPUT_DIR);
  ensureDir(RAW_DIR);

  const fixtureRaw = run(PNPM_BIN, ['run', 'setup:test-user', '--', '--ensure-order', '--ensure-report', '--print-magic-link', '--json']);
  const fixture = parseFixtureSummary(fixtureRaw);

  if (!fixture.triageId || !fixture.reportUrl) {
    throw new Error('Fixture setup did not return the report flow URLs.');
  }

  await captureWebFlow(fixture);
  const concatFilePath = buildAppSequence();
  transcodeWebVideo();
  renderAppVideo(concatFilePath);
  concatFinalVideo();

  writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        baseUrl: BASE_URL,
        fixture,
        outputs: {
          webm: WEB_VIDEO_WEBM,
          webMp4: WEB_VIDEO_MP4,
          appMp4: APP_VIDEO_MP4,
          finalMp4: FINAL_VIDEO_MP4,
        },
        appSequence: APP_SEQUENCE,
      },
      null,
      2
    )
  );

  console.log(`✅ Vídeo final exportado em ${FINAL_VIDEO_MP4}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
