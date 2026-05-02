import { expect, test, type Page } from '@playwright/test';

const BASE_URL = process.env.PRODUCTION_URL || 'http://localhost:3000';
const ROOT_PATH = '/';

const NON_BLOCKING_ERROR_PATTERNS = [
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
  /prop `%s` did not match/i,
  /hydration/i,
];

function isNonBlockingError(message: string): boolean {
  return NON_BLOCKING_ERROR_PATTERNS.some(pattern => pattern.test(message));
}

async function clickFirstVisible(page: Page, selectors: string[]) {
  for (const selector of selectors) {
    const locator = page.locator(selector);
    const count = await locator.count().catch(() => 0);

    for (let index = 0; index < count; index += 1) {
      const candidate = locator.nth(index);
      if (await candidate.isVisible({ timeout: 1500 }).catch(() => false)) {
        await candidate.evaluate((node: HTMLElement) => node.click());
        return true;
      }
    }
  }
  return false;
}

async function clickStepOption(page: Page, stepKey: string, optionValue: string) {
  await page.locator(`[data-triage-step="${stepKey}"] [data-option-value="${optionValue}"]`).first().click();
}

async function continueWizard(page: Page) {
  const continueButton = page.locator('button:has-text("Continuar")');
  await expect(continueButton).toBeVisible({ timeout: 10_000 });
  await continueButton.click({ force: true });
}

async function acceptCookiesIfVisible(page: Page) {
  for (const delayMs of [0, 600]) {
    if (delayMs) {
      await page.waitForTimeout(delayMs);
    }

    for (const selector of ['button:has-text("Aceitar")', 'button:has-text("Aceitar todos")']) {
      const locator = page.locator(selector);
      const count = await locator.count().catch(() => 0);

      for (let index = count - 1; index >= 0; index -= 1) {
        const candidate = locator.nth(index);
        if (await candidate.isVisible({ timeout: 800 }).catch(() => false)) {
          await candidate.click({ force: true });
          await page.waitForTimeout(400);
          return;
        }
      }
    }
  }
}

async function ensureFreshTriageStart(page: Page) {
  const resumeState = page.locator('text=Você parou por aqui');
  if (await resumeState.isVisible({ timeout: 4_000 }).catch(() => false)) {
    await page.locator('button:has-text("Começar do zero")').click();
  }

  await expect(page.locator('text=Consentimento e dados base')).toBeVisible({ timeout: 15_000 });
  await acceptCookiesIfVisible(page);
  await expect(page.locator('[data-testid="triage-shell"]').first()).toHaveCSS('background-color', 'rgb(247, 246, 242)');
}

test.describe('Fluxo Canônico Emagrecimento - Launch Smoke', () => {
  test('Home verde → LP → triagem agrupada → finalize', async ({ page }) => {
    test.setTimeout(120_000);

    const errors: string[] = [];

    page.on('console', msg => {
      const text = `[${msg.type()}] ${msg.text()}`;
      if (msg.type() === 'error' && !isNonBlockingError(text)) {
        errors.push(text);
      }
    });

    page.on('pageerror', error => {
      const text = `[PAGE ERROR] ${error.message}`;
      if (!isNonBlockingError(text)) {
        errors.push(text);
      }
    });

    await page.goto(`${BASE_URL}${ROOT_PATH}`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`${ROOT_PATH.replace('/', '\\/')}$|${ROOT_PATH.replace('/', '\\/')}\\?`));

    await acceptCookiesIfVisible(page);

    const homeHeroTitle = page.locator('h1').first();
    await expect(homeHeroTitle).toContainText('Saúde digital', { timeout: 15_000 });
    await expect(homeHeroTitle).toContainText('redefinida');

    const openedLanding = await clickFirstVisible(page, [
      'a[href="/emagrecimento"]',
      'a:has-text("Perda de peso")',
    ]);
    expect(openedLanding).toBe(true);

    await expect(page).toHaveURL(/.*\/emagrecimento(?:\?.*)?$/, { timeout: 15_000 });
    await acceptCookiesIfVisible(page);

    const triageLinks = page.locator('a[href*="triagem/emagrecimento"]');
    await expect(triageLinks.first()).toBeVisible({ timeout: 15_000 });
    let clickedTriage = false;
    const triageLinkCount = await triageLinks.count();
    for (let index = 0; index < triageLinkCount; index += 1) {
      const candidate = triageLinks.nth(index);
      if (await candidate.isVisible({ timeout: 1_500 }).catch(() => false)) {
        await candidate.click({ force: true });
        clickedTriage = true;
        break;
      }
    }
    expect(clickedTriage).toBe(true);
    await expect(page).toHaveURL(/.*triagem\/emagrecimento(?:\?.*)?$/, { timeout: 15_000 });
    await acceptCookiesIfVisible(page);
    await ensureFreshTriageStart(page);

    await clickStepOption(page, 'aceita_termos', 'aceito');
    await page.locator('input[name="altura"]').fill('170');
    await page.locator('input[name="peso"]').fill('100');
    await page.locator('input[name="peso_meta"]').fill('78');
    await clickStepOption(page, 'sexo', 'M');
    const dateInput = page.locator('input[name="data_nascimento"]').first();
    await dateInput.fill('01/01/1990');
    await expect(dateInput).toHaveValue('01/01/1990');
    await dateInput.press('Tab');
    await page.waitForTimeout(150);
    await continueWizard(page);

    await expect(page.locator('text=Segurança clínica')).toBeVisible({ timeout: 10_000 });
    await clickStepOption(page, 'comorbidades', 'hipertensao');
    await clickStepOption(page, 'contraindicacoes_glp1', 'nenhuma');
    await clickStepOption(page, 'cirurgia_bariatrica_previa', 'nao');
    await clickStepOption(page, 'uso_opioides_3meses', 'nao');
    await clickStepOption(page, 'medicamentos_prescritos_atual', 'sim');
    await clickStepOption(page, 'pressao_arterial_faixa', 'estagio1');
    await clickStepOption(page, 'frequencia_cardiaca_repouso', '60_80');
    await continueWizard(page);

    await expect(page.locator('text=Histórico e uso prévio')).toBeVisible();
    await clickStepOption(page, 'uso_medicacao_emagrecimento_recente', 'nao');
    await continueWizard(page);

    await expect(page.locator('text=Objetivos e preferência terapêutica')).toBeVisible();
    await clickStepOption(page, 'impacto_vida', 'moderado');
    await clickStepOption(page, 'objetivo_principal', 'ambos');
    await clickStepOption(page, 'preferencia_principio_ativo', 'nao_sei');
    await continueWizard(page);

    await expect(page.locator('text=Contato e autorização')).toBeVisible();
    await page.locator('input[name="primeiro_nome"]').fill('Teste Launch');
    await page.locator('input[name="whatsapp"]').fill('11999998888');
    await clickStepOption(page, 'consentimento_whatsapp', 'autorizo');

    const finalizeRequest = page.waitForRequest(request => {
      return request.method() === 'POST' && request.url().includes('/api/triage/finalize');
    });

    const submitButton = page.locator('button:has-text("Gerar meu relatório")');
    await expect(submitButton).toBeVisible({ timeout: 10_000 });
    await submitButton.click();

    const request = await finalizeRequest;
    expect(request).toBeTruthy();

    await page.waitForTimeout(1000);
    const isRunningStateVisible = await page
      .locator('text=Gerando seu relatório')
      .isVisible({ timeout: 8_000 })
      .catch(() => false);

    if (!isRunningStateVisible) {
      await page.waitForURL(/.*relatorio|.*report/, { timeout: 30_000 }).catch(() => undefined);
    }

    const reachedReport = /relatorio|report/.test(page.url());
    if (reachedReport) {
      await acceptCookiesIfVisible(page);
      const goToCheckout = await clickFirstVisible(page, [
        'a[href*="/emagrecimento/checkout"]',
        'a:has-text("Continuar para checkout")',
        'a:has-text("Iniciar com este plano")',
      ]);

      if (goToCheckout) {
        await page.waitForURL(/.*\/emagrecimento\/checkout/, { timeout: 20_000 });
        await expect(page.locator('h1').first()).toContainText('Confirme seu plano', { timeout: 10_000 });
      }
    }

    expect(errors).toEqual([]);
  });

  test('Validar env vars de preços via API', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/asaas/create-payment`, {
      data: {
        product: 'emagrecimento',
        plano: 'basico',
        nome: 'Teste',
        email: 'teste@teste.com',
        telefone: '11999999999',
      },
    });

    const data = await response.json();

    if (data.code === 'MISSING_ENV') {
      throw new Error(`Env var não configurada: ${data.details}`);
    }
  });
});
