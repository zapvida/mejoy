// tests/e2e/triage-patient-profile.spec.ts
// Teste E2E para sistema de perfil do paciente

import { test, expect } from '@playwright/test';

test.describe('Sistema de Perfil do Paciente', () => {
  test('deve calcular IMC e idade automaticamente', async ({ page }) => {
    // Navegar para qualquer triagem
    await page.goto('/triagem/mulher');
    
    // Preencher dados básicos
    await page.selectOption('[name="sexo"]', 'Feminino');
    await page.fill('[name="idade"]', '28');
    await page.fill('[name="peso"]', '60');
    await page.fill('[name="altura"]', '165');
    
    // Completar triagem rapidamente
    await page.click('button[type="submit"]');
    await page.selectOption('[name="sintomas_principais"]', 'Não');
    await page.click('button[type="submit"]');
    await page.selectOption('[name="dor_pelvica_intensa"]', 'Não');
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
    
    // Verificar cálculos automáticos
    await expect(page.locator('text=IMC: 22.0')).toBeVisible();
    await expect(page.locator('text=Idade: 28')).toBeVisible();
    await expect(page.locator('text=Peso normal')).toBeVisible();
  });
  
  test('deve persistir perfil no localStorage', async ({ page }) => {
    // Primeira triagem
    await page.goto('/triagem/cardiovascular');
    
    await page.selectOption('[name="sexo"]', 'Masculino');
    await page.fill('[name="idade"]', '40');
    await page.fill('[name="peso"]', '80');
    await page.fill('[name="altura"]', '180');
    
    // Completar triagem
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
    
    // Verificar se perfil foi salvo
    const profile = await page.evaluate(() => {
      return localStorage.getItem('ah.patientProfile.v1');
    });
    
    expect(profile).toBeTruthy();
    
    const parsedProfile = JSON.parse(profile);
    expect(parsedProfile.age).toBe(40);
    expect(parsedProfile.bmi).toBe(24.7);
    expect(parsedProfile.sex).toBe('M');
  });
  
  test('deve reutilizar perfil em triagem subsequente', async ({ page }) => {
    // Primeiro, criar perfil
    await page.goto('/triagem/cardiovascular');
    
    await page.selectOption('[name="sexo"]', 'Feminino');
    await page.fill('[name="idade"]', '32');
    await page.fill('[name="peso"]', '70');
    await page.fill('[name="altura"]', '170');
    
    // Completar primeira triagem
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
    
    // Navegar para segunda triagem
    await page.goto('/triagem/mulher');
    
    // Verificar se dados básicos estão preenchidos
    await expect(page.locator('[name="sexo"]')).toHaveValue('Feminino');
    await expect(page.locator('[name="idade"]')).toHaveValue('32');
    await expect(page.locator('[name="peso"]')).toHaveValue('70');
    await expect(page.locator('[name="altura"]')).toHaveValue('170');
  });
  
  test('deve classificar IMC corretamente para diferentes idades', async ({ page }) => {
    // Teste para adulto
    await page.goto('/triagem/cardiovascular');
    
    await page.selectOption('[name="sexo"]', 'Masculino');
    await page.fill('[name="idade"]', '25');
    await page.fill('[name="peso"]', '90');
    await page.fill('[name="altura"]', '175');
    
    // Completar triagem
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
    
    // Verificar classificação de sobrepeso
    await expect(page.locator('text=IMC: 29.4')).toBeVisible();
    await expect(page.locator('text=Sobrepeso')).toBeVisible();
  });
});
