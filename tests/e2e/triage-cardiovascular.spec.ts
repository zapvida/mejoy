// tests/e2e/triage-cardiovascular.spec.ts
// Teste E2E para triagem cardiovascular com red-flag

import { test, expect } from '@playwright/test';

test.describe('Triagem Cardiovascular', () => {
  test('deve completar fluxo completo com red-flag', async ({ page }) => {
    // Navegar para triagem cardiovascular
    await page.goto('/triagem/cardiovascular');
    
    // Verificar se a página carregou
    await expect(page.locator('h1')).toContainText('Saúde Cardiovascular');
    
    // Preencher dados básicos
    await page.selectOption('[name="sexo"]', 'Masculino');
    await page.fill('[name="idade"]', '45');
    await page.fill('[name="peso"]', '85');
    await page.fill('[name="altura"]', '175');
    
    // Avançar para sintomas
    await page.click('button[type="submit"]');
    
    // Selecionar sintomas principais
    await page.check('[name="sintomas_principais"][value="Dor no peito"]');
    await page.check('[name="sintomas_principais"][value="Palpitações"]');
    
    // Definir intensidade
    await page.selectOption('[name="intensidade_sintomas"]', 'Intensa');
    await page.selectOption('[name="duracao_sintomas"]', '1-3 meses');
    
    // Avançar para red flags
    await page.click('button[type="submit"]');
    
    // Simular red-flag (dor torácica súbita)
    await page.selectOption('[name="dor_toracica_sudita"]', 'Sim');
    
    // Avançar para histórico
    await page.click('button[type="submit"]');
    
    // Preencher histórico
    await page.selectOption('[name="historico_familiar"]', 'Sim, na família');
    await page.selectOption('[name="medicamentos"]', 'Sim');
    await page.selectOption('[name="comorbidades"]', 'Hipertensão');
    
    // Avançar para estilo de vida
    await page.click('button[type="submit"]');
    
    // Preencher estilo de vida
    await page.selectOption('[name="atividade_fisica"]', 'Raramente');
    await page.selectOption('[name="qualidade_sono"]', 'Regular');
    await page.selectOption('[name="nivel_estresse"]', 'Alto');
    
    // Avançar para objetivos
    await page.click('button[type="submit"]');
    
    // Preencher objetivos
    await page.selectOption('[name="impacto_vida"]', 'Afeta muito');
    await page.fill('[name="objetivos"]', 'Reduzir risco cardiovascular');
    
    // Avançar para consentimento
    await page.click('button[type="submit"]');
    
    // Dar consentimento
    await page.selectOption('[name="consentimento"]', 'Sim, concordo');
    
    // Finalizar triagem
    await page.click('button[type="submit"]');
    
    // Aguardar redirecionamento para relatório
    await page.waitForURL(/\/relatorio\/.*/);
    
    // Verificar se o relatório carregou
    await expect(page.locator('h1')).toContainText('Seu retrato de saúde');
    
    // Verificar alerta de red-flag
    await expect(page.locator('.alert-danger, [class*="danger"]')).toBeVisible();
    await expect(page.locator('text=Atenção Médica Necessária')).toBeVisible();
    
    // Verificar CTA ZapVida
    await expect(page.locator('text=Falar com um médico agora')).toBeVisible();
    
    // Verificar perfil do paciente (IMC calculado)
    await expect(page.locator('text=IMC: 27.8')).toBeVisible();
    await expect(page.locator('text=Idade: 45')).toBeVisible();
    
    // Verificar emoji contextual (se modo smart ativo)
    const emojiMode = process.env.NEXT_PUBLIC_EMOJI_MODE || 'legacy';
    if (emojiMode === 'smart') {
      await expect(page.locator('text=🚨')).toBeVisible();
    }
  });
  
  test('deve completar fluxo sem red-flag', async ({ page }) => {
    await page.goto('/triagem/cardiovascular');
    
    // Preencher dados básicos
    await page.selectOption('[name="sexo"]', 'Feminino');
    await page.fill('[name="idade"]', '35');
    await page.fill('[name="peso"]', '65');
    await page.fill('[name="altura"]', '165');
    
    await page.click('button[type="submit"]');
    
    // Sintomas leves
    await page.check('[name="sintomas_principais"][value="Cansaço excessivo"]');
    await page.selectOption('[name="intensidade_sintomas"]', 'Leve');
    await page.selectOption('[name="duracao_sintomas"]', '1-4 semanas');
    
    await page.click('button[type="submit"]');
    
    // Sem red flags
    await page.selectOption('[name="dor_toracica_sudita"]', 'Não');
    await page.selectOption('[name="desmaio"]', 'Não');
    await page.selectOption('[name="falta_ar_repouso"]', 'Não');
    
    // Continuar fluxo normal...
    await page.selectOption('[name="consentimento"]', 'Sim, concordo');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/relatorio\/.*/);
    
    // Verificar que não há alerta de perigo
    await expect(page.locator('.alert-danger')).not.toBeVisible();
    
    // Verificar CTA Alloe (bem-estar)
    await expect(page.locator('text=Ver planos de saúde')).toBeVisible();
  });
});