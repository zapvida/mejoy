import { defineConfig, devices } from '@playwright/test';

type PlaywrightLane = 'pr-regression' | 'prod-smoke' | 'sandbox-e2e' | 'legacy';

const lane = (process.env.PLAYWRIGHT_LANE ?? 'pr-regression') as PlaywrightLane;
const explicitBaseURL =
  process.env.PLAYWRIGHT_BASE_URL ||
  (lane === 'sandbox-e2e' ? process.env.SANDBOX_URL : process.env.PRODUCTION_URL);
const baseURL = explicitBaseURL || 'http://localhost:3100';
const isExternalBaseURL = !/https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?/i.test(baseURL);

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
  outputDir: 'test-results',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report/html' }],
    ['json', { outputFile: 'playwright-report/report.json' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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
  webServer: isExternalBaseURL
    ? undefined
    : {
        command:
          'PORT=3100 STORE_V2=1 NEXT_PUBLIC_STORE_V2=1 HOME_VARIANT=medvi_journey ALLOW_MOCK_TRIAGE_SESSION=1 pnpm dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
