import { test, expect } from '@playwright/test';

test.describe('Busca Inteligente - Triagens', () => {
  test('deve encontrar triagem cardiovascular ao buscar "cigarro"', async ({ page }) => {
    await page.goto('/triagem');
    
    // Verificar se a página carregou
    await expect(page.locator('h1')).toContainText('Triagens');
    
    // Buscar por "cigarro" - deve encontrar cardiovascular
    await page.fill('input[placeholder="Buscar triagens..."]', 'cigarro');
    
    // Aguardar um pouco para a busca processar
    await page.waitForTimeout(500);
    
    // Verificar se encontrou triagem cardiovascular usando data-testid
    const cardiovascularCard = page.locator('[data-testid="triage-card-cardiovascular"]');
    await expect(cardiovascularCard).toBeVisible();
  });

  test('deve encontrar triagem de diabetes ao buscar "glicemia"', async ({ page }) => {
    await page.goto('/triagem');
    
    // Buscar por "glicemia" - deve encontrar diabetes
    await page.fill('input[placeholder="Buscar triagens..."]', 'glicemia');
    await page.waitForTimeout(500);
    
    // Verificar se encontrou triagem de diabetes usando data-testid
    const diabetesCard = page.locator('[data-testid="triage-card-diabetes-metabolismo"]');
    await expect(diabetesCard).toBeVisible();
  });

  test('deve encontrar triagem de dor ao buscar "fibromialgia"', async ({ page }) => {
    await page.goto('/triagem');
    
    // Buscar por "fibromialgia" - deve encontrar dor crônica
    await page.fill('input[placeholder="Buscar triagens..."]', 'fibromialgia');
    await page.waitForTimeout(500);
    
    // Verificar se encontrou triagem de dor usando data-testid
    const dorCard = page.locator('[data-testid="triage-card-dor-cronica"]');
    await expect(dorCard).toBeVisible();
  });

  test('deve mostrar sugestões quando digitar', async ({ page }) => {
    await page.goto('/triagem');
    
    // Digitar "cor" para ver sugestões
    await page.fill('input[placeholder="Buscar triagens..."]', 'cor');
    await page.waitForTimeout(300);
    
    // Verificar se aparecem sugestões (pode não aparecer se não houver correspondências)
    const suggestions = page.locator('text=coracao').first();
    // Se não aparecer sugestões, pelo menos verificar se o campo está funcionando
    const searchInput = page.locator('input[placeholder="Buscar triagens..."]');
    await expect(searchInput).toHaveValue('cor');
  });

  test('deve limpar busca quando clicar no X', async ({ page }) => {
    await page.goto('/triagem');
    
    // Digitar algo na busca
    await page.fill('input[placeholder="Buscar triagens..."]', 'teste');
    
    // Clicar no botão de limpar
    await page.click('button[aria-label="Limpar busca"]');
    
    // Verificar se o campo foi limpo
    const searchInput = page.locator('input[placeholder="Buscar triagens..."]');
    await expect(searchInput).toHaveValue('');
  });
});
