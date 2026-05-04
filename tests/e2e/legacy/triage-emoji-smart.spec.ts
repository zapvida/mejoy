// tests/e2e/triage-emoji-smart.spec.ts
// Teste E2E para sistema Emoji Smart

import { test, expect } from '@playwright/test';

test.describe('Sistema Emoji Smart', () => {
  test('deve exibir emojis em modo legacy', async ({ page }) => {
    // Definir modo legacy
    await page.addInitScript(() => {
      window.localStorage.setItem('NEXT_PUBLIC_EMOJI_MODE', 'legacy');
    });
    
    await page.goto('/triagem/cardiovascular');
    
    // Verificar se emoji aparece no título
    await expect(page.locator('text=❤️')).toBeVisible();
  });
  
  test('deve exibir emoji contextual em modo smart', async ({ page }) => {
    // Definir modo smart
    await page.addInitScript(() => {
      window.localStorage.setItem('NEXT_PUBLIC_EMOJI_MODE', 'smart');
    });
    
    await page.goto('/triagem/cardiovascular');
    
    // Verificar emoji específico da triagem
    await expect(page.locator('text=❤️')).toBeVisible();
  });
  
  test('deve exibir emoji de alerta para red-flag', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('NEXT_PUBLIC_EMOJI_MODE', 'smart');
    });
    
    await page.goto('/triagem/cardiovascular');
    
    // Completar triagem com red-flag
    await page.selectOption('[name="sexo"]', 'Masculino');
    await page.fill('[name="idade"]', '50');
    await page.fill('[name="peso"]', '80');
    await page.fill('[name="altura"]', '175');
    await page.click('button[type="submit"]');
    
    await page.selectOption('[name="sintomas_principais"]', 'Dor no peito');
    await page.click('button[type="submit"]');
    
    // Ativar red-flag
    await page.selectOption('[name="dor_toracica_sudita"]', 'Sim');
    await page.click('button[type="submit"]');
    
    // Continuar fluxo...
    await page.selectOption('[name="historico_familiar"]', 'Não');
    await page.click('button[type="submit"]');
    await page.selectOption('[name="atividade_fisica"]', 'Regularmente');
    await page.click('button[type="submit"]');
    await page.selectOption('[name="impacto_vida"]', 'Afeta muito');
    await page.click('button[type="submit"]');
    await page.selectOption('[name="consentimento"]', 'Sim, concordo');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/relatorio\/.*/);
    
    // Verificar emoji de alerta
    await expect(page.locator('text=🚨')).toBeVisible();
  });
  
  test('não deve exibir emojis em modo off', async ({ page }) => {
    // Definir modo off
    await page.addInitScript(() => {
      window.localStorage.setItem('NEXT_PUBLIC_EMOJI_MODE', 'off');
    });
    
    await page.goto('/triagem/cardiovascular');
    
    // Verificar que emoji não aparece
    await expect(page.locator('text=❤️')).not.toBeVisible();
  });
  
  test('deve ocultar emojis na impressão', async ({ page }) => {
    await page.goto('/triagem/cardiovascular');
    
    // Completar triagem
    await page.selectOption('[name="sexo"]', 'Feminino');
    await page.fill('[name="idade"]', '30');
    await page.fill('[name="peso"]', '65');
    await page.fill('[name="altura"]', '165');
    await page.click('button[type="submit"]');
    
    await page.selectOption('[name="sintomas_principais"]', 'Não');
    await page.click('button[type="submit"]');
    await page.selectOption('[name="dor_toracica_sudita"]', 'Não');
    await page.click('button[type="submit"]');
    await page.selectOption('[name="historico_familiar"]', 'Não');
    await page.click('button[type="submit"]');
    await page.selectOption('[name="atividade_fisica"]', 'Regularmente');
    await page.click('button[type="submit"]');
    await page.selectOption('[name="impacto_vida"]', 'Não afeta');
    await page.click('button[type="submit"]');
    await page.selectOption('[name="consentimento"]', 'Sim, concordo');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/relatorio\/.*/);
    
    // Simular impressão
    await page.emulateMedia({ media: 'print' });
    
    // Verificar que emojis estão ocultos
    await expect(page.locator('.emoji')).not.toBeVisible();
  });
  
  test('deve exibir emojis diferentes por triagem', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('NEXT_PUBLIC_EMOJI_MODE', 'smart');
    });
    
    // Testar diferentes triagens
    const triages = [
      { slug: 'cardiovascular', emoji: '❤️' },
      { slug: 'diabetes-metabolismo', emoji: '🍯' },
      { slug: 'dor-cronica', emoji: '🩹' },
      { slug: 'coluna', emoji: '🦴' },
      { slug: 'respiratoria', emoji: '🫁' }
    ];
    
    for (const triage of triages) {
      await page.goto(`/triagem/${triage.slug}`);
      await expect(page.locator(`text=${triage.emoji}`)).toBeVisible();
    }
  });
});
