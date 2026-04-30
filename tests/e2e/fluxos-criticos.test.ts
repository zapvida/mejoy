// tests/e2e/fluxos-criticos.test.ts
import { test, expect } from '@playwright/test';

test.describe('Fluxos Críticos Alloe Health', () => {
  
  test('F1 - Fluxo Gratuito Perfeito: Home → Triagem Gastro → Relatório → PDF', async ({ page }) => {
    // 1. Acessar homepage
    await page.goto('/');
    
    // 2. Clicar no CTA principal "Fazer Triagem Gratuita"
    await page.click('text=Fazer Minha Triagem Gratuita');
    
    // 3. Verificar se foi redirecionado para /triagem/gastro
    await expect(page).toHaveURL(/.*\/triagem\/gastro/);
    
    // 4. Preencher formulário básico (simular dados)
    await page.fill('input[name="nome"]', 'João Silva');
    await page.fill('input[name="email"]', 'joao@teste.com');
    
    // 5. Avançar pelos passos da triagem
    await page.click('text=Próximo');
    
    // 6. Preencher sintomas
    await page.check('input[value="dor_abdominal"]');
    await page.check('input[value="nausea"]');
    
    // 7. Finalizar triagem
    await page.click('text=Finalizar Triagem');
    
    // 8. Verificar se foi redirecionado para o relatório
    await expect(page).toHaveURL(/.*\/relatorio\/.*/);
    
    // 9. Verificar se o relatório carregou sem paywall
    await expect(page.locator('text=Resumo Personalizado')).toBeVisible();
    await expect(page.locator('text=Principais Hipóteses')).toBeVisible();
    
    // 10. Verificar se os CTAs estão na ordem correta
    const ctas = page.locator('[data-testid="cta-section"] a');
    await expect(ctas.nth(0)).toContainText('R$ 49');
    await expect(ctas.nth(1)).toContainText('R$ 89');
    await expect(ctas.nth(2)).toContainText('Produtos Alloe');
    await expect(ctas.nth(3)).toContainText('Médico agora');
    
    // 11. Testar download do PDF
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('text=Baixar PDF do Relatório')
    ]);
    
    expect(download.suggestedFilename()).toMatch(/AlloeHealth_Relatorio_gastro_/);
  });

  test('F2 - Fluxo Pago: Tentar acessar relatório não-gratuito → Redirecionar para assinatura', async ({ page }) => {
    // 1. Tentar acessar um relatório de triagem não-gratuita diretamente
    await page.goto('/relatorio/fake-cardio-report-id');
    
    // 2. Verificar se foi redirecionado para /assinatura
    await expect(page).toHaveURL(/.*\/assinatura/);
    
    // 3. Verificar se a página de assinatura carregou
    await expect(page.locator('text=Passe Alloe Health')).toBeVisible();
    await expect(page.locator('text=R$ 49')).toBeVisible();
  });

  test('F3 - CTAs: Verificar ordem, URLs e UTMs corretas', async ({ page }) => {
    // 1. Acessar um relatório gratuito
    await page.goto('/relatorio/fake-gastro-report-id');
    
    // 2. Verificar CTAs na ordem exata
    const cta1 = page.locator('a[href="/assinatura"]');
    const cta2 = page.locator('a[href="/presente"]');
    const cta3 = page.locator('a[href*="alloeoficial.com.br"]');
    const cta4 = page.locator('a[href*="zapvida.com/plantao"]');
    
    await expect(cta1).toContainText('R$ 49');
    await expect(cta2).toContainText('R$ 89');
    await expect(cta3).toContainText('Produtos Alloe');
    await expect(cta4).toContainText('Médico agora');
    
    // 3. Verificar UTMs nos links externos
    const cta3Href = await cta3.getAttribute('href');
    const cta4Href = await cta4.getAttribute('href');
    
    expect(cta3Href).toContain('utm_source=alloehealth');
    expect(cta3Href).toContain('utm_medium=report');
    expect(cta3Href).toContain('utm_campaign=cta_produtos');
    
    expect(cta4Href).toContain('utm_source=alloehealth');
    expect(cta4Href).toContain('utm_medium=report');
    expect(cta4Href).toContain('utm_campaign=cta_plantao');
    
    // 4. Verificar target="_blank" e rel="noopener noreferrer"
    await expect(cta3).toHaveAttribute('target', '_blank');
    await expect(cta3).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(cta4).toHaveAttribute('target', '_blank');
    await expect(cta4).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('Tema Dark/Light: Verificar consistência visual', async ({ page }) => {
    // 1. Acessar homepage
    await page.goto('/');
    
    // 2. Verificar tema light (padrão)
    await expect(page.locator('body')).toHaveClass(/light/);
    
    // 3. Alternar para tema dark
    await page.click('[data-testid="theme-toggle"]');
    await expect(page.locator('body')).toHaveClass(/dark/);
    
    // 4. Verificar se as cores estão consistentes
    const brandElements = page.locator('.bg-brand, .text-brand, .border-brand');
    await expect(brandElements.first()).toBeVisible();
    
    // 5. Verificar contraste (elementos devem ser visíveis)
    const textElements = page.locator('h1, h2, h3, p');
    await expect(textElements.first()).toBeVisible();
  });

  test('Responsividade: Verificar em diferentes tamanhos de tela', async ({ page }) => {
    // 1. Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('text=Fazer Minha Triagem Gratuita')).toBeVisible();
    
    // 2. Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('text=Fazer Minha Triagem Gratuita')).toBeVisible();
    
    // 3. Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(page.locator('text=Fazer Minha Triagem Gratuita')).toBeVisible();
  });
});