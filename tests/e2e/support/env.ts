export type PlaywrightLane = 'pr-regression' | 'prod-smoke' | 'sandbox-e2e' | 'legacy';

export type CredentialPair = {
  email: string;
  password: string;
};

export type AdminCredentials = {
  email: string;
  secret: string;
};

export const lane = (process.env.PLAYWRIGHT_LANE ?? 'pr-regression') as PlaywrightLane;
export const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ||
  (lane === 'sandbox-e2e' ? process.env.SANDBOX_URL : process.env.PRODUCTION_URL) ||
  'http://localhost:3100';
export const isExternalBaseURL = !/https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?/i.test(baseURL);

export const productionReportId = process.env.PRODUCTION_REPORT_ID ?? '';
export const productionOrderId = process.env.E2E_PROD_ORDER_ID ?? '';
export const sandboxReportId = process.env.SANDBOX_REPORT_ID ?? process.env.PRODUCTION_REPORT_ID ?? '';
export const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN ?? '';

export const prodUser: CredentialPair = {
  email: process.env.E2E_PROD_USER_EMAIL ?? '',
  password: process.env.E2E_PROD_USER_PASSWORD ?? '',
};

export const sandboxUser: CredentialPair = {
  email: process.env.E2E_SANDBOX_USER_EMAIL ?? '',
  password: process.env.E2E_SANDBOX_USER_PASSWORD ?? '',
};

export const adminUser: AdminCredentials = {
  email: process.env.E2E_ADMIN_EMAIL ?? '',
  secret: process.env.E2E_ADMIN_SECRET ?? '',
};

export const sandboxCard = {
  holderName: process.env.E2E_SANDBOX_CARD_HOLDER ?? 'Playwright Test',
  number: process.env.E2E_SANDBOX_CARD_NUMBER ?? '4111111111111111',
  expiry: process.env.E2E_SANDBOX_CARD_EXPIRY ?? '12/30',
  cvv: process.env.E2E_SANDBOX_CARD_CVV ?? '123',
};

export function missingEnv(names: string[]) {
  return names.filter((name) => !process.env[name]);
}

export function hasEnv(names: string[]) {
  return missingEnv(names).length === 0;
}
