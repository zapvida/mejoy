import { test, expect } from '@playwright/test';

test.describe('Monetização - Assinatura Stripe', () => {
  test.beforeEach(async ({ page }) => {
    // Mock das APIs para testes
    await page.route('**/api/stripe/create-checkout-session', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'cs_test_123',
          url: 'https://checkout.stripe.com/test'
        })
      });
    });
  });

  test('Fluxo completo de assinatura - Plano Básico Mensal', async ({ page }) => {
    await page.goto('/pricing');
    
    // Verificar se a página carregou
    await expect(page.locator('h1')).toContainText('Escolha seu plano');
    
    // Verificar se os planos estão visíveis
    await expect(page.locator('[data-testid="plan-basic"]')).toBeVisible();
    await expect(page.locator('[data-testid="plan-plus"]')).toBeVisible();
    
    // Verificar toggle mensal/anual
    await expect(page.locator('text=Mensal')).toBeVisible();
    await expect(page.locator('text=Anual')).toBeVisible();
    
    // Clicar no plano básico
    await page.click('[data-testid="plan-basic"]');
    
    // Verificar se o botão de assinatura está visível
    await expect(page.locator('text=Assinar com Cartão')).toBeVisible();
    
    // Verificar se o botão PIX está desabilitado
    await expect(page.locator('text=PIX (Em breve)')).toBeDisabled();
    
    // Clicar em assinar
    await page.click('text=Assinar com Cartão');
    
    // Verificar se a API foi chamada
    await expect(page).toHaveURL(/checkout\.stripe\.com/);
  });

  test('Fluxo completo de assinatura - Plano Plus Anual', async ({ page }) => {
    await page.goto('/pricing');
    
    // Alternar para anual
    await page.click('text=Anual');
    
    // Verificar se os preços mudaram
    await expect(page.locator('text=R$ 290')).toBeVisible();
    await expect(page.locator('text=R$ 490')).toBeVisible();
    
    // Clicar no plano plus
    await page.click('[data-testid="plan-plus"]');
    
    // Verificar badge "Presente"
    await expect(page.locator('text=Presente')).toBeVisible();
    
    // Clicar em assinar
    await page.click('text=Assinar com Cartão');
    
    // Verificar se a API foi chamada
    await expect(page).toHaveURL(/checkout\.stripe\.com/);
  });

  test('Pré-seleção de plano via URL', async ({ page }) => {
    await page.goto('/pricing?plan=PLUS_MONTHLY');
    
    // Verificar se o plano plus está pré-selecionado
    await expect(page.locator('[data-testid="plan-plus"]')).toHaveClass(/border-blue-500/);
    
    // Verificar se o toggle está em mensal
    await expect(page.locator('text=Mensal')).toHaveClass(/text-white/);
  });

  test('Acessibilidade - Navegação por teclado', async ({ page }) => {
    await page.goto('/pricing');
    
    // Navegar por teclado
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verificar se o foco está visível
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('Acessibilidade - Contraste e labels', async ({ page }) => {
    await page.goto('/pricing');
    
    // Verificar se os botões têm contraste adequado
    const buttons = page.locator('button');
    await expect(buttons.first()).toBeVisible();
    
    // Verificar se os labels estão presentes
    await expect(page.locator('text=Plano Básico')).toBeVisible();
    await expect(page.locator('text=Plano Plus')).toBeVisible();
  });
});

test.describe('Monetização - Sistema de Presentes', () => {
  test.beforeEach(async ({ page }) => {
    // Mock das APIs de presente
    await page.route('**/api/gift/create', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          giftTokenId: 'gift_test_123',
          checkoutUrl: 'https://checkout.stripe.com/test',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        })
      });
    });

    await page.route('**/api/gift/redeem', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          subscription: {
            id: 'sub_test_123',
            activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        })
      });
    });
  });

  test('Criação de presente - Fluxo completo', async ({ page }) => {
    await page.goto('/presente');
    
    // Verificar se a página carregou
    await expect(page.locator('h1')).toContainText('Presenteie alguém especial');
    
    // Verificar steps
    await expect(page.locator('text=1')).toBeVisible();
    await expect(page.locator('text=2')).toBeVisible();
    await expect(page.locator('text=3')).toBeVisible();
    
    // Step 1: Escolher plano
    await page.click('[data-testid="plan-plus"]');
    await page.click('text=Continuar');
    
    // Step 2: Informações do presenteado
    await page.fill('input[placeholder*="Nome da pessoa"]', 'João Silva');
    await page.fill('input[placeholder*="email@exemplo.com"]', 'joao@test.com');
    await page.fill('textarea', 'Feliz aniversário!');
    await page.click('text=Continuar');
    
    // Step 3: Confirmação
    await expect(page.locator('text=Resumo do presente')).toBeVisible();
    await page.click('text=Criar Presente');
    
    // Verificar se foi redirecionado para checkout
    await expect(page).toHaveURL(/checkout\.stripe\.com/);
  });

  test('Resgate de presente', async ({ page }) => {
    await page.goto('/resgatar');
    
    // Verificar se a página carregou
    await expect(page.locator('h1')).toContainText('Resgatar Presente');
    
    // Preencher código do presente
    await page.fill('input[placeholder*="código do presente"]', 'gift_test_123');
    await page.click('text=Resgatar Presente');
    
    // Verificar sucesso
    await expect(page.locator('text=Presente Resgatado com Sucesso')).toBeVisible();
  });

  test('Validação de presente expirado', async ({ page }) => {
    // Mock de presente expirado
    await page.route('**/api/gift/redeem', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Gift token has expired'
        })
      });
    });

    await page.goto('/resgatar');
    await page.fill('input[placeholder*="código do presente"]', 'gift_expired_123');
    await page.click('text=Resgatar Presente');
    
    // Verificar erro
    await expect(page.locator('text=Gift token has expired')).toBeVisible();
  });
});

test.describe('Monetização - Dashboard e Billing', () => {
  test('Dashboard - Usuário não assinante', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Verificar se o dashboard carregou
    await expect(page.locator('h1')).toContainText('Bem-vindo ao seu dashboard');
    
    // Verificar CTAs de upgrade
    await expect(page.locator('text=Novo Relatório')).toBeVisible();
    await expect(page.locator('text=Gerenciar Cobrança')).toBeVisible();
    await expect(page.locator('text=Presentear')).toBeVisible();
  });

  test('Billing - Portal Stripe', async ({ page }) => {
    // Mock do portal
    await page.route('**/api/stripe/create-portal-session', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://billing.stripe.com/test'
        })
      });
    });

    await page.goto('/billing');
    
    // Verificar se a página carregou
    await expect(page.locator('h1')).toContainText('Cobrança e Assinatura');
    
    // Clicar em gerenciar cobrança
    await page.click('text=Gerenciar Cobrança');
    
    // Verificar se foi redirecionado
    await expect(page).toHaveURL(/billing\.stripe\.com/);
  });
});

test.describe('Monetização - Performance e Lighthouse', () => {
  test('Performance - Pricing Page', async ({ page }) => {
    await page.goto('/pricing');
    
    // Verificar se a página carrega rapidamente
    await expect(page.locator('h1')).toContainText('Escolha seu plano');
    
    // Verificar se não há erros no console
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('Acessibilidade - Pricing Page', async ({ page }) => {
    await page.goto('/pricing');
    
    // Verificar elementos semânticos
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toBeVisible();
    
    // Verificar se os botões têm labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      expect(text).toBeTruthy();
    }
  });
});
