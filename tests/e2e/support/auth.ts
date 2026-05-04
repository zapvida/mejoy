import type { Page } from '@playwright/test';

import { expect } from './test';

export async function dismissCookieBanner(page: Page) {
  const acceptButton = page
    .getByRole('button', { name: /aceitar|aceitar todos/i })
    .or(page.locator('button:has-text("Aceitar")'))
    .first();

  if (await acceptButton.isVisible({ timeout: 1_500 }).catch(() => false)) {
    await acceptButton.click();
  }
}

export async function loginCustomer(
  page: Page,
  credentials: { email: string; password: string },
  redirect = '/dashboard',
) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}`);
  await page.getByRole('button', { name: 'Senha' }).click();
  await page.locator('#email-pwd').fill(credentials.email);
  await page.locator('#password').fill(credentials.password);
  await page.getByRole('button', { name: /^Entrar$/ }).click();
  await expect(page).toHaveURL(new RegExp(redirect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

export async function loginAdmin(page: Page, credentials: { email: string; secret: string }) {
  await page.goto('/admin/login');
  await page.getByLabel(/Email com role administrativa/i).fill(credentials.email);
  await page.getByLabel(/Access key/i).fill(credentials.secret);
  await page.getByRole('button', { name: /Iniciar sessão admin/i }).click();
  await expect(page).toHaveURL(/\/admin(?:$|[#/?])/);
}
