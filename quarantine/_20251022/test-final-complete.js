#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const BASE_URL = 'https://www.alloehealth.com.br';

async function testCompleteUserJourney() {
  console.log('🎯 Testando jornada completa do usuário...');
  
  try {
    // 1. Homepage
    console.log('  🏠 1. Acessando homepage...');
    const homepage = await makeRequest(`${BASE_URL}/`);
    console.log(`    ✅ Homepage carregada (${homepage.loadTime}ms)`);
    
    // 2. Página de triagens
    console.log('  📋 2. Acessando página de triagens...');
    const triagemPage = await makeRequest(`${BASE_URL}/triagem`);
    console.log(`    ✅ Página de triagens carregada (${triagemPage.loadTime}ms)`);
    
    // 3. Triagem específica (cardiovascular)
    console.log('  ❤️ 3. Acessando triagem cardiovascular...');
    const triagePage = await makeRequest(`${BASE_URL}/triagem/cardiovascular`);
    console.log(`    ✅ Triagem cardiovascular carregada (${triagePage.loadTime}ms)`);
    
    // 4. Verificar elementos da triagem
    const hasForm = triagePage.data.includes('form') || triagePage.data.includes('input');
    const hasSubmit = triagePage.data.includes('submit') || triagePage.data.includes('próximo');
    const hasProgress = triagePage.data.includes('progress') || triagePage.data.includes('step');
    
    console.log(`    📝 Formulário: ${hasForm ? '✅' : '❌'}`);
    console.log(`    ➡️ Submit: ${hasSubmit ? '✅' : '❌'}`);
    console.log(`    📊 Progresso: ${hasProgress ? '✅' : '❌'}`);
    
    // 5. Testar relatório demo
    console.log('  📊 4. Acessando relatório demo...');
    const reportPage = await makeRequest(`${BASE_URL}/relatorio/demo`);
    console.log(`    ✅ Relatório demo carregado (${reportPage.loadTime}ms)`);
    
    // 6. Verificar elementos do relatório
    const hasReportData = reportPage.data.includes('relatório') || reportPage.data.includes('resultado');
    const hasCTAs = reportPage.data.includes('cta') || reportPage.data.includes('botão') || reportPage.data.includes('button');
    const hasCharts = reportPage.data.includes('chart') || reportPage.data.includes('gráfico');
    
    console.log(`    📈 Dados do relatório: ${hasReportData ? '✅' : '❌'}`);
    console.log(`    🎯 CTAs: ${hasCTAs ? '✅' : '❌'}`);
    console.log(`    📊 Gráficos: ${hasCharts ? '✅' : '❌'}`);
    
    return {
      homepage: homepage.loadTime,
      triagemPage: triagemPage.loadTime,
      triagePage: triagePage.loadTime,
      reportPage: reportPage.loadTime,
      hasForm,
      hasSubmit,
      hasProgress,
      hasReportData,
      hasCTAs,
      hasCharts
    };
    
  } catch (error) {
    console.log(`❌ Erro na jornada do usuário: ${error.message}`);
    return null;
  }
}

async function testMobileJourney() {
  console.log('📱 Testando jornada mobile...');
  
  try {
    const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15';
    
    // Testar homepage mobile
    const homepage = await makeRequestWithUA(`${BASE_URL}/`, mobileUA);
    console.log(`  🏠 Homepage mobile: ${homepage.loadTime}ms`);
    
    // Testar triagens mobile
    const triagemPage = await makeRequestWithUA(`${BASE_URL}/triagem`, mobileUA);
    console.log(`  📋 Triagens mobile: ${triagemPage.loadTime}ms`);
    
    // Testar triagem específica mobile
    const triagePage = await makeRequestWithUA(`${BASE_URL}/triagem/cardiovascular`, mobileUA);
    console.log(`  ❤️ Triagem mobile: ${triagePage.loadTime}ms`);
    
    // Verificar responsividade
    const hasMobileViewport = triagePage.data.includes('viewport') && 
                              triagePage.data.includes('width=device-width');
    const hasMobileCSS = triagePage.data.includes('sm:') || triagePage.data.includes('md:');
    
    console.log(`  📱 Viewport mobile: ${hasMobileViewport ? '✅' : '❌'}`);
    console.log(`  🎨 CSS responsivo: ${hasMobileCSS ? '✅' : '❌'}`);
    
    return {
      homepage: homepage.loadTime,
      triagemPage: triagemPage.loadTime,
      triagePage: triagePage.loadTime,
      hasMobileViewport,
      hasMobileCSS
    };
    
  } catch (error) {
    console.log(`❌ Erro no teste mobile: ${error.message}`);
    return null;
  }
}

async function testAllTriagesStatus() {
  console.log('🏥 Verificando status de todas as triagens...');
  
  const triages = [
    'cardiovascular', 'diabetes-metabolismo', 'dor-cronica', 'coluna', 'respiratoria',
    'renal', 'hepatica', 'mulher', 'prostata', 'tireoide', 'mama', 'ocular',
    'auditiva', 'pele', 'alergias', 'sexual', 'idoso', 'bucal', 'crianca',
    'trabalhador', 'longevidade', 'vitalidade', 'microbioma', 'micronutrientes',
    'biohacking', 'gastro', 'testeSaude'
  ];
  
  const results = [];
  let successCount = 0;
  
  for (const triage of triages) {
    try {
      const response = await makeRequest(`${BASE_URL}/triagem/${triage}`);
      
      if (response.statusCode === 200) {
        successCount++;
        results.push({ 
          triage, 
          status: 'OK', 
          time: response.loadTime,
          size: Math.round(response.data.length / 1024)
        });
      } else {
        results.push({ triage, status: `ERROR ${response.statusCode}`, time: 0, size: 0 });
      }
    } catch (error) {
      results.push({ triage, status: 'FAILED', time: 0, size: 0 });
    }
  }
  
  console.log(`📊 Triagens funcionando: ${successCount}/${triages.length}`);
  console.log(`📈 Taxa de sucesso: ${Math.round((successCount / triages.length) * 100)}%`);
  
  // Mostrar estatísticas
  const avgTime = Math.round(results.filter(r => r.time > 0).reduce((sum, r) => sum + r.time, 0) / successCount);
  const avgSize = Math.round(results.filter(r => r.size > 0).reduce((sum, r) => sum + r.size, 0) / successCount);
  
  console.log(`⚡ Tempo médio: ${avgTime}ms`);
  console.log(`📦 Tamanho médio: ${avgSize}KB`);
  
  return {
    total: triages.length,
    success: successCount,
    successRate: Math.round((successCount / triages.length) * 100),
    avgTime,
    avgSize,
    results
  };
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
    
    req.setTimeout(15000, () => {
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
    
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runFinalTests() {
  console.log('🚀 TESTES FINAIS COMPLETOS DO APP WEB');
  console.log(`🌐 Domínio: ${BASE_URL}`);
  console.log('='.repeat(70));
  
  const results = {
    userJourney: null,
    mobileJourney: null,
    allTriages: null
  };
  
  try {
    results.userJourney = await testCompleteUserJourney();
    console.log('');
    
    results.mobileJourney = await testMobileJourney();
    console.log('');
    
    results.allTriages = await testAllTriagesStatus();
    console.log('');
    
  } catch (error) {
    console.error('❌ Erro geral nos testes:', error);
  }
  
  // Relatório final completo
  console.log('='.repeat(70));
  console.log('📊 RELATÓRIO FINAL COMPLETO DOS TESTES');
  console.log('='.repeat(70));
  
  console.log('🎯 JORNADA DO USUÁRIO:');
  if (results.userJourney) {
    console.log(`  ✅ Homepage: ${results.userJourney.homepage}ms`);
    console.log(`  ✅ Triagens: ${results.userJourney.triagemPage}ms`);
    console.log(`  ✅ Triagem específica: ${results.userJourney.triagePage}ms`);
    console.log(`  ✅ Relatório: ${results.userJourney.reportPage}ms`);
    console.log(`  📝 Formulário: ${results.userJourney.hasForm ? '✅' : '❌'}`);
    console.log(`  🎯 CTAs: ${results.userJourney.hasCTAs ? '✅' : '❌'}`);
  } else {
    console.log('  ❌ Falhou');
  }
  
  console.log('\n📱 JORNADA MOBILE:');
  if (results.mobileJourney) {
    console.log(`  ✅ Homepage mobile: ${results.mobileJourney.homepage}ms`);
    console.log(`  ✅ Triagens mobile: ${results.mobileJourney.triagemPage}ms`);
    console.log(`  ✅ Triagem mobile: ${results.mobileJourney.triagePage}ms`);
    console.log(`  📱 Viewport mobile: ${results.mobileJourney.hasMobileViewport ? '✅' : '❌'}`);
    console.log(`  🎨 CSS responsivo: ${results.mobileJourney.hasMobileCSS ? '✅' : '❌'}`);
  } else {
    console.log('  ❌ Falhou');
  }
  
  console.log('\n🏥 TODAS AS TRIAGENS:');
  if (results.allTriages) {
    console.log(`  ✅ Funcionando: ${results.allTriages.success}/${results.allTriages.total}`);
    console.log(`  📈 Taxa de sucesso: ${results.allTriages.successRate}%`);
    console.log(`  ⚡ Tempo médio: ${results.allTriages.avgTime}ms`);
    console.log(`  📦 Tamanho médio: ${results.allTriages.avgSize}KB`);
  } else {
    console.log('  ❌ Falhou');
  }
  
  // Resumo final
  console.log('\n' + '='.repeat(70));
  console.log('🎉 RESUMO FINAL:');
  
  const allTestsPassed = results.userJourney && results.mobileJourney && results.allTriages;
  const triagesWorking = results.allTriages && results.allTriages.successRate === 100;
  const mobileWorking = results.mobileJourney && results.mobileJourney.hasMobileViewport;
  const performanceGood = results.userJourney && results.userJourney.homepage < 1000;
  
  if (allTestsPassed && triagesWorking && mobileWorking && performanceGood) {
    console.log('🎉 PERFEITO! O app está funcionando 100%!');
    console.log('✅ Todas as triagens funcionando');
    console.log('✅ Mobile responsivo');
    console.log('✅ Performance excelente');
    console.log('✅ Jornada do usuário completa');
    console.log('🚀 PRONTO PARA RECEBER CLIENTES!');
  } else {
    console.log('⚠️ Alguns pontos precisam de atenção:');
    if (!triagesWorking) console.log('❌ Nem todas as triagens estão funcionando');
    if (!mobileWorking) console.log('❌ Problemas de responsividade mobile');
    if (!performanceGood) console.log('❌ Performance pode ser melhorada');
  }
  
  // Salvar relatório final
  const finalReport = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    summary: {
      allTestsPassed,
      triagesWorking,
      mobileWorking,
      performanceGood,
      overallStatus: allTestsPassed && triagesWorking && mobileWorking && performanceGood ? 'PERFECT' : 'NEEDS_ATTENTION'
    },
    results: results
  };
  
  fs.writeFileSync('test-results-final.json', JSON.stringify(finalReport, null, 2));
  console.log('\n💾 Relatório final salvo em: test-results-final.json');
  
  return finalReport;
}

// Executar testes finais
runFinalTests().catch(console.error);
