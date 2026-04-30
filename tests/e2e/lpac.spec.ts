import { test, expect } from '@playwright/test';

test.describe('LPAC Flow', () => {
  test('should complete LPAC → Pricing → Checkout flow', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Alloe Health/);
    
    // 2. Click CTA to go to pricing
    await page.click('text=Começar meu check-up');
    await expect(page).toHaveURL(/pricing/);
    
    // 3. Verify pricing page loads
    await expect(page.locator('h1')).toContainText(/Preços/);
    
    // 4. Click subscribe button (should redirect to Stripe)
    await page.click('text=Assinar');
    
    // 5. Verify redirect to Stripe checkout
    await expect(page).toHaveURL(/checkout\.stripe\.com/);
  });

  test('should complete triage flow', async ({ page }) => {
    // 1. Visit triage page
    await page.goto('/triagem');
    await expect(page).toHaveTitle(/Triagens/);
    
    // 2. Click on a free triage
    await page.click('text=gastro');
    await expect(page).toHaveURL(/triagem\/gastro/);
    
    // 3. Complete triage steps
    await page.fill('input[name="name"]', 'Teste Usuario');
    await page.selectOption('select[name="sex"]', 'masculino');
    await page.fill('input[name="age"]', '30');
    await page.click('button[type="submit"]');
    
    // 4. Verify progress
    await expect(page.locator('[data-testid="progress"]')).toBeVisible();
  });

  test('should generate report after triage completion', async ({ page }) => {
    // This test would require a completed triage session
    // For now, just verify the report page structure
    await page.goto('/relatorio/demo');
    await expect(page).toHaveTitle(/Relatório/);
    
    // Verify report sections are present
    await expect(page.locator('text=Resumo')).toBeVisible();
    await expect(page.locator('text=Plano de Ação')).toBeVisible();
  });
});
