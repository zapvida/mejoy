import { test, expect } from '@playwright/test';

test.describe('Security Tests - P0 Critical', () => {
  
  test('triage.spec.ts: triagem → relatório → print sem elementos sensíveis', async ({ page }) => {
    // Navegar para triagem
    await page.goto('/triagem/gastro');
    
    // Responder 3 passos básicos
    await page.fill('[data-testid="name-input"]', 'João Silva');
    await page.click('[data-testid="next-button"]');
    
    await page.selectOption('[data-testid="sex-select"]', 'masculino');
    await page.click('[data-testid="next-button"]');
    
    await page.fill('[data-testid="whatsapp-input"]', '11999999999');
    await page.click('[data-testid="next-button"]');
    
    // Verificar se chegou no resumo
    await expect(page.locator('[data-testid="triage-summary"]')).toBeVisible();
    
    // Testar impressão - verificar que elementos sensíveis não aparecem
    await page.evaluate(() => {
      // Simular impressão
      const printStyles = document.createElement('style');
      printStyles.textContent = `
        @media print {
          .no-print, .chat-container, .navigation, .footer { display: none !important; }
        }
      `;
      document.head.appendChild(printStyles);
      
      // Aplicar estilos de impressão
      document.body.classList.add('printing');
    });
    
    // Verificar que elementos sensíveis estão ocultos
    const chatContainer = page.locator('.chat-container');
    const navigation = page.locator('.navigation');
    const footer = page.locator('.footer');
    
    await expect(chatContainer).toHaveCSS('display', 'none');
    await expect(navigation).toHaveCSS('display', 'none');
    await expect(footer).toHaveCSS('display', 'none');
  });

  test('authz.spec.ts: /api/triage/answer - autenticação e autorização', async ({ request }) => {
    const baseURL = 'http://localhost:3000';
    
    // Teste 1: 401 sem sessão
    const response1 = await request.post(`${baseURL}/api/triage/answer`, {
      data: {
        triageId: 'test-id',
        stepKey: 'test-step',
        value: 'test-value'
      }
    });
    
    expect(response1.status()).toBe(401);
    
    // Teste 2: 200 com sessão válida (simulado)
    const response2 = await request.post(`${baseURL}/api/triage/answer`, {
      headers: {
        'Authorization': 'Bearer valid-token'
      },
      data: {
        triageId: 'test-id',
        stepKey: 'test-step',
        value: 'test-value'
      }
    });
    
    // Deve retornar 200 ou 400 (dependendo da validação)
    expect([200, 400]).toContain(response2.status());
    
    // Teste 3: 403 tentando acessar client_id de terceiro
    const response3 = await request.post(`${baseURL}/api/triage/answer`, {
      headers: {
        'Authorization': 'Bearer valid-token'
      },
      data: {
        triageId: 'other-user-session',
        stepKey: 'test-step',
        value: 'test-value'
      }
    });
    
    expect(response3.status()).toBe(403);
  });

  test('tts.spec.ts: /api/tts - feature flag e segurança', async ({ request }) => {
    const baseURL = 'http://localhost:3000';
    
    // Teste 1: 501 quando TTS_ENABLED=0
    const response1 = await request.post(`${baseURL}/api/tts`, {
      data: {
        text: 'Teste de áudio',
        voice: 'pt-BR-AntonioNeural'
      }
    });
    
    expect(response1.status()).toBe(501);
    
    // Teste 2: 401 sem autenticação
    const response2 = await request.post(`${baseURL}/api/tts`, {
      data: {
        text: 'Teste de áudio',
        voice: 'pt-BR-AntonioNeural'
      }
    });
    
    expect(response2.status()).toBe(401);
    
    // Teste 3: 400 com texto muito longo
    const longText = 'a'.repeat(10001);
    const response3 = await request.post(`${baseURL}/api/tts`, {
      headers: {
        'Authorization': 'Bearer valid-token'
      },
      data: {
        text: longText,
        voice: 'pt-BR-AntonioNeural'
      }
    });
    
    expect(response3.status()).toBe(400);
  });

  test('lgpd.spec.ts: consentimento LGPD obrigatório', async ({ page }) => {
    // Limpar localStorage para simular usuário sem consentimento
    await page.evaluate(() => {
      localStorage.removeItem('lgpd_consent');
    });
    
    // Tentar acessar triagem
    await page.goto('/triagem/gastro');
    
    // Deve mostrar modal de consentimento
    await expect(page.locator('[data-testid="consent-modal"]')).toBeVisible();
    
    // Tentar prosseguir sem consentimento
    await page.click('[data-testid="continue-without-consent"]');
    
    // Deve continuar bloqueado
    await expect(page.locator('[data-testid="triage-form"]')).not.toBeVisible();
    
    // Dar consentimento
    await page.click('[data-testid="accept-consent"]');
    
    // Deve liberar acesso à triagem
    await expect(page.locator('[data-testid="triage-form"]')).toBeVisible();
  });

  test('pdf.spec.ts: PDF export com feature flag', async ({ request }) => {
    const baseURL = 'http://localhost:3000';
    
    // Teste 1: 501 quando PDF_V2=0
    const response1 = await request.post(`${baseURL}/api/pdf/test-report-id`, {
      data: {
        reportId: 'test-report-id',
        format: 'A4',
        orientation: 'portrait'
      }
    });
    
    expect(response1.status()).toBe(501);
    
    // Teste 2: 401 sem autenticação
    const response2 = await request.post(`${baseURL}/api/pdf/test-report-id`, {
      data: {
        reportId: 'test-report-id',
        format: 'A4',
        orientation: 'portrait'
      }
    });
    
    expect(response2.status()).toBe(401);
  });

  test('rate-limit.spec.ts: rate limiting funcionando', async ({ request }) => {
    const baseURL = 'http://localhost:3000';
    
    // Fazer múltiplas requisições rapidamente
    const promises = Array.from({ length: 10 }, () => 
      request.post(`${baseURL}/api/triage/answer`, {
        data: {
          triageId: 'test-id',
          stepKey: 'test-step',
          value: 'test-value'
        }
      })
    );
    
    const responses = await Promise.all(promises);
    
    // Pelo menos uma deve retornar 429 (rate limit)
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });
});
