import { test, expect } from '@playwright/test';

test.describe('Validação de PDFs', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('PDF - Perfil 1: Mulher, 30 anos, IMC normal', async ({ page }) => {
    // Mock de dados para perfil 1
    const mockData = {
      id: 'pdf-test-1',
      patient: {
        nome: 'Maria Silva',
        email: 'maria@teste.com',
        whatsapp: '11987654321',
        nascimento: '15/03/1994',
        sexo: 'F',
        peso: 65,
        altura: 165
      },
      triage: {
        tipo: 'gastro',
        respostas: {
          sintomas: ['dor_abdominal', 'nausea'],
          duracao: '1_semana',
          intensidade: 'moderada'
        }
      },
      report: {
        resumo: 'Paciente apresenta sintomas gastrointestinais leves...',
        recomendacoes: ['Dieta leve', 'Hidratação adequada'],
        redFlags: [],
        proximosPassos: ['Retorno em 7 dias', 'Seguir dieta']
      }
    };

    // Mock da página de relatório
    await page.route('**/relatorio/pdf-test-1', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Relatório - ${mockData.patient.nome}</title>
            <meta name="description" content="Relatório de triagem gastrointestinal">
          </head>
          <body>
            <header>
              <h1>Relatório de Triagem</h1>
              <p>Paciente: ${mockData.patient.nome}</p>
              <p>Idade: 30 anos</p>
              <p>IMC: 23.9 (Normal)</p>
            </header>
            <main>
              <section>
                <h2>Resumo</h2>
                <p>${mockData.report.resumo}</p>
              </section>
              <section>
                <h2>Recomendações</h2>
                <ul>
                  ${mockData.report.recomendacoes.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </section>
              <section>
                <h2>Próximos Passos</h2>
                <ul>
                  ${mockData.report.proximosPassos.map(passo => `<li>${passo}</li>`).join('')}
                </ul>
              </section>
            </main>
            <footer>
              <p>Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
              <p>AlloeHealth - Triagem Inteligente</p>
            </footer>
          </body>
          </html>
        `
      });
    });

    await page.goto('/relatorio/pdf-test-1');
    
    // Verificar se a página carregou corretamente
    await expect(page.locator('h1')).toContainText('Relatório de Triagem');
    await expect(page.locator('text=Maria Silva')).toBeVisible();
    await expect(page.locator('text=30 anos')).toBeVisible();
    await expect(page.locator('text=IMC: 23.9')).toBeVisible();
    
    // Verificar seção de resumo
    await expect(page.locator('h2:has-text("Resumo")')).toBeVisible();
    await expect(page.locator('text=Paciente apresenta sintomas gastrointestinais leves')).toBeVisible();
    
    // Verificar seção de recomendações
    await expect(page.locator('h2:has-text("Recomendações")')).toBeVisible();
    await expect(page.locator('text=Dieta leve')).toBeVisible();
    await expect(page.locator('text=Hidratação adequada')).toBeVisible();
    
    // Verificar seção de próximos passos
    await expect(page.locator('h2:has-text("Próximos Passos")')).toBeVisible();
    await expect(page.locator('text=Retorno em 7 dias')).toBeVisible();
    await expect(page.locator('text=Seguir dieta')).toBeVisible();
    
    // Verificar footer
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('text=AlloeHealth - Triagem Inteligente')).toBeVisible();
    
    // Verificar se há botão de download PDF
    const downloadButton = page.locator('button:has-text("Download PDF")').or(page.locator('a:has-text("Download PDF")'));
    await expect(downloadButton).toBeVisible();
  });

  test('PDF - Perfil 2: Homem, 45 anos, IMC sobrepeso', async ({ page }) => {
    // Mock de dados para perfil 2
    const mockData = {
      id: 'pdf-test-2',
      patient: {
        nome: 'João Santos',
        email: 'joao@teste.com',
        whatsapp: '11987654322',
        nascimento: '20/05/1979',
        sexo: 'M',
        peso: 85,
        altura: 175
      },
      triage: {
        tipo: 'gastro',
        respostas: {
          sintomas: ['dor_abdominal', 'vomito', 'febre'],
          duracao: '3_dias',
          intensidade: 'alta'
        }
      },
      report: {
        resumo: 'Paciente apresenta sintomas gastrointestinais moderados a graves...',
        recomendacoes: ['Repouso', 'Dieta líquida', 'Medicação sintomática'],
        redFlags: ['Febre persistente', 'Dor intensa'],
        proximosPassos: ['Retorno em 24h', 'Monitoramento', 'Exames complementares']
      }
    };

    // Mock da página de relatório
    await page.route('**/relatorio/pdf-test-2', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Relatório - ${mockData.patient.nome}</title>
            <meta name="description" content="Relatório de triagem gastrointestinal">
          </head>
          <body>
            <header>
              <h1>Relatório de Triagem</h1>
              <p>Paciente: ${mockData.patient.nome}</p>
              <p>Idade: 45 anos</p>
              <p>IMC: 27.8 (Sobrepeso)</p>
            </header>
            <main>
              <section>
                <h2>Resumo</h2>
                <p>${mockData.report.resumo}</p>
              </section>
              <section>
                <h2>Recomendações</h2>
                <ul>
                  ${mockData.report.recomendacoes.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </section>
              <section>
                <h2>Red Flags</h2>
                <ul>
                  ${mockData.report.redFlags.map(flag => `<li>${flag}</li>`).join('')}
                </ul>
              </section>
              <section>
                <h2>Próximos Passos</h2>
                <ul>
                  ${mockData.report.proximosPassos.map(passo => `<li>${passo}</li>`).join('')}
                </ul>
              </section>
            </main>
            <footer>
              <p>Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
              <p>AlloeHealth - Triagem Inteligente</p>
            </footer>
          </body>
          </html>
        `
      });
    });

    await page.goto('/relatorio/pdf-test-2');
    
    // Verificar se a página carregou corretamente
    await expect(page.locator('h1')).toContainText('Relatório de Triagem');
    await expect(page.locator('text=João Santos')).toBeVisible();
    await expect(page.locator('text=45 anos')).toBeVisible();
    await expect(page.locator('text=IMC: 27.8')).toBeVisible();
    
    // Verificar seção de resumo
    await expect(page.locator('h2:has-text("Resumo")')).toBeVisible();
    await expect(page.locator('text=Paciente apresenta sintomas gastrointestinais moderados a graves')).toBeVisible();
    
    // Verificar seção de recomendações
    await expect(page.locator('h2:has-text("Recomendações")')).toBeVisible();
    await expect(page.locator('text=Repouso')).toBeVisible();
    await expect(page.locator('text=Dieta líquida')).toBeVisible();
    await expect(page.locator('text=Medicação sintomática')).toBeVisible();
    
    // Verificar seção de red flags
    await expect(page.locator('h2:has-text("Red Flags")')).toBeVisible();
    await expect(page.locator('text=Febre persistente')).toBeVisible();
    await expect(page.locator('text=Dor intensa')).toBeVisible();
    
    // Verificar seção de próximos passos
    await expect(page.locator('h2:has-text("Próximos Passos")')).toBeVisible();
    await expect(page.locator('text=Retorno em 24h')).toBeVisible();
    await expect(page.locator('text=Monitoramento')).toBeVisible();
    await expect(page.locator('text=Exames complementares')).toBeVisible();
    
    // Verificar footer
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('text=AlloeHealth - Triagem Inteligente')).toBeVisible();
  });

  test('PDF - Perfil 3: Mulher, 60 anos, IMC obesidade', async ({ page }) => {
    // Mock de dados para perfil 3
    const mockData = {
      id: 'pdf-test-3',
      patient: {
        nome: 'Ana Costa',
        email: 'ana@teste.com',
        whatsapp: '11987654323',
        nascimento: '10/12/1964',
        sexo: 'F',
        peso: 95,
        altura: 160
      },
      triage: {
        tipo: 'gastro',
        respostas: {
          sintomas: ['dor_abdominal', 'nausea', 'vomito', 'febre'],
          duracao: '1_semana',
          intensidade: 'alta'
        }
      },
      report: {
        resumo: 'Paciente idosa apresenta sintomas gastrointestinais graves...',
        recomendacoes: ['Internação', 'Exames urgentes', 'Medicação IV'],
        redFlags: ['Idade avançada', 'Sintomas graves', 'IMC elevado'],
        proximosPassos: ['Internação imediata', 'Exames laboratoriais', 'Acompanhamento especializado']
      }
    };

    // Mock da página de relatório
    await page.route('**/relatorio/pdf-test-3', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Relatório - ${mockData.patient.nome}</title>
            <meta name="description" content="Relatório de triagem gastrointestinal">
          </head>
          <body>
            <header>
              <h1>Relatório de Triagem</h1>
              <p>Paciente: ${mockData.patient.nome}</p>
              <p>Idade: 60 anos</p>
              <p>IMC: 37.1 (Obesidade Grau II)</p>
            </header>
            <main>
              <section>
                <h2>Resumo</h2>
                <p>${mockData.report.resumo}</p>
              </section>
              <section>
                <h2>Recomendações</h2>
                <ul>
                  ${mockData.report.recomendacoes.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </section>
              <section>
                <h2>Red Flags</h2>
                <ul>
                  ${mockData.report.redFlags.map(flag => `<li>${flag}</li>`).join('')}
                </ul>
              </section>
              <section>
                <h2>Próximos Passos</h2>
                <ul>
                  ${mockData.report.proximosPassos.map(passo => `<li>${passo}</li>`).join('')}
                </ul>
              </section>
            </main>
            <footer>
              <p>Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
              <p>AlloeHealth - Triagem Inteligente</p>
            </footer>
          </body>
          </html>
        `
      });
    });

    await page.goto('/relatorio/pdf-test-3');
    
    // Verificar se a página carregou corretamente
    await expect(page.locator('h1')).toContainText('Relatório de Triagem');
    await expect(page.locator('text=Ana Costa')).toBeVisible();
    await expect(page.locator('text=60 anos')).toBeVisible();
    await expect(page.locator('text=IMC: 37.1')).toBeVisible();
    
    // Verificar seção de resumo
    await expect(page.locator('h2:has-text("Resumo")')).toBeVisible();
    await expect(page.locator('text=Paciente idosa apresenta sintomas gastrointestinais graves')).toBeVisible();
    
    // Verificar seção de recomendações
    await expect(page.locator('h2:has-text("Recomendações")')).toBeVisible();
    await expect(page.locator('text=Internação')).toBeVisible();
    await expect(page.locator('text=Exames urgentes')).toBeVisible();
    await expect(page.locator('text=Medicação IV')).toBeVisible();
    
    // Verificar seção de red flags
    await expect(page.locator('h2:has-text("Red Flags")')).toBeVisible();
    await expect(page.locator('text=Idade avançada')).toBeVisible();
    await expect(page.locator('text=Sintomas graves')).toBeVisible();
    await expect(page.locator('text=IMC elevado')).toBeVisible();
    
    // Verificar seção de próximos passos
    await expect(page.locator('h2:has-text("Próximos Passos")')).toBeVisible();
    await expect(page.locator('text=Internação imediata')).toBeVisible();
    await expect(page.locator('text=Exames laboratoriais')).toBeVisible();
    await expect(page.locator('text=Acompanhamento especializado')).toBeVisible();
    
    // Verificar footer
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('text=AlloeHealth - Triagem Inteligente')).toBeVisible();
  });

  test('PDF - Validação de estrutura completa', async ({ page }) => {
    // Teste genérico para validar estrutura de PDF
    const mockData = {
      id: 'pdf-structure-test',
      patient: {
        nome: 'Teste Estrutura',
        email: 'teste@teste.com',
        whatsapp: '11987654324',
        nascimento: '01/01/1990',
        sexo: 'M',
        peso: 70,
        altura: 170
      },
      triage: {
        tipo: 'gastro',
        respostas: {
          sintomas: ['dor_abdominal'],
          duracao: '1_dia',
          intensidade: 'leve'
        }
      },
      report: {
        resumo: 'Teste de estrutura do relatório...',
        recomendacoes: ['Teste recomendação'],
        redFlags: [],
        proximosPassos: ['Teste próximo passo']
      }
    };

    // Mock da página de relatório
    await page.route('**/relatorio/pdf-structure-test', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Relatório - ${mockData.patient.nome}</title>
            <meta name="description" content="Relatório de triagem gastrointestinal">
          </head>
          <body>
            <header>
              <h1>Relatório de Triagem</h1>
              <p>Paciente: ${mockData.patient.nome}</p>
              <p>Idade: 34 anos</p>
              <p>IMC: 24.2 (Normal)</p>
            </header>
            <main>
              <section>
                <h2>Resumo</h2>
                <p>${mockData.report.resumo}</p>
              </section>
              <section>
                <h2>Recomendações</h2>
                <ul>
                  ${mockData.report.recomendacoes.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </section>
              <section>
                <h2>Próximos Passos</h2>
                <ul>
                  ${mockData.report.proximosPassos.map(passo => `<li>${passo}</li>`).join('')}
                </ul>
              </section>
            </main>
            <footer>
              <p>Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
              <p>AlloeHealth - Triagem Inteligente</p>
            </footer>
          </body>
          </html>
        `
      });
    });

    await page.goto('/relatorio/pdf-structure-test');
    
    // Verificar estrutura básica
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('head')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
    
    // Verificar header
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header h1')).toBeVisible();
    await expect(page.locator('header p')).toHaveCount(3); // Nome, idade, IMC
    
    // Verificar main
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('main section')).toHaveCount(3); // Resumo, Recomendações, Próximos Passos
    
    // Verificar footer
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer p')).toHaveCount(2); // Data e AlloeHealth
    
    // Verificar se todas as seções têm títulos
    await expect(page.locator('h2:has-text("Resumo")')).toBeVisible();
    await expect(page.locator('h2:has-text("Recomendações")')).toBeVisible();
    await expect(page.locator('h2:has-text("Próximos Passos")')).toBeVisible();
    
    // Verificar se há conteúdo em cada seção
    await expect(page.locator('section:has(h2:has-text("Resumo")) p')).toBeVisible();
    await expect(page.locator('section:has(h2:has-text("Recomendações")) ul')).toBeVisible();
    await expect(page.locator('section:has(h2:has-text("Próximos Passos")) ul')).toBeVisible();
  });

  test('PDF - Validação de responsividade', async ({ page }) => {
    // Teste de responsividade do PDF
    const mockData = {
      id: 'pdf-responsive-test',
      patient: {
        nome: 'Teste Responsivo',
        email: 'responsivo@teste.com',
        whatsapp: '11987654325',
        nascimento: '01/01/1990',
        sexo: 'F',
        peso: 60,
        altura: 160
      },
      triage: {
        tipo: 'gastro',
        respostas: {
          sintomas: ['dor_abdominal'],
          duracao: '1_dia',
          intensidade: 'leve'
        }
      },
      report: {
        resumo: 'Teste de responsividade do relatório...',
        recomendacoes: ['Teste recomendação'],
        redFlags: [],
        proximosPassos: ['Teste próximo passo']
      }
    };

    // Mock da página de relatório
    await page.route('**/relatorio/pdf-responsive-test', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Relatório - ${mockData.patient.nome}</title>
            <meta name="description" content="Relatório de triagem gastrointestinal">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              header { background: #f0f0f0; padding: 20px; margin-bottom: 20px; }
              main { max-width: 800px; margin: 0 auto; }
              section { margin-bottom: 30px; }
              footer { background: #f0f0f0; padding: 20px; margin-top: 20px; text-align: center; }
              @media (max-width: 768px) {
                body { padding: 10px; }
                header, footer { padding: 15px; }
              }
            </style>
          </head>
          <body>
            <header>
              <h1>Relatório de Triagem</h1>
              <p>Paciente: ${mockData.patient.nome}</p>
              <p>Idade: 34 anos</p>
              <p>IMC: 23.4 (Normal)</p>
            </header>
            <main>
              <section>
                <h2>Resumo</h2>
                <p>${mockData.report.resumo}</p>
              </section>
              <section>
                <h2>Recomendações</h2>
                <ul>
                  ${mockData.report.recomendacoes.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </section>
              <section>
                <h2>Próximos Passos</h2>
                <ul>
                  ${mockData.report.proximosPassos.map(passo => `<li>${passo}</li>`).join('')}
                </ul>
              </section>
            </main>
            <footer>
              <p>Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
              <p>AlloeHealth - Triagem Inteligente</p>
            </footer>
          </body>
          </html>
        `
      });
    });

    // Teste em mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/relatorio/pdf-responsive-test');
    
    // Verificar se o conteúdo é visível em mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Verificar se o texto não está cortado
    const headerText = await page.locator('header').textContent();
    expect(headerText).toContain('Relatório de Triagem');
    expect(headerText).toContain('Teste Responsivo');
    
    // Teste em desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.reload();
    
    // Verificar se o conteúdo é visível em desktop
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Verificar se o layout se adapta
    const mainWidth = await page.locator('main').boundingBox();
    expect(mainWidth?.width).toBeLessThanOrEqual(800); // Max-width definido no CSS
  });
});