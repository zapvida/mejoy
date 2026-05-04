// tests/e2e/triage-mulher.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Triagem Saúde da Mulher', () => {
  test('deve completar triagem de saúde da mulher', async ({ page }) => {
    // Navegar para a triagem
    await page.goto('/triagem/mulher');
    
    // Verificar se a página carregou corretamente
    await expect(page.locator('h1')).toContainText('Saúde da Mulher');
    
    // Preencher dados básicos
    await page.fill('input[name="idade"]', '35');
    await page.selectOption('select[name="sexo"]', 'Feminino');
    
    // Avançar para sintomas
    await page.click('button:has-text("Continuar")');
    
    // Selecionar sintomas relacionados à saúde feminina
    await page.check('input[value="Dor pélvica"]');
    await page.check('input[value="Irregularidade menstrual"]');
    await page.selectOption('select[name="intensidade_sintomas"]', 'Moderada');
    await page.selectOption('select[name="duracao_sintomas"]', '2-3 meses');
    
    await page.click('button:has-text("Continuar")');
    
    // Sem red flags específicas
    await page.click('button:has-text("Continuar")');
    
    // Preencher histórico
    await page.selectOption('select[name="historico_familiar"]', 'Sim, mãe');
    await page.selectOption('select[name="medicamentos"]', 'Sim, 1-2 medicamentos');
    
    await page.click('button:has-text("Continuar")');
    
    // Preencher estilo de vida
    await page.selectOption('select[name="exercicio"]', 'Leve (1-2x/semana)');
    await page.selectOption('select[name="sono"]', 'Regular');
    await page.selectOption('select[name="estresse"]', 'Moderado');
    await page.selectOption('select[name="alimentacao"]', 'Regular (misturado)');
    
    await page.click('button:has-text("Continuar")');
    
    // Preencher impacto
    await page.selectOption('select[name="impacto_vida"]', 'Impacto moderado');
    await page.selectOption('select[name="objetivo_tratamento"]', 'Melhora da qualidade de vida');
    
    // Submeter triagem
    await page.click('button:has-text("Finalizar")');
    
    // Verificar se foi redirecionado para o relatório
    await expect(page).toHaveURL(/\/relatorio\/[a-zA-Z0-9]+/);
    
    // Verificar se há recomendações específicas para mulheres
    await expect(page.locator('text=SOP')).toBeVisible();
    await expect(page.locator('text=menopausa')).toBeVisible();
    
    // Verificar CTA para Alloe (bem-estar)
    await expect(page.locator('text=Conheça nossos planos de saúde')).toBeVisible();
  });
});
