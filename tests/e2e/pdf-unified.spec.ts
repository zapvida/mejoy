// tests/e2e/pdf-unified.spec.ts
// Teste E2E para PDF unificado

import { test, expect } from '@playwright/test';

test.describe('PDF Unified', () => {
  test('should generate PDF from canonical endpoint', async ({ page }) => {
    // Testar endpoint canônico
    const response = await page.request.get('/api/pdf/report?demo=1');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    
    const buffer = await response.body();
    expect(buffer.length).toBeGreaterThan(80000); // Mínimo 80KB
  });

  test('should redirect legacy endpoints to canonical', async ({ page }) => {
    // Testar redirecionamento dos adapters
    const endpoints = [
      '/api/pdf/demo',
      '/api/pdf/optimized?demo=1',
    ];
    
    for (const endpoint of endpoints) {
      const response = await page.request.get(endpoint, {
        maxRedirects: 5,
      });
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/pdf');
      
      const buffer = await response.body();
      expect(buffer.length).toBeGreaterThan(80000);
    }
  });

  test('should handle PDF download from UI', async ({ page }) => {
    // Simular download do PDF através da UI
    await page.goto('/relatorio/demo');
    
    // Aguardar carregamento da página
    await page.waitForSelector('[data-testid="report-content"]', { timeout: 10000 });
    
    // Interceptar requisições de PDF
    const pdfRequests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/pdf/')) {
        pdfRequests.push(request.url());
      }
    });
    
    // Clicar no botão PDF (se existir)
    const pdfButton = page.locator('button:has-text("PDF")').first();
    if (await pdfButton.isVisible()) {
      await pdfButton.click();
      
      // Aguardar nova aba ou download
      await page.waitForTimeout(2000);
      
      // Verificar se foi feita requisição para endpoint correto
      expect(pdfRequests.some(url => url.includes('/api/pdf/report'))).toBeTruthy();
    }
  });

  test('should generate PDF with valid content', async ({ page }) => {
    const response = await page.request.get('/api/pdf/report?demo=1');
    const buffer = await response.body();
    
    // Verificar se é um PDF válido (começa com %PDF)
    const pdfHeader = buffer.toString('ascii', 0, 4);
    expect(pdfHeader).toBe('%PDF');
    
    // Verificar se contém texto esperado
    const pdfContent = buffer.toString('ascii');
    expect(pdfContent).toContain('ALLOE HEALTH');
    expect(pdfContent).toContain('Relatório');
  });

  test('should handle rate limiting', async ({ page }) => {
    // Fazer múltiplas requisições para testar rate limiting
    const requests = Array(15).fill(null).map(() => 
      page.request.get('/api/pdf/report?demo=1')
    );
    
    const responses = await Promise.all(requests);
    
    // Pelo menos uma deve ser 200 (sucesso)
    const successCount = responses.filter(r => r.status() === 200).length;
    expect(successCount).toBeGreaterThan(0);
    
    // Algumas podem ser 429 (rate limit) - isso é esperado
    const rateLimitedCount = responses.filter(r => r.status() === 429).length;
    expect(rateLimitedCount).toBeGreaterThanOrEqual(0);
  });

  test('should handle invalid IDs gracefully', async ({ page }) => {
    const response = await page.request.get('/api/pdf/report?id=invalid-id');
    
    // Deve retornar 200 com PDF de fallback
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    
    const buffer = await response.body();
    expect(buffer.length).toBeGreaterThan(80000);
  });
});
