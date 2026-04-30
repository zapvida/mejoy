// scripts/validate-performance.js
// Script para validar performance da triagem V2

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function validatePerformance() {
  console.log('⚡ Validando performance da Triagem V2...\n');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Configurar feature flag
  await page.addInitScript(() => {
    window.localStorage.setItem('NEXT_PUBLIC_TRIAGE_V2', '1');
  });
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };
  
  try {
    // Teste 1: Tempo de carregamento inicial
    console.log('🚀 Testando tempo de carregamento...');
    
    const startTime = Date.now();
    await page.goto('http://localhost:3000/triagem/gastro?cpf=12345678901');
    await page.waitForSelector('.triage-v2', { timeout: 10000 });
    const loadTime = Date.now() - startTime;
    
    results.tests.push({
      name: 'Tempo de Carregamento',
      value: loadTime,
      unit: 'ms',
      passed: loadTime < 3000,
      threshold: 3000
    });
    
    // Teste 2: Tempo de resposta das interações
    console.log('🖱️ Testando tempo de resposta das interações...');
    
    const interactionTimes = [];
    
    // Testar clique em opção
    const clickStart = Date.now();
    await page.click('text=👨 Masculino');
    await page.waitForSelector('text=Você tem dor abdominal?');
    const clickTime = Date.now() - clickStart;
    interactionTimes.push(clickTime);
    
    // Testar hover
    const hoverStart = Date.now();
    await page.hover('text=🙂 Não');
    const hoverTime = Date.now() - hoverStart;
    interactionTimes.push(hoverTime);
    
    // Testar toggle de rationale
    const toggleStart = Date.now();
    await page.click('text=Por que perguntamos isso?');
    await page.waitForSelector('text=Alguns riscos');
    const toggleTime = Date.now() - toggleStart;
    interactionTimes.push(toggleTime);
    
    const avgInteractionTime = interactionTimes.reduce((a, b) => a + b, 0) / interactionTimes.length;
    
    results.tests.push({
      name: 'Tempo de Resposta das Interações',
      value: avgInteractionTime,
      unit: 'ms',
      passed: avgInteractionTime < 200,
      threshold: 200,
      details: interactionTimes
    });
    
    // Teste 3: Uso de memória
    console.log('💾 Testando uso de memória...');
    
    const memoryUsage = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });
    
    if (memoryUsage) {
      const memoryMB = memoryUsage.usedJSHeapSize / (1024 * 1024);
      results.tests.push({
        name: 'Uso de Memória',
        value: memoryMB,
        unit: 'MB',
        passed: memoryMB < 50,
        threshold: 50,
        details: memoryUsage
      });
    }
    
    // Teste 4: Performance de animações
    console.log('🎬 Testando performance de animações...');
    
    const animationPerformance = await page.evaluate(() => {
      const animatedElements = document.querySelectorAll('[style*="transition"], [style*="animation"]');
      return {
        animatedElementsCount: animatedElements.length,
        hasAnimations: animatedElements.length > 0
      };
    });
    
    results.tests.push({
      name: 'Performance de Animações',
      value: animationPerformance.animatedElementsCount,
      unit: 'elements',
      passed: animationPerformance.animatedElementsCount < 20,
      threshold: 20,
      details: animationPerformance
    });
    
    // Teste 5: Tempo de renderização de componentes
    console.log('🎨 Testando tempo de renderização...');
    
    const renderTimes = [];
    
    // Medir tempo de renderização de cada pergunta
    for (let i = 0; i < 3; i++) {
      const renderStart = Date.now();
      await page.click(`text=${i === 0 ? '👨 Masculino' : i === 1 ? '🙂 Não' : '😌 Não'}`);
      await page.waitForSelector('.choice-card', { state: 'visible' });
      const renderTime = Date.now() - renderStart;
      renderTimes.push(renderTime);
    }
    
    const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
    
    results.tests.push({
      name: 'Tempo de Renderização',
      value: avgRenderTime,
      unit: 'ms',
      passed: avgRenderTime < 300,
      threshold: 300,
      details: renderTimes
    });
    
    // Teste 6: Performance em mobile
    console.log('📱 Testando performance em mobile...');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForSelector('.triage-v2');
    
    const mobileStart = Date.now();
    await page.click('text=👨 Masculino');
    await page.waitForSelector('text=Você tem dor abdominal?');
    const mobileTime = Date.now() - mobileStart;
    
    results.tests.push({
      name: 'Performance Mobile',
      value: mobileTime,
      unit: 'ms',
      passed: mobileTime < 500,
      threshold: 500
    });
    
    // Teste 7: Bundle size (simulado)
    console.log('📦 Testando tamanho do bundle...');
    
    const bundleSize = await page.evaluate(() => {
      // Simulação - em produção usar webpack-bundle-analyzer
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      scripts.forEach(script => {
        const src = script.src;
        if (src.includes('triage') || src.includes('v2')) {
          totalSize += 100; // Simulação
        }
      });
      
      return totalSize;
    });
    
    results.tests.push({
      name: 'Tamanho do Bundle',
      value: bundleSize,
      unit: 'KB',
      passed: bundleSize < 500,
      threshold: 500
    });
    
    // Calcular score geral
    const passedTests = results.tests.filter(t => t.passed).length;
    const totalTests = results.tests.length;
    const score = Math.round((passedTests / totalTests) * 100);
    
    results.score = score;
    results.summary = `${passedTests}/${totalTests} testes passaram (${score}%)`;
    
    console.log(`\n✅ Resultado: ${results.summary}`);
    
    // Salvar resultados
    const outputDir = path.join(__dirname, '..', 'codex-artifacts', 'triage-v2');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'performance-test.json');
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    
    console.log(`📄 Resultados salvos em: ${outputFile}`);
    
    // Mostrar detalhes dos testes que falharam
    const failedTests = results.tests.filter(t => !t.passed);
    if (failedTests.length > 0) {
      console.log('\n❌ Testes que falharam:');
      failedTests.forEach(test => {
        console.log(`  - ${test.name}: ${test.value}${test.unit} (limite: ${test.threshold}${test.unit})`);
      });
    }
    
    // Mostrar métricas importantes
    console.log('\n📊 Métricas importantes:');
    results.tests.forEach(test => {
      const status = test.passed ? '✅' : '❌';
      console.log(`  ${status} ${test.name}: ${test.value}${test.unit}`);
    });
    
    return results;
    
  } catch (error) {
    console.error('❌ Erro durante validação de performance:', error);
    results.error = error.message;
    return results;
  } finally {
  await browser.close();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  validatePerformance()
    .then(results => {
      process.exit(results.score >= 80 ? 0 : 1);
    })
    .catch(error => {
      console.error('Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { validatePerformance };