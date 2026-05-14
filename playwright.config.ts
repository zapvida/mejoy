import { defineConfig, devices } from '@playwright/test';

const {
  bootstrapPlaywrightEnv,
  resolveBrowserUse,
} = require('./scripts/playwright/env.cjs');

type PlaywrightLane = 'pr-regression' | 'prod-smoke' | 'sandbox-e2e' | 'legacy';

const lane = (process.env.PLAYWRIGHT_LANE ?? 'pr-regression') as PlaywrightLane;
const tecmedMode =
  process.env.PLAYWRIGHT_TECMED_MODE ||
  (lane === 'prod-smoke' ? 'prod-safe' : lane === 'sandbox-e2e' ? 'staging-full' : 'local-smoke');
const runtime = bootstrapPlaywrightEnv({ mode: tecmedMode });
const reportRoot = process.env.PLAYWRIGHT_ARTIFACTS_DIR || `playwright-report/${runtime.runId}`;
const extraHTTPHeaders =
  process.env.PLAYWRIGHT_INJECT_E2E_HEADERS === 'true'
    ? {
        'x-e2e-run-id': runtime.runId,
        'x-playwright-mode': runtime.mode,
        'x-tecmed-project': runtime.repoName,
      }
    : undefined;

function resolveLaneGrep(currentLane: PlaywrightLane) {
  if (currentLane === 'legacy') {
    return undefined;
  }

  return new RegExp(`@${currentLane}`);
}

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: lane === 'legacy' ? [] : ['tests/e2e/legacy/**'],
  grep: resolveLaneGrep(lane),
  fullyParallel: lane !== 'sandbox-e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? (lane === 'sandbox-e2e' ? 1 : 2) : 0,
  workers: lane === 'sandbox-e2e' ? 1 : process.env.CI ? 2 : undefined,
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  outputDir: `test-results/${runtime.runId}`,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: `${reportRoot}/html` }],
    ['json', { outputFile: `${reportRoot}/report.json` }],
    ['junit', { outputFile: `${reportRoot}/junit.xml` }],
  ],
  use: {
    baseURL: runtime.baseUrl,
    ...resolveBrowserUse(),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 800 },
    ...(extraHTTPHeaders ? { extraHTTPHeaders } : {}),
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: runtime.isLocal
    ? {
        command:
          'PORT=3100 STORE_V2=1 NEXT_PUBLIC_STORE_V2=1 HOME_VARIANT=medvi_journey ALLOW_MOCK_TRIAGE_SESSION=1 pnpm dev',
        url: runtime.baseUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
