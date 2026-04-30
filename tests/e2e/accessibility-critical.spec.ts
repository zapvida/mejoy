import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests - P0 Critical', () => {
  
  test('axe: 0 críticos em /triagem', async ({ page }) => {
    await page.goto('/triagem/gastro');
    
    // Aguardar carregamento completo
    await page.waitForSelector('[data-testid="triage-form"]');
    
    // Executar teste de acessibilidade
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // Verificar que não há violações críticas
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical' || violation.impact === 'serious'
    );
    
    expect(criticalViolations).toHaveLength(0);
    
    // Log das violações menores (se houver)
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Violações de acessibilidade encontradas:');
      accessibilityScanResults.violations.forEach(violation => {
        console.log(`- ${violation.id}: ${violation.description} (${violation.impact})`);
      });
    }
  });

  test('axe: 0 críticos em /relatorio/[id]', async ({ page }) => {
    await page.goto('/relatorio/demo');
    
    // Aguardar carregamento completo
    await page.waitForSelector('[data-testid="report-content"]');
    
    // Executar teste de acessibilidade
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // Verificar que não há violações críticas
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical' || violation.impact === 'serious'
    );
    
    expect(criticalViolations).toHaveLength(0);
  });

  test('axe: 0 críticos em /pricing', async ({ page }) => {
    await page.goto('/pricing');
    
    // Aguardar carregamento completo
    await page.waitForSelector('[data-testid="pricing-container"]');
    
    // Executar teste de acessibilidade
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // Verificar que não há violações críticas
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical' || violation.impact === 'serious'
    );
    
    expect(criticalViolations).toHaveLength(0);
  });

  test('axe: 0 críticos em /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Aguardar carregamento completo
    await page.waitForSelector('[data-testid="dashboard-container"]');
    
    // Executar teste de acessibilidade
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // Verificar que não há violações críticas
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical' || violation.impact === 'serious'
    );
    
    expect(criticalViolations).toHaveLength(0);
  });

  test('navegação por teclado funciona', async ({ page }) => {
    await page.goto('/triagem/gastro');
    
    // Testar navegação por teclado
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verificar se o foco está visível
    const focusedElement = await page.evaluate(() => document.activeElement);
    expect(focusedElement).not.toBeNull();
    
    // Testar Enter para avançar
    await page.keyboard.press('Enter');
    
    // Verificar se avançou para próxima etapa
    await expect(page.locator('[data-testid="triage-step-2"]')).toBeVisible();
  });

  test('screen reader friendly', async ({ page }) => {
    await page.goto('/triagem/gastro');
    
    // Verificar elementos com aria-labels
    const elementsWithAriaLabels = await page.locator('[aria-label]').count();
    expect(elementsWithAriaLabels).toBeGreaterThan(0);
    
    // Verificar headings hierárquicos
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBeGreaterThan(0);
    
    // Verificar alt text em imagens
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('contraste adequado', async ({ page }) => {
    await page.goto('/triagem/gastro');
    
    // Executar teste específico de contraste
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();
    
    // Verificar que não há problemas de contraste
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(contrastViolations).toHaveLength(0);
  });
});
