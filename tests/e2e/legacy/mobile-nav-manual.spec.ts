import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation - Manual Test', () => {
  test('deve carregar página dashboard e verificar elementos mobile', async ({ page }) => {
    // Configurar viewport mobile
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Mock GA4
    await page.addInitScript(() => {
      window.gtag = () => {};
    });
    
    // Navegar para dashboard
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar se elementos mobile estão presentes
    const mobileLayout = page.locator('.mobile-main');
    await expect(mobileLayout).toBeVisible();
    
    // Verificar se top bar está presente
    const topBar = page.locator('header[role="navigation"]');
    await expect(topBar).toBeVisible();
    
    // Verificar se bottom bar está presente
    const bottomBar = page.locator('nav[aria-label="Navegação inferior"]');
    await expect(bottomBar).toBeVisible();
    
    // Verificar tabs
    await expect(page.locator('[data-testid="tab-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-triagens"]')).toBeVisible();
    
    console.log('✅ Mobile navigation está funcionando!');
  });
});
