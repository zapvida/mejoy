import { test, expect } from '@playwright/test';

test.describe('Busca Inteligente - Teste Simples', () => {
  test('deve carregar a página de triagens corretamente', async ({ page }) => {
    await page.goto('/triagem');
    
    // Verificar se a página carregou
    await expect(page.locator('h1')).toContainText('Triagens');
    
    // Verificar se o campo de busca está presente
    const searchInput = page.locator('input[placeholder="Buscar triagens..."]');
    await expect(searchInput).toBeVisible();
    
    // Verificar se há triagens sendo exibidas
    const triageCards = page.locator('[data-testid^="triage-card-"]');
    await expect(triageCards.first()).toBeVisible();
  });

  test('deve permitir digitar no campo de busca', async ({ page }) => {
    await page.goto('/triagem');
    
    const searchInput = page.locator('input[placeholder="Buscar triagens..."]');
    
    // Digitar algo na busca
    await searchInput.fill('teste');
    
    // Verificar se o valor foi inserido
    await expect(searchInput).toHaveValue('teste');
  });

  test('deve limpar busca quando clicar no X', async ({ page }) => {
    await page.goto('/triagem');
    
    const searchInput = page.locator('input[placeholder="Buscar triagens..."]');
    
    // Digitar algo na busca
    await searchInput.fill('teste');
    
    // Clicar no botão de limpar
    const clearButton = page.locator('button[aria-label="Limpar busca"]');
    await clearButton.click();
    
    // Verificar se o campo foi limpo
    await expect(searchInput).toHaveValue('');
  });
});
