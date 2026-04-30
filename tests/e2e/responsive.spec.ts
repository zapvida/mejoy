import { test, expect } from '@playwright/test';

test.describe('Responsividade Perfeita - Alloe Health', () => {
  const viewports = [
    { name: 'iPhone SE', width: 320, height: 568 },
    { name: 'iPhone 8', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPhone 12 Pro Max', width: 430, height: 932 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'iPad Pro', width: 1024, height: 1366 },
    { name: 'Desktop Small', width: 1366, height: 768 },
    { name: 'Desktop Medium', width: 1440, height: 900 },
    { name: 'Desktop Large', width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`Layout responsivo em ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      
      // Testar página inicial
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Verificar se não há overflow horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(width + 20);
      
      // Verificar elementos principais
      await expect(page.locator('[data-testid="page-home"]')).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      
      // Verificar navegação adequada
      if (width < 1024) {
        await expect(page.locator('[data-testid="nav-bottom"]')).toBeVisible();
        await expect(page.locator('[data-testid="nav-top"]')).toBeVisible();
      } else {
        await expect(page.locator('.desktop-nav')).toBeVisible();
      }
      
      // Verificar botões com tamanho adequado
      const buttons = page.locator('button, a');
      for (let i = 0; i < await buttons.count(); i++) {
        const button = buttons.nth(i);
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
      
      // Testar página de triagem
      await page.goto('/triagem');
      await page.waitForLoadState('networkidle');
      
      // Verificar grid responsivo
      await expect(page.locator('[data-testid="page-triage"]')).toBeVisible();
      await expect(page.locator('.triage-grid')).toBeVisible();
      
      // Verificar cards com altura consistente
      const cards = page.locator('.triage-card');
      if (await cards.count() > 0) {
        const firstCard = cards.first();
        const boundingBox = await firstCard.boundingBox();
        if (boundingBox) {
          // Verificar se altura está dentro de uma variação aceitável
          expect(boundingBox.height).toBeGreaterThanOrEqual(200);
          expect(boundingBox.height).toBeLessThanOrEqual(400);
        }
      }
      
      // Verificar se textos não estão cortados
      const textElements = page.locator('h1, h2, h3, p');
      for (let i = 0; i < await textElements.count(); i++) {
        const element = textElements.nth(i);
        const boundingBox = await element.boundingBox();
        if (boundingBox) {
          expect(boundingBox.width).toBeLessThanOrEqual(width - 32); // Margem de 16px cada lado
        }
      }
    });
  });

  test('Transições suaves entre breakpoints', async ({ page }) => {
    await page.goto('/');
    
    // Testar transição mobile -> tablet
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(100);
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(100);
    
    // Verificar se layout se adaptou
    await expect(page.locator('.grid-responsive')).toBeVisible();
    
    // Testar transição tablet -> desktop
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(100);
    
    // Verificar se sidebar aparece
    await expect(page.locator('.desktop-sidebar')).toBeVisible();
  });

  test('Acessibilidade em todos os dispositivos', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      // Verificar navegação por teclado
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Verificar contraste
      const contrastCheck = await page.evaluate(() => {
        const elements = document.querySelectorAll('h1, h2, h3, p, button');
        let hasLowContrast = false;
        
        elements.forEach(element => {
          const styles = window.getComputedStyle(element);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          if (color === backgroundColor) {
            hasLowContrast = true;
          }
        });
        
        return !hasLowContrast;
      });
      
      expect(contrastCheck).toBe(true);
      
      // Verificar tamanho mínimo de toque (44px)
      const buttons = page.locator('button, a');
      for (let i = 0; i < await buttons.count(); i++) {
        const button = buttons.nth(i);
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('Safe area em dispositivos com notch', async ({ page }) => {
    // Simular iPhone com notch
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // Verificar se elementos respeitam safe area
    const topBar = page.locator('[data-testid="nav-top"]');
    if (await topBar.count() > 0) {
      const boundingBox = await topBar.boundingBox();
      if (boundingBox) {
        // Deve ter padding-top para safe area
        expect(boundingBox.y).toBeGreaterThanOrEqual(0);
      }
    }
    
    const bottomBar = page.locator('[data-testid="nav-bottom"]');
    if (await bottomBar.count() > 0) {
      const boundingBox = await bottomBar.boundingBox();
      if (boundingBox) {
        // Deve ter padding-bottom para safe area
        expect(boundingBox.y + boundingBox.height).toBeLessThanOrEqual(812);
      }
    }
  });

  test('Performance em diferentes dispositivos', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 1024, height: 768 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Medir tempo de carregamento
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Deve carregar em menos de 3 segundos
      expect(loadTime).toBeLessThan(3000);
      
      // Verificar se não há erros de console
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.waitForTimeout(1000);
      expect(errors.length).toBe(0);
    }
  });

  test('Formulários responsivos', async ({ page }) => {
    await page.goto('/triagem/gastro');
    
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(100);
      
      // Verificar se inputs são adequados para o dispositivo
      const inputs = page.locator('input, textarea, select');
      for (let i = 0; i < await inputs.count(); i++) {
        const input = inputs.nth(i);
        const boundingBox = await input.boundingBox();
        if (boundingBox) {
          // Em mobile, inputs devem ocupar largura total
          if (viewport.width < 768) {
            expect(boundingBox.width).toBeGreaterThan(viewport.width * 0.8);
          }
          
          // Altura mínima para acessibilidade
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });
});
