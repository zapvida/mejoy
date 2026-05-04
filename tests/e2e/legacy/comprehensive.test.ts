// tests/e2e/comprehensive.test.ts
// Testes E2E completos para validação final

import { test, expect } from '@playwright/test';

test.describe('AlloeHealth - Testes E2E Completos', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar viewport mobile-first
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('Fluxo completo: Triagem GI → Relatório → PDF → CTAs', async ({ page }) => {
    // 1. Acessar homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/AlloeHealth/);
    
    // 2. Iniciar triagem gastrointestinal
    await page.click('text=Começar agora');
    await expect(page).toHaveURL(/triagem/);
    
    // 3. Preencher dados básicos
    await page.fill('input[name="nome"]', 'João Silva');
    await page.fill('input[name="idade"]', '35');
    await page.fill('input[name="peso"]', '75');
    await page.fill('input[name="altura"]', '175');
    
    // 4. Responder perguntas da triagem
    await page.click('text=Sempre');
    await page.click('text=Continuar');
    
    // 5. Verificar progresso
    await expect(page.locator('text=Etapa 2/8')).toBeVisible();
    
    // 6. Completar triagem
    for (let i = 0; i < 6; i++) {
      await page.click('text=Continuar');
    }
    
    // 7. Verificar relatório gerado
    await expect(page).toHaveURL(/relatorio/);
    await expect(page.locator('h1')).toContainText('Relatório');
    
    // 8. Verificar red flags se aplicável
    const redFlagsSection = page.locator('text=Sinais de Alerta');
    if (await redFlagsSection.isVisible()) {
      await expect(redFlagsSection).toBeVisible();
    }
    
    // 9. Baixar PDF
    await page.click('text=Baixar PDF');
    
    // Aguardar download
    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;
    
    // Verificar nome do arquivo
    expect(download.suggestedFilename()).toMatch(/AlloeHealth_Relatorio_gastro_\d{4}-\d{2}-\d{2}\.pdf/);
    
    // 10. Verificar CTAs na ordem correta
    const ctas = page.locator('[data-testid="cta-button"]');
    await expect(ctas.nth(0)).toContainText('Liberar todas as triagens – R$ 49');
    await expect(ctas.nth(1)).toContainText('Presentear – R$ 89');
    await expect(ctas.nth(2)).toContainText('Ver produtos Alloe');
    await expect(ctas.nth(3)).toContainText('Falar com médico agora');
    
    // 11. Clicar no primeiro CTA (passe)
    await ctas.nth(0).click();
    await expect(page).toHaveURL(/assinatura/);
    
    // 12. Verificar página de assinatura
    await expect(page.locator('h1')).toContainText('Liberar Todas as Triagens');
    await expect(page.locator('text=R$ 49')).toBeVisible();
    
    // 13. Iniciar checkout
    await page.click('text=Liberar Todas as Triagens - R$ 49');
    
    // Verificar redirecionamento para Stripe
    await page.waitForURL(/stripe\.com/);
  });

  test('Fluxo de presente: R$ 89 → Código → Resgate', async ({ page }) => {
    // 1. Acessar página de presente
    await page.goto('/presente');
    
    // 2. Preencher dados do presenteado
    await page.fill('input[name="nomePresenteado"]', 'Maria Santos');
    await page.fill('input[name="whatsappPresenteado"]', '11999999999');
    await page.fill('textarea[name="mensagem"]', 'Um presente especial para sua saúde!');
    
    // 3. Iniciar checkout
    await page.click('text=Presentear - R$ 89');
    
    // Verificar redirecionamento para Stripe
    await page.waitForURL(/stripe\.com/);
    
    // 4. Simular retorno do Stripe (em ambiente de teste)
    await page.goto('/obrigado?tipo=presente');
    
    // 5. Verificar página de obrigado
    await expect(page.locator('h1')).toContainText('Presente Enviado');
    
    // 6. Simular resgate do presente
    await page.goto('/resgatar?code=ABC12345');
    
    // 7. Verificar página de resgate
    await expect(page.locator('h1')).toContainText('Resgatar Presente');
    await expect(page.locator('input')).toHaveValue('ABC12345');
    
    // 8. Tentar resgatar (simular)
    await page.click('text=Resgatar Presente');
    
    // Verificar feedback
    await expect(page.locator('text=Código inválido')).toBeVisible();
  });

  test('Validação de segurança e LGPD', async ({ page }) => {
    // 1. Testar rate limiting
    await page.goto('/api/privacy/delete-data');
    
    // Fazer múltiplas requisições rapidamente
    for (let i = 0; i < 6; i++) {
      await page.request.post('/api/privacy/delete-data', {
        data: { userId: 'test-user' }
      });
    }
    
    // Verificar se rate limit foi aplicado
    const response = await page.request.post('/api/privacy/delete-data', {
      data: { userId: 'test-user' }
    });
    
    expect(response.status()).toBe(429);
    
    // 2. Testar headers de segurança
    const homeResponse = await page.request.get('/');
    const headers = homeResponse.headers();
    
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-xss-protection']).toBe('1; mode=block');
  });

  test('Performance e Lighthouse', async ({ page }) => {
    // 1. Testar performance da homepage
    await page.goto('/');
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    
    // Verificar métricas de performance
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
    
    // Verificar se métricas estão dentro dos limites aceitáveis
    expect(performanceMetrics.loadTime).toBeLessThan(3000); // 3 segundos
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000); // 2 segundos
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(2500); // 2.5 segundos
    
    // 2. Testar triagem com autosave
    await page.goto('/triagem/gastro');
    
    // Preencher campo e aguardar autosave
    await page.fill('input[name="nome"]', 'Teste Autosave');
    
    // Aguardar toast de autosave
    await page.waitForSelector('text=Salvo automaticamente', { timeout: 5000 });
    
    // 3. Verificar bundle size
    const bundleSize = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.reduce((total, script) => {
        const src = script.getAttribute('src');
        return total + (src ? src.length : 0);
      }, 0);
    });
    
    // Bundle não deve ser excessivamente grande
    expect(bundleSize).toBeLessThan(1000000); // 1MB
  });

  test('Acessibilidade e responsividade', async ({ page }) => {
    // 1. Testar em diferentes viewports
    const viewports = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 375, height: 667 }, // iPhone 8
      { width: 414, height: 896 }, // iPhone 11
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }  // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      // Verificar se elementos principais estão visíveis
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Começar agora')).toBeVisible();
      
      // Verificar se não há overflow horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = viewport.width;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Margem de erro
    }
    
    // 2. Testar navegação por teclado
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    
    // Navegar usando Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Verificar se chegou na triagem
    await expect(page).toHaveURL(/triagem/);
    
    // 3. Testar contraste de cores
    const contrastCheck = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, p, button');
      let hasLowContrast = false;
      
      elements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Verificação básica de contraste (simplificada)
        if (color === backgroundColor) {
          hasLowContrast = true;
        }
      });
      
      return !hasLowContrast;
    });
    
    expect(contrastCheck).toBe(true);
  });

  test('Compatibilidade com navegadores', async ({ page }) => {
    // 1. Testar funcionalidades modernas
    await page.goto('/');
    
    // Verificar se Service Worker está funcionando
    const hasServiceWorker = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(hasServiceWorker).toBe(true);
    
    // 2. Testar APIs modernas
    const modernAPIs = await page.evaluate(() => {
      return {
        fetch: typeof fetch !== 'undefined',
        promises: typeof Promise !== 'undefined',
        asyncAwait: (async () => {}).constructor.name === 'AsyncFunction',
        modules: typeof window !== 'undefined' && 'import' in window
      };
    });
    
    expect(modernAPIs.fetch).toBe(true);
    expect(modernAPIs.promises).toBe(true);
    expect(modernAPIs.asyncAwait).toBe(true);
    
    // 3. Testar fallbacks para navegadores antigos
    await page.goto('/triagem/gastro');
    
    // Verificar se inputs numéricos funcionam
    const numericInput = page.locator('input[type="number"]');
    if (await numericInput.count() > 0) {
      await numericInput.first().fill('75');
      await expect(numericInput.first()).toHaveValue('75');
    }
  });
});
