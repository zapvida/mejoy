// scripts/test-e2e-basic.js
// Teste E2E básico para validação de funcionalidades críticas

const { chromium } = require('playwright');

async function runBasicE2ETests() {
  console.log('🧪 Iniciando testes E2E básicos...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  const test = async (name, fn) => {
    try {
      console.log(`⏳ Testando: ${name}`);
      await fn();
      console.log(`✅ Passou: ${name}\n`);
      results.passed++;
      results.tests.push({ name, status: 'passed' });
    } catch (error) {
      console.log(`❌ Falhou: ${name}`);
      console.log(`   Erro: ${error.message}\n`);
      results.failed++;
      results.tests.push({ name, status: 'failed', error: error.message });
    }
  };

  // Teste 1: Página inicial carrega
  await test('Página inicial carrega', async () => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('h1', { timeout: 10000 });
    const title = await page.textContent('h1');
    if (!title || title.length < 5) {
      throw new Error('Título não encontrado ou muito curto');
    }
  });

  // Teste 2: Navegação para triagens
  await test('Navegação para triagens', async () => {
    await page.goto('http://localhost:3000');
    const triagemLink = await page.waitForSelector('a[href*="triagem"]', { timeout: 5000 });
    if (!triagemLink) {
      throw new Error('Link para triagens não encontrado');
    }
    await triagemLink.click();
    await page.waitForURL('**/triagem**', { timeout: 10000 });
  });

  // Teste 3: Página de assinatura
  await test('Página de assinatura carrega', async () => {
    await page.goto('http://localhost:3000/assinatura');
    await page.waitForSelector('h1', { timeout: 10000 });
    const title = await page.textContent('h1');
    if (!title.includes('triagens')) {
      throw new Error('Título da página de assinatura incorreto');
    }
  });

  // Teste 4: Página de presente
  await test('Página de presente carrega', async () => {
    await page.goto('http://localhost:3000/presente');
    await page.waitForSelector('h1', { timeout: 10000 });
    const title = await page.textContent('h1');
    if (!title.includes('Presentear')) {
      throw new Error('Título da página de presente incorreto');
    }
  });

  // Teste 5: Páginas legais
  await test('Páginas legais carregam', async () => {
    const legalPages = ['/termos', '/privacidade', '/reembolso'];
    for (const path of legalPages) {
      await page.goto(`http://localhost:3000${path}`);
      await page.waitForSelector('h1', { timeout: 10000 });
      const title = await page.textContent('h1');
      if (!title || title.length < 5) {
        throw new Error(`Título não encontrado em ${path}`);
      }
    }
  });

  // Teste 6: Responsividade básica
  await test('Responsividade básica', async () => {
    await page.goto('http://localhost:3000');
    
    // Testar mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Testar desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
  });

  // Teste 7: Performance básica
  await test('Performance básica', async () => {
    await page.goto('http://localhost:3000');
    
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0
      };
    });

    if (performanceMetrics.loadTime > 5000) {
      throw new Error(`Tempo de carregamento muito alto: ${performanceMetrics.loadTime}ms`);
    }
  });

  await browser.close();

  // Relatório final
  console.log('📊 Relatório Final:');
  console.log(`✅ Testes passaram: ${results.passed}`);
  console.log(`❌ Testes falharam: ${results.failed}`);
  console.log(`📈 Taxa de sucesso: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%\n`);

  if (results.failed > 0) {
    console.log('❌ Testes que falharam:');
    results.tests
      .filter(t => t.status === 'failed')
      .forEach(t => console.log(`   - ${t.name}: ${t.error}`));
  }

  return results.failed === 0;
}

// Executar se chamado diretamente
if (require.main === module) {
  runBasicE2ETests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Erro ao executar testes:', error);
      process.exit(1);
    });
}

module.exports = { runBasicE2ETests };
