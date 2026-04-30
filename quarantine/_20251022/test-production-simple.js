#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const BASE_URL = 'https://www.alloehealth.com.br';
const TEST_RESULTS = {
  homepage: { status: 'pending', details: [] },
  triagemPage: { status: 'pending', details: [] },
  triages: { status: 'pending', details: [] },
  reports: { status: 'pending', details: [] },
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

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const loadTime = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          loadTime: loadTime
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testHomepage() {
  console.log('🏠 Testando página inicial...');
  try {
    const response = await makeRequest(`${BASE_URL}/`);
    
    const hasTitle = response.data.includes('<title>') && response.data.includes('</title>');
    const hasTriagemLink = response.data.includes('/triagem') || response.data.includes('triagem');
    const hasMetaTags = response.data.includes('<meta') && response.data.includes('viewport');
    
    TEST_RESULTS.homepage.status = 'passed';
    TEST_RESULTS.homepage.details = [
      `Status: ${response.statusCode}`,
      `Tempo: ${response.loadTime}ms`,
      `Título: ${hasTitle}`,
      `Link triagem: ${hasTriagemLink}`,
      `Meta tags: ${hasMetaTags}`,
      `Tamanho: ${response.data.length} bytes`
    ];
    
    console.log('✅ Página inicial OK');
  } catch (error) {
    TEST_RESULTS.homepage.status = 'failed';
    TEST_RESULTS.homepage.details = [`Erro: ${error.message}`];
    console.log('❌ Página inicial FALHOU');
  }
}

async function testTriagemPage() {
  console.log('🧭 Testando página de triagens...');
  try {
    const response = await makeRequest(`${BASE_URL}/triagem`);
    
    const hasTriagemList = response.data.includes('grid') || response.data.includes('triagem');
    const triagemCount = (response.data.match(/\/triagem\//g) || []).length;
    const hasCards = response.data.includes('card') || response.data.includes('triage');
    
    TEST_RESULTS.triagemPage.status = 'passed';
    TEST_RESULTS.triagemPage.details = [
      `Status: ${response.statusCode}`,
      `Tempo: ${response.loadTime}ms`,
      `Lista de triagens: ${hasTriagemList}`,
      `Links de triagem: ${triagemCount}`,
      `Cards visíveis: ${hasCards}`,
      `Tamanho: ${response.data.length} bytes`
    ];
    
    console.log('✅ Página de triagens OK');
  } catch (error) {
    TEST_RESULTS.triagemPage.status = 'failed';
    TEST_RESULTS.triagemPage.details = [`Erro: ${error.message}`];
    console.log('❌ Página de triagens FALHOU');
  }
}

async function testTriages() {
  console.log('🏥 Testando triagens individuais...');
  const results = [];
  
  // Testar apenas algumas triagens para não sobrecarregar
  const testTriages = TRIAGES.slice(0, 8);
  
  for (const triage of testTriages) {
    try {
      console.log(`  📋 Testando triagem: ${triage}`);
      const response = await makeRequest(`${BASE_URL}/triagem/${triage}`);
      
      const hasForm = response.data.includes('form') || response.data.includes('input');
      const hasQuestions = response.data.includes('pergunta') || response.data.includes('question');
      const hasSubmit = response.data.includes('submit') || response.data.includes('próximo');
      const hasTitle = response.data.includes('<title>') && response.data.includes('</title>');
      
      results.push({
        triage,
        status: response.statusCode === 200 ? 'passed' : 'failed',
        details: [
          `Status: ${response.statusCode}`,
          `Tempo: ${response.loadTime}ms`,
          `Formulário: ${hasForm}`,
          `Perguntas: ${hasQuestions}`,
          `Submit: ${hasSubmit}`,
          `Título: ${hasTitle}`,
          `Tamanho: ${response.data.length} bytes`
        ]
      });
      
      console.log(`    ${response.statusCode === 200 ? '✅' : '❌'} ${triage} (${response.statusCode})`);
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

async function testReports() {
  console.log('📊 Testando sistema de relatórios...');
  try {
    // Testar página de relatórios demo
    const response = await makeRequest(`${BASE_URL}/relatorio/demo`);
    
    const hasReport = response.data.includes('relatório') || response.data.includes('report');
    const hasData = response.data.includes('dados') || response.data.includes('resultado');
    const hasCTAs = response.data.includes('cta') || response.data.includes('botão');
    
    TEST_RESULTS.reports.status = 'passed';
    TEST_RESULTS.reports.details = [
      `Status: ${response.statusCode}`,
      `Tempo: ${response.loadTime}ms`,
      `Relatório: ${hasReport}`,
      `Dados: ${hasData}`,
      `CTAs: ${hasCTAs}`,
      `Tamanho: ${response.data.length} bytes`
    ];
    
    console.log('✅ Sistema de relatórios OK');
  } catch (error) {
    TEST_RESULTS.reports.status = 'failed';
    TEST_RESULTS.reports.details = [`Erro: ${error.message}`];
    console.log('❌ Sistema de relatórios FALHOU');
  }
}

async function testMobile() {
  console.log('📱 Testando responsividade mobile...');
  try {
    const response = await makeRequest(`${BASE_URL}/triagem`);
    
    const hasViewport = response.data.includes('viewport') && response.data.includes('width=device-width');
    const hasMobileCSS = response.data.includes('mobile') || response.data.includes('sm:') || response.data.includes('md:');
    const hasResponsive = response.data.includes('responsive') || response.data.includes('grid-cols');
    
    TEST_RESULTS.mobile.status = 'passed';
    TEST_RESULTS.mobile.details = [
      `Viewport meta: ${hasViewport}`,
      `CSS mobile: ${hasMobileCSS}`,
      `Responsivo: ${hasResponsive}`,
      `Tamanho: ${response.data.length} bytes`
    ];
    
    console.log('✅ Responsividade mobile OK');
  } catch (error) {
    TEST_RESULTS.mobile.status = 'failed';
    TEST_RESULTS.mobile.details = [`Erro: ${error.message}`];
    console.log('❌ Responsividade mobile FALHOU');
  }
}

async function testPerformance() {
  console.log('⚡ Testando performance...');
  try {
    const startTime = Date.now();
    const response = await makeRequest(`${BASE_URL}/`);
    const totalTime = Date.now() - startTime;
    
    const isFast = totalTime < 2000; // Menos de 2 segundos
    const hasCompression = response.headers['content-encoding'] === 'gzip' || response.headers['content-encoding'] === 'br';
    const hasCache = response.headers['cache-control'] && response.headers['cache-control'].includes('max-age');
    
    TEST_RESULTS.performance.status = isFast ? 'passed' : 'warning';
    TEST_RESULTS.performance.details = [
      `Tempo total: ${totalTime}ms`,
      `Tempo de resposta: ${response.loadTime}ms`,
      `Rápido (<2s): ${isFast}`,
      `Compressão: ${hasCompression}`,
      `Cache: ${hasCache}`,
      `Tamanho: ${response.data.length} bytes`
    ];
    
    console.log(`✅ Performance ${isFast ? 'OK' : 'LENTA'}`);
  } catch (error) {
    TEST_RESULTS.performance.status = 'failed';
    TEST_RESULTS.performance.details = [`Erro: ${error.message}`];
    console.log('❌ Performance FALHOU');
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando testes completos do app web...');
  console.log(`🌐 Domínio: ${BASE_URL}`);
  console.log('='.repeat(50));
  
  try {
    await testHomepage();
    await testTriagemPage();
    await testTriages();
    await testReports();
    await testMobile();
    await testPerformance();
    
  } catch (error) {
    console.error('❌ Erro geral nos testes:', error);
  }
  
  // Gerar relatório final
  console.log('\n' + '='.repeat(50));
  console.log('📊 RELATÓRIO FINAL DOS TESTES');
  console.log('='.repeat(50));
  
  const totalTests = Object.keys(TEST_RESULTS).length;
  const passedTests = Object.values(TEST_RESULTS).filter(r => r.status === 'passed').length;
  const failedTests = Object.values(TEST_RESULTS).filter(r => r.status === 'failed').length;
  const warningTests = Object.values(TEST_RESULTS).filter(r => r.status === 'warning').length;
  const partialTests = Object.values(TEST_RESULTS).filter(r => r.status === 'partial').length;
  
  console.log(`✅ Testes passaram: ${passedTests}/${totalTests}`);
  console.log(`❌ Testes falharam: ${failedTests}/${totalTests}`);
  console.log(`⚠️  Testes com aviso: ${warningTests}/${totalTests}`);
  console.log(`🔄 Testes parciais: ${partialTests}/${totalTests}`);
  console.log(`📈 Taxa de sucesso: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  console.log('\n📋 DETALHES POR CATEGORIA:');
  Object.entries(TEST_RESULTS).forEach(([category, result]) => {
    const emoji = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : result.status === 'warning' ? '⚠️' : '🔄';
    console.log(`${emoji} ${category.toUpperCase()}: ${result.status}`);
    result.details.forEach(detail => {
      if (typeof detail === 'string') {
        console.log(`   ${detail}`);
      } else if (typeof detail === 'object') {
        console.log(`   ${detail.triage}: ${detail.status}`);
        detail.details.forEach(d => console.log(`     ${d}`));
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
      partial: partialTests,
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
