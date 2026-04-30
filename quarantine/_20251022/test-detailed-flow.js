#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const BASE_URL = 'https://www.alloehealth.com.br';

async function testCompleteTriageFlow() {
  console.log('🔄 Testando fluxo completo de triagem...');
  
  try {
    // 1. Testar página de triagens
    console.log('  📋 1. Acessando página de triagens...');
    const triagemPage = await makeRequest(`${BASE_URL}/triagem`);
    
    if (triagemPage.statusCode !== 200) {
      throw new Error(`Página de triagens retornou ${triagemPage.statusCode}`);
    }
    
    console.log('    ✅ Página de triagens carregada');
    
    // 2. Testar uma triagem específica (cardiovascular)
    console.log('  ❤️ 2. Testando triagem cardiovascular...');
    const triagePage = await makeRequest(`${BASE_URL}/triagem/cardiovascular`);
    
    if (triagePage.statusCode !== 200) {
      throw new Error(`Triagem cardiovascular retornou ${triagePage.statusCode}`);
    }
    
    console.log('    ✅ Triagem cardiovascular carregada');
    
    // 3. Verificar se tem formulário
    const hasForm = triagePage.data.includes('form') || triagePage.data.includes('input');
    const hasQuestions = triagePage.data.includes('pergunta') || triagePage.data.includes('question');
    
    console.log(`    📝 Formulário: ${hasForm ? '✅' : '❌'}`);
    console.log(`    ❓ Perguntas: ${hasQuestions ? '✅' : '❌'}`);
    
    // 4. Testar outras triagens importantes
    const importantTriages = ['diabetes-metabolismo', 'dor-cronica', 'mulher', 'prostata'];
    
    for (const triage of importantTriages) {
      console.log(`  🏥 Testando triagem ${triage}...`);
      const response = await makeRequest(`${BASE_URL}/triagem/${triage}`);
      
      if (response.statusCode === 200) {
        console.log(`    ✅ ${triage} - OK`);
      } else {
        console.log(`    ❌ ${triage} - ERRO ${response.statusCode}`);
      }
    }
    
    console.log('✅ Fluxo de triagem testado com sucesso!');
    return true;
    
  } catch (error) {
    console.log(`❌ Erro no fluxo de triagem: ${error.message}`);
    return false;
  }
}

async function testMobileSpecific() {
  console.log('📱 Testando funcionalidades específicas mobile...');
  
  try {
    // Testar com User-Agent mobile
    const mobileResponse = await makeRequestWithUA(`${BASE_URL}/triagem`, 
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15');
    
    const hasMobileViewport = mobileResponse.data.includes('viewport') && 
                              mobileResponse.data.includes('width=device-width');
    const hasResponsiveCSS = mobileResponse.data.includes('sm:') || 
                            mobileResponse.data.includes('md:') || 
                            mobileResponse.data.includes('lg:');
    const hasTouchFriendly = mobileResponse.data.includes('touch') || 
                            mobileResponse.data.includes('tap');
    
    console.log(`  📱 Viewport mobile: ${hasMobileViewport ? '✅' : '❌'}`);
    console.log(`  🎨 CSS responsivo: ${hasResponsiveCSS ? '✅' : '❌'}`);
    console.log(`  👆 Touch-friendly: ${hasTouchFriendly ? '✅' : '❌'}`);
    
    return hasMobileViewport && hasResponsiveCSS;
    
  } catch (error) {
    console.log(`❌ Erro no teste mobile: ${error.message}`);
    return false;
  }
}

async function testPerformanceDetailed() {
  console.log('⚡ Testando performance detalhada...');
  
  const pages = [
    { name: 'Homepage', url: '/' },
    { name: 'Triagens', url: '/triagem' },
    { name: 'Cardiovascular', url: '/triagem/cardiovascular' },
    { name: 'Relatório Demo', url: '/relatorio/demo' }
  ];
  
  const results = [];
  
  for (const page of pages) {
    const startTime = Date.now();
    const response = await makeRequest(`${BASE_URL}${page.url}`);
    const totalTime = Date.now() - startTime;
    
    const isFast = totalTime < 1000; // Menos de 1 segundo
    const sizeKB = Math.round(response.data.length / 1024);
    
    results.push({
      page: page.name,
      time: totalTime,
      size: sizeKB,
      fast: isFast,
      status: response.statusCode
    });
    
    console.log(`  ${isFast ? '✅' : '⚠️'} ${page.name}: ${totalTime}ms (${sizeKB}KB)`);
  }
  
  const avgTime = Math.round(results.reduce((sum, r) => sum + r.time, 0) / results.length);
  const allFast = results.every(r => r.fast);
  
  console.log(`📊 Tempo médio: ${avgTime}ms`);
  console.log(`🚀 Todas rápidas: ${allFast ? '✅' : '⚠️'}`);
  
  return allFast;
}

async function testAllTriages() {
  console.log('🏥 Testando todas as triagens disponíveis...');
  
  const allTriages = [
    'cardiovascular', 'diabetes-metabolismo', 'dor-cronica', 'coluna', 'respiratoria',
    'renal', 'hepatica', 'mulher', 'prostata', 'tireoide', 'mama', 'ocular',
    'auditiva', 'pele', 'alergias', 'sexual', 'idoso', 'bucal', 'crianca',
    'trabalhador', 'longevidade', 'vitalidade', 'microbioma', 'micronutrientes',
    'biohacking', 'gastro', 'testeSaude'
  ];
  
  const results = [];
  let successCount = 0;
  
  for (const triage of allTriages) {
    try {
      const response = await makeRequest(`${BASE_URL}/triagem/${triage}`);
      
      if (response.statusCode === 200) {
        successCount++;
        results.push({ triage, status: 'OK', time: response.loadTime });
      } else {
        results.push({ triage, status: `ERROR ${response.statusCode}`, time: 0 });
      }
    } catch (error) {
      results.push({ triage, status: 'FAILED', time: 0 });
    }
  }
  
  console.log(`📊 Triagens funcionando: ${successCount}/${allTriages.length}`);
  console.log(`📈 Taxa de sucesso: ${Math.round((successCount / allTriages.length) * 100)}%`);
  
  // Mostrar algumas que falharam
  const failed = results.filter(r => r.status !== 'OK');
  if (failed.length > 0) {
    console.log('❌ Triagens com problema:');
    failed.slice(0, 5).forEach(f => console.log(`   ${f.triage}: ${f.status}`));
  }
  
  return successCount === allTriages.length;
}

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

function makeRequestWithUA(url, userAgent) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const options = {
      headers: {
        'User-Agent': userAgent
      }
    };
    
    const req = https.get(url, options, (res) => {
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

async function runDetailedTests() {
  console.log('🚀 Iniciando testes detalhados do app web...');
  console.log(`🌐 Domínio: ${BASE_URL}`);
  console.log('='.repeat(60));
  
  const results = {
    triageFlow: false,
    mobile: false,
    performance: false,
    allTriages: false
  };
  
  try {
    results.triageFlow = await testCompleteTriageFlow();
    console.log('');
    
    results.mobile = await testMobileSpecific();
    console.log('');
    
    results.performance = await testPerformanceDetailed();
    console.log('');
    
    results.allTriages = await testAllTriages();
    console.log('');
    
  } catch (error) {
    console.error('❌ Erro geral nos testes:', error);
  }
  
  // Relatório final
  console.log('='.repeat(60));
  console.log('📊 RELATÓRIO FINAL DOS TESTES DETALHADOS');
  console.log('='.repeat(60));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r === true).length;
  const successRate = Math.round((passedTests / totalTests) * 100);
  
  console.log(`✅ Testes passaram: ${passedTests}/${totalTests}`);
  console.log(`📈 Taxa de sucesso: ${successRate}%`);
  console.log('');
  
  Object.entries(results).forEach(([test, passed]) => {
    const emoji = passed ? '✅' : '❌';
    const status = passed ? 'PASSOU' : 'FALHOU';
    console.log(`${emoji} ${test.toUpperCase()}: ${status}`);
  });
  
  console.log('');
  console.log('🎯 RESUMO:');
  if (successRate === 100) {
    console.log('🎉 TODOS OS TESTES PASSARAM! O app está funcionando perfeitamente!');
  } else if (successRate >= 75) {
    console.log('✅ A maioria dos testes passou. O app está funcionando bem!');
  } else {
    console.log('⚠️ Alguns testes falharam. Verificar problemas identificados.');
  }
  
  // Salvar relatório
  const reportData = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    summary: {
      total: totalTests,
      passed: passedTests,
      successRate: successRate
    },
    results: results
  };
  
  fs.writeFileSync('test-results-detailed.json', JSON.stringify(reportData, null, 2));
  console.log('\n💾 Relatório detalhado salvo em: test-results-detailed.json');
  
  return reportData;
}

// Executar testes
runDetailedTests().catch(console.error);
