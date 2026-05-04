import { expect, test } from '@playwright/test';

const TRIAGE_PATH = '/triagem/emagrecimento';
const BASE_URL = process.env.PRODUCTION_URL || 'http://localhost:3000';
const COOKIE_CONSENT_KEY = 'zapfarm_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'zapfarm_cookie_preferences';
const COOKIE_POLICY_VERSION_KEY = 'cookie_policy_version';
const COOKIE_POLICY_VERSION = '1.0.0';

async function grantCookieConsent(page: import('@playwright/test').Page) {
  const url = new URL(BASE_URL);

  await page.context().addCookies([
    {
      name: COOKIE_CONSENT_KEY,
      value: 'true',
      url: url.origin,
      sameSite: 'Lax',
    },
    {
      name: COOKIE_POLICY_VERSION_KEY,
      value: COOKIE_POLICY_VERSION,
      url: url.origin,
      sameSite: 'Lax',
    },
    {
      name: COOKIE_PREFERENCES_KEY,
      value: JSON.stringify({
        essential: true,
        analytics: true,
        marketing: true,
      }),
      url: url.origin,
      sameSite: 'Lax',
    },
  ]);
}

async function assertNoHorizontalOverflow(page: import('@playwright/test').Page) {
  await expect
    .poll(async () =>
      page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
    )
    .toBe(true);
}

async function captureStage(
  page: import('@playwright/test').Page,
  testInfo: import('@playwright/test').TestInfo,
  stageId: string
) {
  const stage = page.getByTestId(`triage-stage-${stageId}`);
  await expect(stage).toBeVisible();
  await stage.scrollIntoViewIfNeeded();
  await assertNoHorizontalOverflow(page);
  await expect(stage.getByRole('button', { name: /Próximo|Gerar meu resultado inicial/i }).last()).toBeVisible();

  await testInfo.attach(`${stageId}-${testInfo.project.name}.png`, {
    body: await stage.screenshot({
      animations: 'disabled',
      caret: 'hide',
    }),
    contentType: 'image/png',
  });
}

async function fillStageOne(page: import('@playwright/test').Page) {
  await page.locator('[data-step-key="aceita_termos"] button').click();
  await page.locator('input[name="altura"]').fill('170');
  await page.locator('input[name="peso"]').fill('96');
  await page.locator('input[name="peso_meta"]').fill('72');
  await page.getByRole('button', { name: 'Feminino' }).click();
  await page.getByRole('button', { name: 'Não' }).click();
  await page.locator('input[name="data_nascimento"]').fill('1989-07-04');
}

async function fillStageTwo(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /Nenhuma dessas/i }).first().click();
  await page.getByRole('button', { name: /Diabetes tipo 2/i }).click();
  await page.getByRole('button', { name: /Nenhuma dessas/i }).nth(1).click();
  await page.locator('[data-step-key="cirurgia_bariatrica_previa"]').getByRole('button', { name: 'Não' }).click();
  await page.locator('[data-step-key="uso_opioides_3meses"]').getByRole('button', { name: 'Não' }).click();
  await page
    .locator('[data-step-key="medicamentos_prescritos_atual"]')
    .getByRole('button', { name: 'Não' })
    .click();
  await page
    .locator('[data-step-key="uso_medicacao_emagrecimento_recente"]')
    .getByRole('button', { name: /^Não$/ })
    .click();
  await page
    .locator('[data-step-key="pressao_arterial_faixa"]')
    .getByRole('button', { name: /Não sei/i })
    .click();
  await page
    .locator('[data-step-key="frequencia_cardiaca_repouso"]')
    .getByRole('button', { name: /Não sei/i })
    .click();
}

test.describe('Triagem emagrecimento visual', () => {
  test('captura os 3 frames principais em desktop e mobile', async ({ page }, testInfo) => {
    test.skip(!['chromium', 'Mobile Chrome'].includes(testInfo.project.name));

    await grantCookieConsent(page);
    await page.goto(TRIAGE_PATH, { waitUntil: 'domcontentloaded' });

    await captureStage(page, testInfo, 'etapa-1-perfil');
    await fillStageOne(page);
    await page.getByRole('button', { name: 'Próximo' }).click();

    await captureStage(page, testInfo, 'etapa-2-clinico');
    await fillStageTwo(page);
    await page.getByRole('button', { name: 'Próximo' }).click();

    await captureStage(page, testInfo, 'etapa-3-objetivo-e-contato');
  });
});
