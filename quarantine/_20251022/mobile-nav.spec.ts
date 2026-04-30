import { test, expect } from '@playwright/test';

test.describe('Mobile navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/dashboard');
  });

  test('Bottom bar navega entre as 4 rotas', async ({ page }) => {
    // Test Dashboard
    await page.getByTestId('tab-dashboard').click();
    await expect(page).toHaveURL(/\/(dashboard|)$/);

    // Test Triagens
    await page.getByTestId('tab-triagens').click();
    await expect(page).toHaveURL(/\/triagem/);

    // Test Relatórios
    await page.getByTestId('tab-relatórios').click();
    await expect(page).toHaveURL(/\/relatorios/);

    // Test Perfil
    await page.getByTestId('tab-perfil').click();
    await expect(page.url()).toMatch(/\/(perfil|dashboard\/perfil)/);
  });

  test('Hambúrguer abre drawer e navega', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Abre o drawer
    await page.getByRole('button', { name: /abrir menu/i }).click();
    
    // Verifica se o drawer está visível
    await expect(page.locator('text=Menu')).toBeVisible();
    
    // Clica em Relatórios no drawer
    await page.locator('text=Relatórios').click();
    
    // Verifica se navegou para relatórios
    await expect(page).toHaveURL(/\/relatorios/);
    
    // Verifica se o drawer fechou
    await expect(page.locator('text=Menu')).not.toBeVisible();
  });

  test('Estado ativo é destacado corretamente', async ({ page }) => {
    // Vai para triagem
    await page.goto('http://localhost:3000/triagem');
    
    // Verifica se o ícone de Triagens está ativo
    const triagensTab = page.getByTestId('tab-triagens');
    await expect(triagensTab).toHaveClass(/from-brand/);
    
    // Vai para dashboard
    await page.getByTestId('tab-dashboard').click();
    await expect(page).toHaveURL(/\/(dashboard|)$/);
    
    // Verifica se o ícone de Dashboard está ativo
    const dashboardTab = page.getByTestId('tab-dashboard');
    await expect(dashboardTab).toHaveClass(/from-brand/);
  });

  test('Navegação funciona em todas as páginas', async ({ page }) => {
    const pages = [
      { url: '/dashboard', tab: 'tab-dashboard' },
      { url: '/triagem', tab: 'tab-triagens' },
      { url: '/relatorios', tab: 'tab-relatórios' },
      { url: '/perfil', tab: 'tab-perfil' }
    ];

    for (const { url, tab } of pages) {
      await page.goto(`http://localhost:3000${url}`);
      
      // Testa navegação para outras páginas
      const otherTabs = pages.filter(p => p.tab !== tab);
      
      for (const otherPage of otherTabs.slice(0, 2)) { // Testa apenas 2 para não demorar muito
        await page.getByTestId(otherPage.tab).click();
        await expect(page).toHaveURL(new RegExp(otherPage.url.replace('/', '\\/')));
      }
    }
  });

  test('Drawer fecha ao clicar no backdrop', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Abre o drawer
    await page.getByRole('button', { name: /abrir menu/i }).click();
    
    // Verifica se está aberto
    await expect(page.locator('text=Menu')).toBeVisible();
    
    // Clica no backdrop (área escura)
    await page.locator('.fixed.inset-0').first().click();
    
    // Verifica se fechou
    await expect(page.locator('text=Menu')).not.toBeVisible();
  });

  test('Drawer fecha ao clicar no X', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Abre o drawer
    await page.getByRole('button', { name: /abrir menu/i }).click();
    
    // Verifica se está aberto
    await expect(page.locator('text=Menu')).toBeVisible();
    
    // Clica no X
    await page.getByRole('button', { name: /fechar menu/i }).click();
    
    // Verifica se fechou
    await expect(page.locator('text=Menu')).not.toBeVisible();
  });
});
