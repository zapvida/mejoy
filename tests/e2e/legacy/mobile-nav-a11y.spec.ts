import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation Accessibility', () => {
  test('deve passar nos testes de acessibilidade do Axe', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/dashboard');
    
    // Executar testes de acessibilidade
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // Verificar se não há violações críticas
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('deve ter navegação por teclado funcional', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/dashboard');
    
    // Navegar por teclado através das tabs
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verificar se foco está visível
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Ativar com Enter
    await page.keyboard.press('Enter');
    
    // Verificar se navegou
    await expect(page).toHaveURL(/\/triagem/);
  });

  test('deve respeitar prefers-reduced-motion', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Simular preferência de movimento reduzido
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/dashboard');
    
    // Verificar se animações foram desabilitadas
    const tab = page.locator('[data-testid="tab-triagens"]');
    const computedStyle = await tab.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        transitionDuration: style.transitionDuration,
        animationDuration: style.animationDuration
      };
    });
    
    expect(computedStyle.transitionDuration).toBe('0s');
    expect(computedStyle.animationDuration).toBe('0s');
  });
});
