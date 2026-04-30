// tests/e2e/accessibility.test.ts
// Testes de acessibilidade básicos

import { test, expect } from '@playwright/test';

test.describe('Acessibilidade - Testes Básicos', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('Homepage - Verificações básicas de acessibilidade', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se há elementos semânticos
    await expect(page.locator('h1')).toBeVisible();
    
    // Verificar se há navegação
    const nav = page.locator('nav').or(page.locator('[role="navigation"]'));
    await expect(nav).toBeVisible();
    
    // Verificar se há botões com texto descritivo
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Verificar se todos os botões têm texto
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });

  test('Triagem Gastro - Verificações básicas', async ({ page }) => {
    await page.goto('/triagem/gastro');
    
    // Verificar elementos semânticos
    await expect(page.locator('h1')).toBeVisible();
    
    // Verificar se há labels nos inputs
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      } else if (name) {
        const label = page.locator(`label:has-text("${name}")`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('Relatório - Verificações básicas', async ({ page }) => {
    await page.goto('/relatorio/test-id');
    
    // Verificar elementos semânticos
    await expect(page.locator('h1')).toBeVisible();
    
    // Verificar se há estrutura de headings
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test('Assinatura - Verificações básicas', async ({ page }) => {
    await page.goto('/assinatura');
    
    // Verificar elementos semânticos
    await expect(page.locator('h1')).toBeVisible();
    
    // Verificar se há botões com texto descritivo
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('Presente - Verificações básicas', async ({ page }) => {
    await page.goto('/presente');
    
    // Verificar elementos semânticos
    await expect(page.locator('h1')).toBeVisible();
    
    // Verificar se há formulário acessível
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('Foco visível e navegação por teclado', async ({ page }) => {
    await page.goto('/');
    
    // Testar navegação por teclado
    await page.keyboard.press('Tab');
    
    // Verificar se o foco é visível
    const focusedElement = await page.evaluate(() => document.activeElement);
    expect(focusedElement).not.toBeNull();
    
    // Verificar se há indicador visual de foco
    const focusStyles = await page.evaluate(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (!activeElement) return null;
      
      const styles = window.getComputedStyle(activeElement);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        outlineColor: styles.outlineColor
      };
    });
    
    expect(focusStyles?.outlineWidth).not.toBe('0px');
    expect(focusStyles?.outlineStyle).not.toBe('none');
  });

  test('Labels e aria-describedby nos erros', async ({ page }) => {
    await page.goto('/triagem/gastro');
    
    // Preencher formulário com dados inválidos
    await page.fill('input[name="email"]', 'email-invalido');
    await page.fill('input[name="whatsapp"]', '123');
    
    // Submeter formulário
    await page.click('text=Continuar');
    
    // Verificar se há labels associados aos inputs
    const emailInput = page.locator('input[name="email"]');
    const emailLabel = page.locator('label[for="email"]').or(page.locator('label:has-text("E-mail")'));
    await expect(emailLabel).toBeVisible();
    
    // Verificar se há aria-describedby para erros
    const emailError = page.locator('text=E-mail inválido');
    if (await emailError.isVisible()) {
      const ariaDescribedBy = await emailInput.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toBeTruthy();
    }
  });

  test('Contraste básico', async ({ page }) => {
    await page.goto('/');
    
    // Verificar contraste de elementos principais
    const contrastCheck = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, p, button, a');
      let lowContrastElements: string[] = [];
      
      elements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Verificação básica de contraste (simplificada)
        if (color === backgroundColor || color === 'rgba(0, 0, 0, 0)') {
          lowContrastElements.push(element.tagName);
        }
      });
      
      return lowContrastElements;
    });
    
    expect(contrastCheck).toHaveLength(0);
  });

  test('Alt text em imagens', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se todas as imagens têm alt text
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('Estrutura semântica', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se há elementos semânticos apropriados
    const headingStructure = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headings).map(h => ({
        tag: h.tagName,
        text: h.textContent?.trim(),
        level: parseInt(h.tagName.charAt(1))
      }));
    });
    
    // Verificar se há pelo menos um h1
    expect(headingStructure.some(h => h.tag === 'H1')).toBe(true);
    
    // Verificar se a hierarquia de headings está correta
    let previousLevel = 0;
    for (const heading of headingStructure) {
      if (heading.level > previousLevel + 1) {
        throw new Error(`Heading level ${heading.level} follows level ${previousLevel}`);
      }
      previousLevel = heading.level;
    }
  });

  test('Formulários acessíveis', async ({ page }) => {
    await page.goto('/triagem/gastro');
    
    // Verificar se todos os inputs têm labels
    const inputs = await page.locator('input, textarea, select').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      } else if (name) {
        const label = page.locator(`label:has-text("${name}")`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('Navegação por teclado completa', async ({ page }) => {
    await page.goto('/');
    
    // Testar navegação completa por teclado
    const tabOrder = [];
    
    // Primeiro Tab
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    tabOrder.push(focusedElement);
    
    // Continuar navegando
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      if (focusedElement && !tabOrder.includes(focusedElement)) {
        tabOrder.push(focusedElement);
      }
    }
    
    // Verificar se conseguiu navegar por elementos interativos
    expect(tabOrder.length).toBeGreaterThan(3);
    expect(tabOrder).toContain('BUTTON');
    expect(tabOrder).toContain('A');
  });
});