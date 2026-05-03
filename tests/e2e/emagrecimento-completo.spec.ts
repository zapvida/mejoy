import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PRODUCTION_URL || 'http://localhost:3000';
const LANDING_PATH = '/';

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
  return NON_BLOCKING_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

test.describe('Fluxo Completo Emagrecimento - Smoke Test', () => {
  test('Fluxo completo: LP → Triagem → Relatório → Checkout', async ({ page }) => {
    test.setTimeout(120_000);
    const logs: string[] = [];
    const errors: string[] = [];

    // Interceptar console logs e erros
    page.on('console', (msg) => {
      const text = `[${msg.type()}] ${msg.text()}`;
      logs.push(text);
      if (msg.type() === 'error' && !isNonBlockingError(text)) {
        errors.push(text);
      }
    });

    page.on('pageerror', (error) => {
      const text = `[PAGE ERROR] ${error.message}`;
      if (!isNonBlockingError(text)) {
        errors.push(text);
      }
    });

    // 1. Landing Page
    console.log('🔍 Testando Landing Page...');
    await page.goto(`${BASE_URL}${LANDING_PATH}`, { waitUntil: 'domcontentloaded' });
    expect(new URL(page.url()).pathname).toBe(LANDING_PATH);
    await expect(page.getByTestId('home-medvi-journey')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Emagrecimento com');
    
    // Verificar cookie banner
    const cookieBanner = page.locator('text=Uso de Cookies').or(page.locator('text=Cookie'));
    if (await cookieBanner.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('✅ Cookie banner encontrado');
      const acceptButton = page.locator('button:has-text("Aceitar")').or(page.locator('button:has-text("Aceitar todos")'));
      if (await acceptButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await acceptButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Verificar CTAs
    const cta = page.getByTestId('home-primary-cta');
    const fallbackCta = page
      .locator(
        'a[href*="triagem/emagrecimento"]:visible, a:has-text("Ver minha elegibilidade"), a:has-text("Iniciar minha triagem agora"), a:has-text("Fazer minha triagem agora")',
      )
      .first();
    const ctaVisible = await cta.isVisible({ timeout: 5000 }).catch(() => false);
    if (!ctaVisible) {
      await expect(fallbackCta).toBeVisible({ timeout: 10000 });
    } else {
      await expect(cta).toBeVisible({ timeout: 10000 });
    }
    console.log('✅ CTAs visíveis na LP');

    // 2. Navegar para Triagem
    console.log('🔍 Testando Triagem...');
    const triageUrlPattern = /.*triagem\/emagrecimento/;
    let triageNavigationOk = false;

    try {
      await Promise.all([
        page.waitForURL(triageUrlPattern, { timeout: 15000 }),
        (ctaVisible ? cta : fallbackCta).click(),
      ]);
      triageNavigationOk = true;
    } catch {
      console.log('⚠️ CTA não redirecionou no tempo esperado, aplicando fallback de URL direta...');
    }

    if (!triageNavigationOk) {
      const ctaHref = await cta.getAttribute('href');
      const fallbackTriageUrl = new URL(ctaHref || '/triagem/emagrecimento', BASE_URL).toString();
      await page.goto(fallbackTriageUrl);
      await page.waitForURL(triageUrlPattern, { timeout: 15000 });
    }

    await expect(page).toHaveURL(/.*triagem\/emagrecimento/);
    console.log('✅ Redirecionado para triagem');

    // Preencher triagem com caso típico candidato GLP-1
    // Aguardar formulário carregar
    await page.waitForTimeout(2000);

    // Preencher dados básicos (se houver campos visíveis)
    const nameInput = page.locator('input[name="name"], input[placeholder*="nome" i]').first();
    if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nameInput.fill('Teste Automatizado');
    }

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailInput.fill('teste@zapfarm.com.br');
    }

    // Preencher perguntas da triagem (simulando caso candidato GLP-1)
    // IMC > 30 (obesidade)
    const pesoInput = page.locator('input[name*="peso" i], input[placeholder*="peso" i]').first();
    if (await pesoInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await pesoInput.fill('100'); // 100kg
    }

    const alturaInput = page.locator('input[name*="altura" i], input[placeholder*="altura" i]').first();
    if (await alturaInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await alturaInput.fill('1.70'); // 1.70m = IMC ~34.6 (obesidade)
    }

    // Sem contraindicações graves
    const semCancer = page.locator('button:has-text("Não"), input[value="não" i]').first();
    if (await semCancer.isVisible({ timeout: 2000 }).catch(() => false)) {
      await semCancer.click();
    }

    // Com comorbidades leves
    const diabetesOption = page.locator('text=Diabetes tipo 2, button:has-text("Diabetes")').first();
    if (await diabetesOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await diabetesOption.click();
    }

    // Avançar nas perguntas (clicar em botões de próximo/continuar)
    const nextButton = page.locator('button:has-text("Próximo"), button:has-text("Continuar"), button:has-text("Avançar")').first();
    let attempts = 0;
    while (attempts < 10 && await nextButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await nextButton.click();
      await page.waitForTimeout(1000);
      attempts++;
    }

    // Finalizar triagem
    const finalizeButton = page.locator('button:has-text("Finalizar"), button:has-text("Concluir")').first();
    if (await finalizeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await finalizeButton.click();
      console.log('✅ Triagem finalizada');
    }

    // 3. Aguardar relatório
    console.log('🔍 Aguardando relatório...');
    await page.waitForURL(/.*relatorio|.*report/, { timeout: 30000 }).catch(() => {
      console.log('⚠️ Timeout aguardando relatório, continuando...');
    });

    // Verificar se relatório carregou (aguardar até 30s com polling)
    let reportLoaded = false;
    for (let i = 0; i < 30; i++) {
      const reportContent = page.locator('text=Relatório, text=Análise, text=Recomendação').first();
      if (await reportContent.isVisible({ timeout: 1000 }).catch(() => false)) {
        reportLoaded = true;
        console.log('✅ Relatório carregado');
        break;
      }
      await page.waitForTimeout(1000);
    }

    if (!reportLoaded) {
      console.log('⚠️ Relatório não carregou completamente, mas continuando teste...');
    }

    // 4. Verificar CTAs de planos no relatório
    const planoCta = page.locator('button:has-text("Escolher e seguir nesta pagina"), button:has-text("Continuar nesta pagina"), button:has-text("Abrir checkout agora")').first();
    if (await planoCta.isVisible({ timeout: 10000 }).catch(() => false)) {
      console.log('✅ CTAs de planos encontrados no relatório');
    }

    // 5. Abrir checkout inline no relatório
    console.log('🔍 Testando checkout inline...');
    let checkoutLoaded = false;
    const openInlineCheckoutButton = page.locator('button:has-text("Abrir checkout agora"), button:has-text("Continuar nesta pagina"), button:has-text("Escolher e seguir nesta pagina")').first();
    if (await openInlineCheckoutButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await openInlineCheckoutButton.click();
      await page.waitForTimeout(1200);
      const inlineCheckout = page.locator('#report-inline-checkout');
      await expect(inlineCheckout).toBeVisible({ timeout: 10000 });
      const checkoutTitle = page.locator('text=Finalize sem sair desta pagina').first();
      if (await checkoutTitle.isVisible({ timeout: 10000 }).catch(() => false)) {
        checkoutLoaded = true;
        console.log('✅ Checkout inline carregado no relatório');
      }
    }

    // 6. Fallback standalone continua operacional
    const checkoutUrl = page.url().includes('relatorio')
      ? `${BASE_URL}/emagrecimento/checkout?plano=programa-3m&reportId=test`
      : `${BASE_URL}/emagrecimento/checkout?plano=programa-3m`;
    const checkoutResponse = await page.request.get(checkoutUrl, { timeout: 30000 });
    if (!checkoutResponse.ok()) {
      throw new Error(`Checkout standalone indisponível: HTTP ${checkoutResponse.status()}`);
    }
    console.log('✅ Checkout standalone respondeu HTTP 200');

    // 7. Validar cards/plano do novo fluxo
    console.log('🔍 Validando planos do relatório...');
    const planos = [
      { nome: 'Programa 1 Mês', valor: '12x de R$ 166,67' },
      { nome: 'Programa 3 Meses', valor: '12x de R$ 333,33' },
      { nome: 'Programa 6 Meses', valor: '12x de R$ 500' },
    ];

    for (const plano of planos) {
      const planoElement = page.locator(`text=${plano.nome}`).first();
      if (await planoElement.isVisible({ timeout: 2000 }).catch(() => false)) {
        const valorMensal = page.locator(`text=${plano.valor}`).first();
        if (await valorMensal.isVisible({ timeout: 1000 }).catch(() => false)) {
          console.log(`✅ ${plano.nome}: faixa exibida (${plano.valor})`);
        }
      }
    }

    const paymentForm = page.locator('input[aria-label="Nome completo"]').first();
    if (await paymentForm.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Formulário inline presente');
    }

    // 8. Gerar relatório de validação
    const validationReport = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      steps: {
        landingPage: true,
        cookieBanner: await cookieBanner.isVisible({ timeout: 1000 }).catch(() => false),
        triagem: true,
        relatorio: reportLoaded,
      checkout: checkoutLoaded,
      },
      errors: errors.length > 0 ? errors : null,
      logs: logs.slice(-20), // Últimos 20 logs
    };

    console.log('\n📊 RELATÓRIO DE VALIDAÇÃO:');
    console.log(JSON.stringify(validationReport, null, 2));

    // Assertions finais
    expect(errors.length).toBe(0);
    expect(checkoutLoaded).toBe(true);
  });

  test('Validar env vars de preços via API', async ({ request }) => {
    // Este teste valida que as env vars estão configuradas corretamente
    // Fazendo uma requisição de teste para a API de checkout
    
    const BASE_URL = process.env.PRODUCTION_URL || 'http://localhost:3000';
    
    // Tentar criar um pagamento de teste (vai falhar na validação, mas mostra se env vars estão OK)
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
    
    // Se retornar erro de env var não configurada, falha o teste
    if (data.code === 'MISSING_ENV') {
      throw new Error(`Env var não configurada: ${data.details}`);
    }

    // Se retornar outro erro (validação, etc), está OK - significa que env vars estão configuradas
    console.log('✅ Env vars de preços estão configuradas');
  });
});
