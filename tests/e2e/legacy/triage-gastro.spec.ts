import { test, expect } from '@playwright/test';

test.describe('Triagem GI Enhanced', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar flag GI_ENHANCED=1
    await page.addInitScript(() => {
      window.localStorage.setItem('NEXT_PUBLIC_TRIAGE_GI_ENHANCED', '1');
    });
  });

  test('Sem suplemento → relatório exibe CTA Alloe primeiro', async ({ page }) => {
    await page.goto('/triagem/gastrointestinal');
    
    // Preencher formulário sem suplemento
    await page.click('text=Não');
    await page.click('text=Nunca');
    await page.click('text=Nunca consultei');
    await page.click('text=Nunca');
    await page.fill('input[placeholder*="6 meses"]', '6 meses');
    await page.check('text=Nenhum');
    
    // Submeter formulário
    await page.click('button[type="submit"]');
    
    // Verificar se relatório carrega
    await expect(page.locator('text=Suplementação & Acompanhamento')).toBeVisible();
    
    // Verificar ordem dos CTAs (Alloe primeiro)
    const ctas = page.locator('a[href*="/alloe"]');
    await expect(ctas.first()).toContainText('Conhecer o Alloezil');
  });

  test('Alloezil → reforço de continuidade + CTA Alloe primário', async ({ page }) => {
    await page.goto('/triagem/gastrointestinal');
    
    // Preencher formulário usando Alloezil
    await page.click('text=Sim, uso ou já usei o Alloezil');
    await page.click('text=Nunca');
    await page.click('text=Nunca consultei');
    await page.click('text=Nunca');
    await page.fill('input[placeholder*="6 meses"]', '6 meses');
    await page.check('text=Nenhum');
    
    // Submeter formulário
    await page.click('button[type="submit"]');
    
    // Verificar conteúdo específico para usuário Alloezil
    await expect(page.locator('text=Você já conhece o Alloezil')).toBeVisible();
    await expect(page.locator('text=Continuar com o Alloezil')).toBeVisible();
  });

  test('IBP diário + ≥6m → alerta visível + ZapVida antes de Alloe', async ({ page }) => {
    await page.goto('/triagem/gastrointestinal');
    
    // Preencher formulário com IBP diário
    await page.click('text=Não');
    await page.click('text=Nunca');
    await page.click('text=Nunca consultei');
    await page.click('text=Nunca');
    await page.fill('input[placeholder*="6 meses"]', '8 meses');
    await page.check('text=IBP');
    await page.click('text=Diariamente');
    
    // Submeter formulário
    await page.click('button[type="submit"]');
    
    // Verificar alerta
    await expect(page.locator('text=Reavalie estratégia com médico')).toBeVisible();
    
    // Verificar ordem dos CTAs (ZapVida primeiro)
    const ctas = page.locator('a[href*="/zapvida"]');
    await expect(ctas.first()).toContainText('Falar com um médico agora');
  });

  test('EDA ≥3 + última >1a → texto revisão integrativa', async ({ page }) => {
    await page.goto('/triagem/gastrointestinal');
    
    // Preencher formulário com múltiplas EDAs
    await page.click('text=Não');
    await page.click('text=Nunca');
    await page.click('text=Nunca consultei');
    await page.click('text=Sim');
    await page.fill('input[type="number"]', '4');
    await page.click('text=> 3 anos');
    await page.fill('input[placeholder*="6 meses"]', '18 meses');
    await page.check('text=Nenhum');
    
    // Submeter formulário
    await page.click('button[type="submit"]');
    
    // Verificar texto específico
    await expect(page.locator('text=revisão integrativa do plano')).toBeVisible();
  });

  test('Regressão por flag: GI_ENHANCED=0 → UI idêntica ao atual', async ({ page }) => {
    // Configurar flag GI_ENHANCED=0
    await page.addInitScript(() => {
      window.localStorage.setItem('NEXT_PUBLIC_TRIAGE_GI_ENHANCED', '0');
    });
    
    await page.goto('/triagem/gastrointestinal');
    
    // Verificar que novos setores não aparecem
    await expect(page.locator('text=Suplementação')).not.toBeVisible();
    await expect(page.locator('text=Acompanhamento médico')).not.toBeVisible();
    await expect(page.locator('text=Endoscopia (EDA)')).not.toBeVisible();
    
    // Verificar que formulário original funciona
    await page.click('text=Dor abdominal');
    await page.click('button[type="submit"]');
    
    // Verificar relatório original
    await expect(page.locator('text=Plano personalizado')).toBeVisible();
  });
});
