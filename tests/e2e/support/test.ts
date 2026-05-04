import { expect, test as base } from '@playwright/test';

import { baseURL } from './env';

const DEFAULT_ALLOWED_CONSOLE_PATTERNS = [
  /content-security-policy/i,
  /report-only policy/i,
  /report only/i,
  /refused to load/i,
  /refused to execute a script/i,
  /does not appear in the script-src directive/i,
  /appears in neither the font-src directive/i,
  /font-src/i,
  /googletagmanager/i,
  /connect\.facebook\.net/i,
  /clarity\.ms/i,
  /fonts\.gstatic\.com/i,
  /cookie .*invalid domain/i,
  /has been rejected for invalid domain/i,
  /failed to load resource: the server responded with a status of 400/i,
  /hydration/i,
  /react does not recognize/i,
];

const DEFAULT_ALLOWED_PAGEERROR_PATTERNS = [/ResizeObserver loop/i];
const DEFAULT_ALLOWED_RESPONSE_PATTERNS = [
  /\/api\/security\/csp-report/i,
  /\/_next\/webpack-hmr/i,
];

export type Guardrails = {
  allowConsole: (...patterns: RegExp[]) => void;
  allowPageError: (...patterns: RegExp[]) => void;
  allowResponse: (...patterns: RegExp[]) => void;
};

export const test = base.extend<{ guardrails: Guardrails }>({
  guardrails: [
    async ({ page }, use) => {
      const allowedConsolePatterns = [...DEFAULT_ALLOWED_CONSOLE_PATTERNS];
      const allowedPageErrorPatterns = [...DEFAULT_ALLOWED_PAGEERROR_PATTERNS];
      const allowedResponsePatterns = [...DEFAULT_ALLOWED_RESPONSE_PATTERNS];
      const unexpectedConsole: string[] = [];
      const unexpectedPageErrors: string[] = [];
      const unexpectedResponses: string[] = [];
      const appOrigin = new URL(baseURL).origin;

      const matches = (patterns: RegExp[], value: string) => patterns.some((pattern) => pattern.test(value));

      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        const text = message.text();
        if (matches(allowedConsolePatterns, text)) return;
        unexpectedConsole.push(text);
      });

      page.on('pageerror', (error) => {
        const text = error.message;
        if (matches(allowedPageErrorPatterns, text)) return;
        unexpectedPageErrors.push(text);
      });

      page.on('response', (response) => {
        if (response.status() < 500) return;
        if (!response.url().startsWith(appOrigin)) return;
        if (matches(allowedResponsePatterns, response.url())) return;
        unexpectedResponses.push(`${response.status()} ${response.url()}`);
      });

      await use({
        allowConsole: (...patterns: RegExp[]) => {
          allowedConsolePatterns.push(...patterns);
        },
        allowPageError: (...patterns: RegExp[]) => {
          allowedPageErrorPatterns.push(...patterns);
        },
        allowResponse: (...patterns: RegExp[]) => {
          allowedResponsePatterns.push(...patterns);
        },
      });

      const failures: string[] = [];

      if (unexpectedConsole.length > 0) {
        failures.push(
          `Unexpected console errors:\n${unexpectedConsole.map((entry) => `- ${entry}`).join('\n')}`,
        );
      }

      if (unexpectedPageErrors.length > 0) {
        failures.push(
          `Unexpected page errors:\n${unexpectedPageErrors.map((entry) => `- ${entry}`).join('\n')}`,
        );
      }

      if (unexpectedResponses.length > 0) {
        failures.push(
          `Unexpected 5xx responses:\n${unexpectedResponses.map((entry) => `- ${entry}`).join('\n')}`,
        );
      }

      expect(
        failures,
        failures.join('\n\n') || 'Guardrails should not collect unexpected runtime failures.',
      ).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
