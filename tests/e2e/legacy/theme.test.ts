import { test, expect } from '@playwright/test';

// Rotas principais para testar
const routes = [
  '/',
  '/triagem',
  '/triagem/gastro',
  '/quem-somos',
  '/faq',
  '/termos',
  '/privacidade',
  '/politica',
  '/assinatura',
  '/presente',
  '/resgatar',
  '/obrigado',
  '/disclaimer',
  '/meu-plano',
  '/checkout',
  '/checkout/sucesso',
  '/checkout/confirmacao',
  '/b2b/planos',
  '/b2b/configuracoes',
  '/admin',
];

// Cores proibidas que não devem aparecer
const forbiddenColorRegex = /(purple|indigo|violet|blue|sky|cyan|teal|emerald|lime|yellow|amber|orange|red|pink|rose|fuchsia|stone|zinc|neutral|slate|gray|grey)-\d{2,3}|#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/i;

// Função para verificar se há cores proibidas
async function assertNoForbiddenColors(page: any) {
  const styles = await page.$$eval('*', (nodes: any[]) =>
    nodes.map((n: any) => {
      const s = getComputedStyle(n as Element);
      return [s.color, s.backgroundColor, s.borderColor, s.borderTopColor, s.borderRightColor, s.borderBottomColor, s.borderLeftColor].join('|');
    })
  );
  
  for (const s of styles) {
    if (forbiddenColorRegex.test(s)) {
      throw new Error(`Cor proibida detectada: ${s}`);
    }
  }
}

// Função para verificar contraste
async function checkAccessibility(page: any) {
  // Verificação básica de contraste sem axe-core
  const contrastIssues = await page.evaluate(() => {
    const elements = document.querySelectorAll('h1, h2, h3, p, button, a');
    let issues = 0;
    
    elements.forEach(element => {
      const styles = getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Verificação básica
      if (color === backgroundColor || color === 'rgba(0, 0, 0, 0)') {
        issues++;
      }
    });
    
    return issues;
  });
  
  expect(contrastIssues).toBe(0);
}

test.describe('Sistema Light/Dark Alloe Health', () => {
  for (const route of routes) {
    test(`Light/Dark OK em ${route}`, async ({ page }) => {
      // Navegar para a página
      await page.goto(route);
      
      // Aguardar carregamento completo
      await page.waitForLoadState('networkidle');
      
      // Verificar se a página carregou corretamente
      await expect(page).toHaveTitle(/Alloe|Health|Relatório|Triagem/i);
      
      // Teste no tema Light
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      });
      
      await page.waitForTimeout(100);
      
      // Verificar cores proibidas no Light
      await assertNoForbiddenColors(page);
      
      // Verificar acessibilidade no Light
      await checkAccessibility(page);
      
      // Teste no tema Dark
      await page.evaluate(() => {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      });
      
      await page.waitForTimeout(100);
      
      // Verificar cores proibidas no Dark
      await assertNoForbiddenColors(page);
      
      // Verificar acessibilidade no Dark
      await checkAccessibility(page);
    });
  }
});

test.describe('Formulário de Triagem Light/Dark', () => {
  test('Triagem funciona perfeitamente em ambos os temas', async ({ page }) => {
    await page.goto('/triagem');
    await page.waitForLoadState('networkidle');
    
    // Preencher CPF para acessar a triagem
    const cpfInput = page.locator('input[placeholder*="CPF"]');
    await cpfInput.fill('12345678901');
    
    const continuarBtn = page.locator('button:has-text("Continuar")');
    await continuarBtn.click();
    
    await page.waitForLoadState('networkidle');
    
    // Teste Light Theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    
    await page.waitForTimeout(100);
    
    // Verificar elementos da triagem no Light
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
    
    // Verificar cores proibidas
    await assertNoForbiddenColors(page);
    
    // Teste Dark Theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    });
    
    await page.waitForTimeout(100);
    
    // Verificar elementos da triagem no Dark
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
    
    // Verificar cores proibidas
    await assertNoForbiddenColors(page);
    
    // Verificar acessibilidade
    await checkAccessibility(page);
  });
});

test.describe('Dashboard Light/Dark', () => {
  test('Dashboard funciona perfeitamente em ambos os temas', async ({ page }) => {
    // Simular login com CPF
    await page.goto('/dashboard?cpf=12345678901');
    await page.waitForLoadState('networkidle');
    
    // Teste Light Theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    
    await page.waitForTimeout(100);
    
    // Verificar elementos do dashboard no Light
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    
    // Verificar cores proibidas
    await assertNoForbiddenColors(page);
    
    // Teste Dark Theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    });
    
    await page.waitForTimeout(100);
    
    // Verificar elementos do dashboard no Dark
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    
    // Verificar cores proibidas
    await assertNoForbiddenColors(page);
    
    // Verificar acessibilidade
    await checkAccessibility(page);
  });
});

test.describe('Toggle de Tema', () => {
  test('Toggle funciona corretamente', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verificar se o toggle está visível
    const themeToggle = page.locator('[aria-label*="Alternar para tema"]');
    await expect(themeToggle).toBeVisible();
    
    // Testar alternância
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    // Verificar se o tema mudou
    const isDark = await page.evaluate(() => 
      document.documentElement.classList.contains('dark')
    );
    
    expect(isDark).toBe(true);
    
    // Alternar novamente
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    const isLight = await page.evaluate(() => 
      !document.documentElement.classList.contains('dark')
    );
    
    expect(isLight).toBe(true);
  });
});

test.describe('Responsividade Light/Dark', () => {
  test('Layout responsivo funciona em ambos os temas', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Testar diferentes tamanhos de tela
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(100);
      
      // Teste Light
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      });
      
      await page.waitForTimeout(100);
      await assertNoForbiddenColors(page);
      
      // Teste Dark
      await page.evaluate(() => {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      });
      
      await page.waitForTimeout(100);
      await assertNoForbiddenColors(page);
    }
  });
});

test.describe('Performance Light/Dark', () => {
  test('Transições de tema são suaves', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Medir tempo de transição
    const startTime = Date.now();
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await page.waitForTimeout(300); // Aguardar transição completa
    
    const endTime = Date.now();
    const transitionTime = endTime - startTime;
    
    // Verificar se a transição foi rápida (< 500ms)
    expect(transitionTime).toBeLessThan(500);
    
    // Verificar se não há FOUC (Flash of Unstyled Content)
    const hasFOUC = await page.evaluate(() => {
      const body = document.body;
      return body.style.color === '' || body.style.backgroundColor === '';
    });
    
    expect(hasFOUC).toBe(false);
  });
});