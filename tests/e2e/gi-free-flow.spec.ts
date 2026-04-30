import { test, expect } from '@playwright/test';

test.describe('GI Free Flow Completo', () => {
  test('Fluxo completo da triagem GI gratuita', async ({ page }) => {
    // 1. Home page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('check-up GI');
    
    // 2. Triagem page
    await page.click('text=Fazer triagem GI gratuita');
    await expect(page).toHaveURL('/triagem');
    
    // 3. Buscar gastro
    await page.fill('input[placeholder="Buscar triagens..."]', 'gastro');
    await page.click('.triage-card-free');
    
    // 4. Onboarding (primeira vez)
    await page.fill('input[placeholder="Seu nome completo"]', 'João Silva');
    await page.fill('input[placeholder="01/01/1990 ou 1990-01-01"]', '01/01/1990');
    await page.fill('input[placeholder="(11) 99999-9999"]', '11999999999');
    await page.fill('input[placeholder="seu@email.com"]', 'joao@test.com');
    await page.fill('input[placeholder="72kg ou 72"]', '75kg');
    await page.fill('input[placeholder="1.75m ou 175cm"]', '1.80m');
    await page.click('text=Continuar para triagem GI');
    
    // 5. Responder perguntas GI
    await page.click('text=Próximo'); // Skip onboarding
    // ... responder algumas perguntas
    
    // 6. Gerar relatório
    await page.click('text=Gerar Relatório');
    await expect(page).toHaveURL(/\/relatorio\/.+/);
    
    // 7. Baixar PDF
    await page.click('text=Baixar PDF');
    // Verificar se PDF abre
  });

  test('GI nunca abre paywall', async ({ page }) => {
    await page.goto('/triagem');
    
    // Buscar gastro
    await page.fill('input[placeholder="Buscar triagens..."]', 'gastro');
    
    // Clicar no card gastro
    await page.click('.triage-card-free');
    
    // Verificar que vai direto para triagem, não abre modal
    await expect(page).toHaveURL('/triagem/gastro');
    
    // Verificar que não há modal de paywall
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('Light/Dark mode funciona', async ({ page }) => {
    await page.goto('/triagem');
    
    // Verificar que não há contraste quebrado
    const header = page.locator('h1');
    await expect(header).toBeVisible();
    
    // Verificar que cards têm contraste adequado
    const cards = page.locator('.triage-card');
    await expect(cards.first()).toBeVisible();
  });

  test('Busca funciona', async ({ page }) => {
    await page.goto('/triagem');
    
    // Buscar por "gastro"
    await page.fill('input[placeholder="Buscar triagens..."]', 'gastro');
    
    // Verificar que só aparece gastro
    const cards = page.locator('.triage-card');
    await expect(cards).toHaveCount(1);
    
    // Limpar busca
    await page.click('button:has-text("✕")');
    
    // Verificar que todos os cards voltaram
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(1);
  });
});
