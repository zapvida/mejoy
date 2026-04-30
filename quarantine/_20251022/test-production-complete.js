#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'https://www.alloehealth.com.br';
const TEST_RESULTS = {
  homepage: { status: 'pending', details: [] },
  navigation: { status: 'pending', details: [] },
  triages: { status: 'pending', details: [] },
  reports: { status: 'pending', details: [] },
  ctas: { status: 'pending', details: [] },
  mobile: { status: 'pending', details: [] },
  performance: { status: 'pending', details: [] }
};

// Lista de todas as triagens para testar
const TRIAGES = [
  'cardiovascular', 'diabetes-metabolismo', 'dor-cronica', 'coluna', 'respiratoria',
  'renal', 'hepatica', 'mulher', 'prostata', 'tireoide', 'mama', 'ocular',
  'auditiva', 'pele', 'alergias', 'sexual', 'idoso', 'bucal', 'crianca',
  'trabalhador', 'longevidade', 'vitalidade', 'microbioma', 'micronutrientes',
  'biohacking', 'gastro', 'testeSaude'
];

async function testHomepage(page) {
  console.log('🏠 Testando página inicial...');
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    
    // Verificar elementos essenciais
    const title = await page.title();
    const hasHero = await page.locator('h1, h2').first().isVisible();
    const hasTriagemLink = await page.locator('a[href*="triagem"]').first().isVisible();
    
    TEST_RESULTS.homepage.status = 'passed';
    TEST_RESULTS.homepage.details = [
      `Título: ${title}`,
      `Hero visível: ${hasHero}`,
      `Link triagem: ${hasTriagemLink}`
    ];
    
    console.log('✅ Página inicial OK');
  } catch (error) {
    TEST_RESULTS.homepage.status = 'failed';
    TEST_RESULTS.homepage.details = [`Erro: ${error.message}`];
    console.log('❌ Página inicial FALHOU');
  }
}

async function testNavigation(page) {
  console.log('🧭 Testando navegação...');
  try {
    await page.goto(`${BASE_URL}/triagem`, { waitUntil: 'networkidle' });
    
    const hasTriagemList = await page.locator('[data-testid="triagem-list"], .grid, .flex').isVisible();
    const triagemCount = await page.locator('a[href*="/triagem/"]').count();
    
    TEST_RESULTS.navigation.status = 'passed';
    TEST_RESULTS.navigation.details = [
      `Lista de triagens visível: ${hasTriagemList}`,
      `Número de triagens encontradas: ${triagemCount}`
    ];
    
    console.log('✅ Navegação OK');
  } catch (error) {
    TEST_RESULTS.navigation.status = 'failed';
    TEST_RESULTS.navigation.details = [`Erro: ${error.message}`];
    console.log('❌ Navegação FALHOU');
  }
}

async function testTriages(page) {
  console.log('🏥 Testando triagens...');
  const results = [];
  
  for (const triage of TRIAGES.slice(0, 5)) { // Testar apenas 5 para não sobrecarregar
    try {
      console.log(`  📋 Testando triagem: ${triage}`);
      await page.goto(`${BASE_URL}/triagem/${triage}`, { waitUntil: 'networkidle' });
      
      const hasForm = await page.locator('form, [data-testid="triage-form"]').isVisible();
      const hasQuestions = await page.locator('input, select, textarea').count() > 0;
      const hasSubmit = await page.locator('button[type="submit"], button:has-text("Próximo")').isVisible();
      
      results.push({
        triage,
        status: hasForm && hasQuestions && hasSubmit ? 'passed' : 'failed',
        details: [
          `Formulário visível: ${hasForm}`,
          `Perguntas encontradas: ${hasQuestions}`,
          `Botão submit: ${hasSubmit}`
        ]
      });
      
      console.log(`    ${hasForm && hasQuestions && hasSubmit ? '✅' : '❌'} ${triage}`);
    } catch (error) {
      results.push({
        triage,
        status: 'failed',
        details: [`Erro: ${error.message}`]
      });
      console.log(`    ❌ ${triage} - ERRO`);
    }
  }
  
  TEST_RESULTS.triages.status = results.every(r => r.status === 'passed') ? 'passed' : 'partial';
  TEST_RESULTS.triages.details = results;
}

async function testMobileResponsiveness(page) {
  console.log('📱 Testando responsividade mobile...');
  try {
    // Simular dispositivo móvel
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(`${BASE_URL}/triagem`, { waitUntil: 'networkidle' });
    
    const isResponsive = await page.evaluate(() => {
      const body = document.body;
      return body.offsetWidth <= 375 && !window.innerWidth > 375;
    });
    
    const hasMobileMenu = await page.locator('button:has-text("Menu"), [data-testid="mobile-menu"]').isVisible();
    
    TEST_RESULTS.mobile.status = 'passed';
    TEST_RESULTS.mobile.details = [
      `Responsivo: ${isResponsive}`,
      `Menu mobile: ${hasMobileMenu}`
    ];
    
    console.log('✅ Responsividade mobile OK');
  } catch (error) {
    TEST_RESULTS.mobile.status = 'failed';
    TEST_RESULTS.mobile.details = [`Erro: ${error.message}`];
    console.log('❌ Responsividade mobile FALHOU');
  }
}

async function testPerformance(page) {
  console.log('⚡ Testando performance...');
  try {
    const startTime = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });
    
    const isFast = loadTime < 3000; // Menos de 3 segundos
    
    TEST_RESULTS.performance.status = isFast ? 'passed' : 'warning';
    TEST_RESULTS.performance.details = [
      `Tempo de carregamento: ${loadTime}ms`,
      `DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`,
      `Load Complete: ${performanceMetrics.loadComplete}ms`,
      `Rápido (<3s): ${isFast}`
    ];
    
    console.log(`✅ Performance ${isFast ? 'OK' : 'LENTA'}`);
  } catch (error) {
    TEST_RESULTS.performance.status = 'failed';
    TEST_RESULTS.performance.details = [`Erro: ${error.message}`];
    console.log('❌ Performance FALHOU');
  }
}

async function testCTAs(page) {
  console.log('🎯 Testando CTAs...');
  try {
    await page.goto(`${BASE_URL}/triagem/cardiovascular`, { waitUntil: 'networkidle' });
    
    // Simular preenchimento básico da triagem
    const inputs = await page.locator('input, select').all();
    for (let i = 0; i < Math.min(3, inputs.length); i++) {
      const input = inputs[i];
      const type = await input.getAttribute('type');
      const tagName = await input.evaluate(el => el.tagName);
      
      if (type === 'text' || tagName === 'INPUT') {
        await input.fill('Teste');
      } else if (type === 'radio' || type === 'checkbox') {
        await input.check();
      }
    }
    
    // Tentar encontrar e clicar em CTAs
    const ctaButtons = await page.locator('a:has-text("Falar"), a:has-text("Ver"), button:has-text("Falar"), button:has-text("Ver")').all();
    const ctaCount = ctaButtons.length;
    
    TEST_RESULTS.ctas.status = ctaCount > 0 ? 'passed' : 'warning';
    TEST_RESULTS.ctas.details = [
      `CTAs encontrados: ${ctaCount}`,
      `CTAs ZapVida/Alloe: ${ctaCount > 0}`
    ];
    
    console.log(`✅ CTAs ${ctaCount > 0 ? 'OK' : 'NÃO ENCONTRADOS'}`);
  } catch (error) {
    TEST_RESULTS.ctas.status = 'failed';
    TEST_RESULTS.ctas.details = [`Erro: ${error.message}`];
    console.log('❌ CTAs FALHARAM');
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando testes completos do app web...');
  console.log(`🌐 Domínio: ${BASE_URL}`);
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    await testHomepage(page);
    await testNavigation(page);
    await testTriages(page);
    await testMobileResponsiveness(page);
    await testPerformance(page);
    await testCTAs(page);
    
  } catch (error) {
    console.error('❌ Erro geral nos testes:', error);
  } finally {
    await browser.close();
  }
  
  // Gerar relatório final
  console.log('\n' + '='.repeat(50));
  console.log('📊 RELATÓRIO FINAL DOS TESTES');
  console.log('='.repeat(50));
  
  const totalTests = Object.keys(TEST_RESULTS).length;
  const passedTests = Object.values(TEST_RESULTS).filter(r => r.status === 'passed').length;
  const failedTests = Object.values(TEST_RESULTS).filter(r => r.status === 'failed').length;
  const warningTests = Object.values(TEST_RESULTS).filter(r => r.status === 'warning').length;
  
  console.log(`✅ Testes passaram: ${passedTests}/${totalTests}`);
  console.log(`❌ Testes falharam: ${failedTests}/${totalTests}`);
  console.log(`⚠️  Testes com aviso: ${warningTests}/${totalTests}`);
  console.log(`📈 Taxa de sucesso: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  console.log('\n📋 DETALHES POR CATEGORIA:');
  Object.entries(TEST_RESULTS).forEach(([category, result]) => {
    const emoji = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⚠️';
    console.log(`${emoji} ${category.toUpperCase()}: ${result.status}`);
    result.details.forEach(detail => {
      if (typeof detail === 'string') {
        console.log(`   ${detail}`);
      } else if (typeof detail === 'object') {
        console.log(`   ${detail.triage}: ${detail.status}`);
      }
    });
  });
  
  // Salvar relatório em arquivo
  const reportData = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      warnings: warningTests,
      successRate: Math.round((passedTests / totalTests) * 100)
    },
    results: TEST_RESULTS
  };
  
  fs.writeFileSync('test-results-production.json', JSON.stringify(reportData, null, 2));
  console.log('\n💾 Relatório salvo em: test-results-production.json');
  
  return reportData;
}

// Executar testes
runAllTests().catch(console.error);
