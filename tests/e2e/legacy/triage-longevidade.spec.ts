// tests/e2e/triage-longevidade.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Triagem Longevidade & Anti-Aging', () => {
  test('deve completar triagem de longevidade', async ({ page }) => {
    // Navegar para a triagem
    await page.goto('/triagem/longevidade');
    
    // Verificar se a página carregou corretamente
    await expect(page.locator('h1')).toContainText('Longevidade & Anti-Aging');
    
    // Preencher dados básicos
    await page.fill('input[name="idade"]', '50');
    await page.selectOption('select[name="sexo"]', 'Masculino');
    
    // Avançar para sintomas
    await page.click('button:has-text("Continuar")');
    
    // Sintomas relacionados ao envelhecimento
    await page.check('input[value="Fadiga"]');
    await page.check('input[value="Problemas de memória"]');
    await page.selectOption('select[name="intensidade_sintomas"]', 'Leve');
    await page.selectOption('select[name="duracao_sintomas"]', '6 meses');
    
    await page.click('button:has-text("Continuar")');
    
    // Sem red flags críticas
    await page.click('button:has-text("Continuar")');
    
    // Preencher histórico
    await page.selectOption('select[name="historico_familiar"]', 'Sim, avós');
    await page.selectOption('select[name="medicamentos"]', 'Sim, 3-5 medicamentos');
    
    await page.click('button:has-text("Continuar")');
    
    // Estilo de vida para longevidade
    await page.selectOption('select[name="exercicio"]', 'Intenso (5-6x/semana)');
    await page.selectOption('select[name="sono"]', 'Excelente');
    await page.selectOption('select[name="estresse"]', 'Muito baixo');
    await page.selectOption('select[name="alimentacao"]', 'Muito saudável (muitas frutas/verduras)');
    
    await page.click('button:has-text("Continuar")');
    
    // Preencher impacto
    await page.selectOption('select[name="impacto_vida"]', 'Impacto leve');
    await page.selectOption('select[name="objetivo_tratamento"]', 'Prevenção');
    
    // Submeter triagem
    await page.click('button:has-text("Finalizar")');
    
    // Verificar se foi redirecionado para o relatório
    await expect(page).toHaveURL(/\/relatorio\/[a-zA-Z0-9]+/);
    
    // Verificar se há pilares de longevidade
    await expect(page.locator('text=Longevidade')).toBeVisible();
    await expect(page.locator('text=Anti-aging')).toBeVisible();
    
    // Verificar CTA para Alloe (performance/bem-estar)
    await expect(page.locator('text=Conheça nosso programa de longevidade')).toBeVisible();
    
    // Verificar quick wins relacionados à longevidade
    await expect(page.locator('text=caminhadas')).toBeVisible();
  });
});
