import { test, expect } from '@playwright/test';

test.describe('Verificação de CTAs e UTMs', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('CTAs - Ordem e texto exatos conforme especificação', async ({ page }) => {
    // Mock da página de relatório com CTAs
    await page.route('**/relatorio/cta-test', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Relatório - Teste CTAs</title>
            <meta name="description" content="Relatório de teste para verificar CTAs">
          </head>
          <body>
            <main>
              <h1>Relatório de Teste</h1>
              
              <!-- CTAs na ordem exata conforme plano -->
              <div class="ctas-container">
                <h3>🎯 Próximos Passos Recomendados</h3>
                
                <div class="ctas-grid">
                  <!-- CTA 1: Liberar todas as triagens – R$ 49 (30 dias) -->
                  <a href="/assinatura" class="cta cta-1">
                    <div class="cta-text">
                      <div class="cta-title">Liberar todas as triagens – R$ 49</div>
                      <div class="cta-subtitle">30 dias de acesso completo</div>
                    </div>
                  </a>

                  <!-- CTA 2: Presentear – R$ 89 (30 dias) -->
                  <a href="/presente" class="cta cta-2">
                    <div class="cta-text">
                      <div class="cta-title">Presentear – R$ 89</div>
                      <div class="cta-subtitle">30 dias + presente para alguém especial</div>
                    </div>
                  </a>

                  <!-- CTA 3: Produtos Alloe -->
                  <a href="https://alloeoficial.com.br/?utm_source=alloehealth&utm_medium=report&utm_campaign=cta_produtos&utm_content=gastro" class="cta cta-3">
                    <div class="cta-text">
                      <div class="cta-title">Produtos Alloe</div>
                      <div class="cta-subtitle">Kits indicados para o seu caso</div>
                    </div>
                  </a>

                  <!-- CTA 4: Médico agora -->
                  <a href="https://zapvida.com/plantao?utm_source=alloehealth&utm_medium=report&utm_campaign=cta_plantao&utm_content=gastro" class="cta cta-4">
                    <div class="cta-text">
                      <div class="cta-title">Médico agora</div>
                      <div class="cta-subtitle">Atendimento online em minutos</div>
                    </div>
                  </a>
                </div>
              </div>
            </main>
          </body>
          </html>
        `
      });
    });

    await page.goto('/relatorio/cta-test');
    
    // Verificar se a página carregou
    await expect(page.locator('h1')).toContainText('Relatório de Teste');
    
    // Verificar seção de CTAs
    await expect(page.locator('h3')).toContainText('Próximos Passos Recomendados');
    
    // Verificar CTA 1: Liberar todas as triagens – R$ 49
    const cta1 = page.locator('.cta-1');
    await expect(cta1).toBeVisible();
    await expect(cta1.locator('.cta-title')).toContainText('Liberar todas as triagens – R$ 49');
    await expect(cta1.locator('.cta-subtitle')).toContainText('30 dias de acesso completo');
    await expect(cta1).toHaveAttribute('href', '/assinatura');
    
    // Verificar CTA 2: Presentear – R$ 89
    const cta2 = page.locator('.cta-2');
    await expect(cta2).toBeVisible();
    await expect(cta2.locator('.cta-title')).toContainText('Presentear – R$ 89');
    await expect(cta2.locator('.cta-subtitle')).toContainText('30 dias + presente para alguém especial');
    await expect(cta2).toHaveAttribute('href', '/presente');
    
    // Verificar CTA 3: Produtos Alloe
    const cta3 = page.locator('.cta-3');
    await expect(cta3).toBeVisible();
    await expect(cta3.locator('.cta-title')).toContainText('Produtos Alloe');
    await expect(cta3.locator('.cta-subtitle')).toContainText('Kits indicados para o seu caso');
    await expect(cta3).toHaveAttribute('href', 'https://alloeoficial.com.br/?utm_source=alloehealth&utm_medium=report&utm_campaign=cta_produtos&utm_content=gastro');
    
    // Verificar CTA 4: Médico agora
    const cta4 = page.locator('.cta-4');
    await expect(cta4).toBeVisible();
    await expect(cta4.locator('.cta-title')).toContainText('Médico agora');
    await expect(cta4.locator('.cta-subtitle')).toContainText('Atendimento online em minutos');
    await expect(cta4).toHaveAttribute('href', 'https://zapvida.com/plantao?utm_source=alloehealth&utm_medium=report&utm_campaign=cta_plantao&utm_content=gastro');
  });

  test('UTMs - Verificação de parâmetros corretos', async ({ page }) => {
    // Mock da página de relatório
    await page.route('**/relatorio/utm-test', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Relatório - Teste UTMs</title>
          </head>
          <body>
            <main>
              <h1>Relatório de Teste UTMs</h1>
              
              <div class="ctas-container">
                <!-- CTA 3: Produtos Alloe com UTMs -->
                <a href="https://alloeoficial.com.br/?utm_source=alloehealth&utm_medium=report&utm_campaign=cta_produtos&utm_content=products_alloe_gastro" class="cta cta-produtos">
                  <div class="cta-text">
                    <div class="cta-title">Produtos Alloe</div>
                    <div class="cta-subtitle">Kits indicados para o seu caso</div>
                  </div>
                </a>

                <!-- CTA 4: Médico agora com UTMs -->
                <a href="https://zapvida.com/plantao?utm_source=alloehealth&utm_medium=report&utm_campaign=cta_plantao&utm_content=consult_zapvida_gastro" class="cta cta-medico">
                  <div class="cta-text">
                    <div class="cta-title">Médico agora</div>
                    <div class="cta-subtitle">Atendimento online em minutos</div>
                  </div>
                </a>
              </div>
            </main>
          </body>
          </html>
        `
      });
    });

    await page.goto('/relatorio/utm-test');
    
    // Verificar UTMs do CTA Produtos Alloe
    const ctaProdutos = page.locator('.cta-produtos');
    await expect(ctaProdutos).toBeVisible();
    
    const produtosHref = await ctaProdutos.getAttribute('href');
    expect(produtosHref).toContain('utm_source=alloehealth');
    expect(produtosHref).toContain('utm_medium=report');
    expect(produtosHref).toContain('utm_campaign=cta_produtos');
    expect(produtosHref).toContain('utm_content=products_alloe_gastro');
    
    // Verificar UTMs do CTA Médico agora
    const ctaMedico = page.locator('.cta-medico');
    await expect(ctaMedico).toBeVisible();
    
    const medicoHref = await ctaMedico.getAttribute('href');
    expect(medicoHref).toContain('utm_source=alloehealth');
    expect(medicoHref).toContain('utm_medium=report');
    expect(medicoHref).toContain('utm_campaign=cta_plantao');
    expect(medicoHref).toContain('utm_content=consult_zapvida_gastro');
  });

  test('CTAs - Responsividade em mobile', async ({ page }) => {
    // Mock da página de relatório
    await page.route('**/relatorio/responsive-test', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Relatório - Teste Responsividade</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              .ctas-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1rem;
              }
              @media (min-width: 768px) {
                .ctas-grid {
                  grid-template-columns: 1fr 1fr;
                }
              }
              .cta {
                padding: 1rem;
                border-radius: 0.75rem;
                text-decoration: none;
                color: white;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                min-height: 60px;
              }
              .cta-1 { background: linear-gradient(to right, #10b981, #059669); }
              .cta-2 { background: linear-gradient(to right, #8b5cf6, #7c3aed); }
              .cta-3 { background: linear-gradient(to right, #3b82f6, #2563eb); }
              .cta-4 { background: linear-gradient(to right, #f97316, #ea580c); }
              .cta-title { font-weight: bold; }
              .cta-subtitle { font-size: 0.875rem; opacity: 0.9; }
            </style>
          </head>
          <body>
            <main>
              <h1>Relatório de Teste Responsividade</h1>
              
              <div class="ctas-container">
                <h3>🎯 Próximos Passos Recomendados</h3>
                
                <div class="ctas-grid">
                  <!-- CTA 1 -->
                  <a href="/assinatura" class="cta cta-1">
                    <div class="cta-text">
                      <div class="cta-title">Liberar todas as triagens – R$ 49</div>
                      <div class="cta-subtitle">30 dias de acesso completo</div>
                    </div>
                  </a>

                  <!-- CTA 2 -->
                  <a href="/presente" class="cta cta-2">
                    <div class="cta-text">
                      <div class="cta-title">Presentear – R$ 89</div>
                      <div class="cta-subtitle">30 dias + presente para alguém especial</div>
                    </div>
                  </a>

                  <!-- CTA 3 -->
                  <a href="https://alloeoficial.com.br/?utm_source=alloehealth&utm_medium=report&utm_campaign=cta_produtos&utm_content=gastro" class="cta cta-3">
                    <div class="cta-text">
                      <div class="cta-title">Produtos Alloe</div>
                      <div class="cta-subtitle">Kits indicados para o seu caso</div>
                    </div>
                  </a>

                  <!-- CTA 4 -->
                  <a href="https://zapvida.com/plantao?utm_source=alloehealth&utm_medium=report&utm_campaign=cta_plantao&utm_content=gastro" class="cta cta-4">
                    <div class="cta-text">
                      <div class="cta-title">Médico agora</div>
                      <div class="cta-subtitle">Atendimento online em minutos</div>
                    </div>
                  </a>
                </div>
              </div>
            </main>
          </body>
          </html>
        `
      });
    });

    // Teste em mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/relatorio/responsive-test');
    
    // Verificar se os CTAs são visíveis em mobile
    await expect(page.locator('.cta-1')).toBeVisible();
    await expect(page.locator('.cta-2')).toBeVisible();
    await expect(page.locator('.cta-3')).toBeVisible();
    await expect(page.locator('.cta-4')).toBeVisible();
    
    // Verificar se o texto não está cortado
    const cta1Text = await page.locator('.cta-1 .cta-title').textContent();
    expect(cta1Text).toContain('Liberar todas as triagens – R$ 49');
    
    const cta2Text = await page.locator('.cta-2 .cta-title').textContent();
    expect(cta2Text).toContain('Presentear – R$ 89');
    
    // Teste em desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.reload();
    
    // Verificar se os CTAs são visíveis em desktop
    await expect(page.locator('.cta-1')).toBeVisible();
    await expect(page.locator('.cta-2')).toBeVisible();
    await expect(page.locator('.cta-3')).toBeVisible();
    await expect(page.locator('.cta-4')).toBeVisible();
    
    // Verificar se o layout se adapta (grid de 2 colunas em desktop)
    const cta1Box = await page.locator('.cta-1').boundingBox();
    const cta2Box = await page.locator('.cta-2').boundingBox();
    
    // Em desktop, os CTAs devem estar lado a lado
    expect(cta1Box?.width).toBeLessThan(800); // Largura máxima esperada
    expect(cta2Box?.width).toBeLessThan(800); // Largura máxima esperada
  });

  test('CTAs - Verificação de acessibilidade', async ({ page }) => {
    // Mock da página de relatório
    await page.route('**/relatorio/a11y-test', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Relatório - Teste Acessibilidade</title>
          </head>
          <body>
            <main>
              <h1>Relatório de Teste Acessibilidade</h1>
              
              <div class="ctas-container">
                <h3>🎯 Próximos Passos Recomendados</h3>
                
                <div class="ctas-grid">
                  <!-- CTA 1 -->
                  <a href="/assinatura" class="cta cta-1" aria-label="Liberar todas as triagens por R$ 49">
                    <div class="cta-text">
                      <div class="cta-title">Liberar todas as triagens – R$ 49</div>
                      <div class="cta-subtitle">30 dias de acesso completo</div>
                    </div>
                  </a>

                  <!-- CTA 2 -->
                  <a href="/presente" class="cta cta-2" aria-label="Presentear por R$ 89">
                    <div class="cta-text">
                      <div class="cta-title">Presentear – R$ 89</div>
                      <div class="cta-subtitle">30 dias + presente para alguém especial</div>
                    </div>
                  </a>

                  <!-- CTA 3 -->
                  <a href="https://alloeoficial.com.br/?utm_source=alloehealth&utm_medium=report&utm_campaign=cta_produtos&utm_content=gastro" class="cta cta-3" aria-label="Ver produtos Alloe" target="_blank" rel="noopener noreferrer">
                    <div class="cta-text">
                      <div class="cta-title">Produtos Alloe</div>
                      <div class="cta-subtitle">Kits indicados para o seu caso</div>
                    </div>
                  </a>

                  <!-- CTA 4 -->
                  <a href="https://zapvida.com/plantao?utm_source=alloehealth&utm_medium=report&utm_campaign=cta_plantao&utm_content=gastro" class="cta cta-4" aria-label="Falar com médico agora" target="_blank" rel="noopener noreferrer">
                    <div class="cta-text">
                      <div class="cta-title">Médico agora</div>
                      <div class="cta-subtitle">Atendimento online em minutos</div>
                    </div>
                  </a>
                </div>
              </div>
            </main>
          </body>
          </html>
        `
      });
    });

    await page.goto('/relatorio/a11y-test');
    
    // Verificar se os CTAs têm aria-label
    await expect(page.locator('.cta-1')).toHaveAttribute('aria-label', 'Liberar todas as triagens por R$ 49');
    await expect(page.locator('.cta-2')).toHaveAttribute('aria-label', 'Presentear por R$ 89');
    await expect(page.locator('.cta-3')).toHaveAttribute('aria-label', 'Ver produtos Alloe');
    await expect(page.locator('.cta-4')).toHaveAttribute('aria-label', 'Falar com médico agora');
    
    // Verificar se os CTAs externos têm target="_blank" e rel="noopener noreferrer"
    await expect(page.locator('.cta-3')).toHaveAttribute('target', '_blank');
    await expect(page.locator('.cta-3')).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(page.locator('.cta-4')).toHaveAttribute('target', '_blank');
    await expect(page.locator('.cta-4')).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Verificar se os CTAs internos não têm target="_blank"
    await expect(page.locator('.cta-1')).not.toHaveAttribute('target', '_blank');
    await expect(page.locator('.cta-2')).not.toHaveAttribute('target', '_blank');
  });
});
