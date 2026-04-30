#!/usr/bin/env node
// scripts/qa/production-test.js
// Teste completo pós-deploy em produção para gerar logs Vercel

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.alloehealth.com.br';

class ProductionTester {
  constructor() {
    this.results = [];
    this.currentSuite = null;
    this.totalRequests = 0;
    this.startTime = Date.now();
    
    console.log('🚀 AlloeHealth - Teste Completo Pós-Deploy em Produção');
    console.log('='.repeat(70));
    console.log(`🎯 Target: ${BASE_URL}`);
    console.log(`⏰ Início: ${new Date().toISOString()}`);
    console.log('='.repeat(70));
  }

  async runCompleteProductionTest() {
    console.log('\n📋 INICIANDO TESTE COMPLETO EM PRODUÇÃO...\n');

    // 1. Testes de Infraestrutura Básica
    await this.testBasicInfrastructure();
    
    // 2. Testes de Páginas Estáticas
    await this.testStaticPages();
    
    // 3. Testes de Triagens (Todas)
    await this.testAllTriages();
    
    // 4. Testes de APIs Críticas
    await this.testCriticalAPIs();
    
    // 5. Testes de APIs de Relatórios
    await this.testReportAPIs();
    
    // 6. Testes de APIs de PDF
    await this.testPDFAPIs();
    
    // 7. Testes de APIs Premium
    await this.testPremiumAPIs();
    
    // 8. Testes de APIs Admin (Segurança)
    await this.testAdminAPIs();
    
    // 9. Testes de APIs de Integração
    await this.testIntegrationAPIs();
    
    // 10. Testes de Performance
    await this.testPerformanceEndpoints();
    
    // 11. Testes de Funcionalidades Específicas
    await this.testSpecificFeatures();
    
    // 12. Testes de Stress (Múltiplas requisições)
    await this.testStressLoad();

    // Gerar relatório final
    this.generateProductionReport();
  }

  async testBasicInfrastructure() {
    this.startSuite('Infraestrutura Básica');
    
    const tests = [
      { name: 'Site Principal', url: '/', method: 'GET' },
      { name: 'Health Check API', url: '/api/health', method: 'GET' },
      { name: 'Health Check Legacy', url: '/api/healthcheck', method: 'GET' },
      { name: 'Sitemap XML', url: '/sitemap.xml', method: 'GET' },
      { name: 'Robots.txt', url: '/robots.txt', method: 'GET' },
      { name: 'Favicon', url: '/favicon.ico', method: 'GET' },
      { name: '404 Page', url: '/404', method: 'GET' },
      { name: 'Página Inexistente', url: '/pagina-inexistente-12345', method: 'GET' },
    ];

    for (const test of tests) {
      await this.testEndpoint(test.name, test.url, test.method);
    }

    this.endSuite();
  }

  async testStaticPages() {
    this.startSuite('Páginas Estáticas');
    
    const pages = [
      { name: 'Landing Page', url: '/' },
      { name: 'Triagem Geral', url: '/triagem' },
      { name: 'Triagem Gastro', url: '/triagem/gastro' },
      { name: 'Relatório Demo', url: '/relatorio/demo' },
      { name: 'FAQ', url: '/faq' },
      { name: 'Quem Somos', url: '/quem-somos' },
      { name: 'Política de Privacidade', url: '/privacidade' },
      { name: 'Termos de Uso', url: '/termos' },
      { name: 'Pricing', url: '/pricing' },
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Perfil', url: '/perfil' },
      { name: 'Relatórios', url: '/relatorios' },
      { name: 'Assinatura', url: '/assinatura' },
      { name: 'Billing', url: '/billing' },
      { name: 'Presente', url: '/presente' },
      { name: 'Resgatar', url: '/resgatar' },
      { name: 'Obrigado', url: '/obrigado' },
      { name: 'Disclaimer', url: '/disclaimer' },
      { name: 'Reembolso', url: '/reembolso' },
    ];

    for (const page of pages) {
      await this.testEndpoint(page.name, page.url);
    }

    this.endSuite();
  }

  async testAllTriages() {
    this.startSuite('Todas as Triagens');
    
    const triages = [
      'gastro', 'testeSaude', 'geral', 'geralRapida', 'mental', 'sono',
      'cardiovascular', 'diabetes-metabolismo', 'dor-cronica', 'coluna',
      'respiratoria', 'renal', 'hepatica', 'mulher', 'prostata', 'tireoide',
      'mama', 'ocular', 'auditiva', 'pele', 'alergias', 'sexual', 'idoso',
      'bucal', 'crianca', 'trabalhador', 'longevidade', 'vitalidade',
      'microbioma', 'micronutrientes', 'biohacking', 'cancer', 'enxaqueca',
      'obesidade', 'gestante', 'tabagismo', 'quimica', 'saudeMasculina',
      'estiloVidaModerna', 'estresseBurnout', 'jogosAzar', 'depressao', 'tdah'
    ];

    for (const triage of triages) {
      await this.testEndpoint(`Triagem ${triage}`, `/triagem/${triage}`);
    }

    this.endSuite();
  }

  async testCriticalAPIs() {
    this.startSuite('APIs Críticas');
    
    const apis = [
      { name: 'Health Check', url: '/api/health', method: 'GET' },
      { name: 'Triage Session', url: '/api/triage/session', method: 'POST' },
      { name: 'Triage Answer', url: '/api/triage/answer', method: 'POST' },
      { name: 'Triage Answer Insecure', url: '/api/triage/answer-insecure', method: 'POST' },
      { name: 'Triage Answer Secure', url: '/api/triage/answer-secure', method: 'POST' },
      { name: 'Triage Finalize', url: '/api/triage/finalize', method: 'POST' },
      { name: 'Generate Report', url: '/api/gerarRelatorio', method: 'POST' },
      { name: 'Test Environment', url: '/api/teste-env', method: 'GET' },
    ];

    for (const api of apis) {
      await this.testAPIEndpoint(api.name, api.url, api.method);
    }

    this.endSuite();
  }

  async testReportAPIs() {
    this.startSuite('APIs de Relatórios');
    
    const reportAPIs = [
      { name: 'WhatsApp Report', url: '/api/report/whatsapp', method: 'POST' },
      { name: 'Share Report', url: '/api/report/share', method: 'POST' },
    ];

    for (const api of reportAPIs) {
      await this.testAPIEndpoint(api.name, api.url, api.method);
    }

    this.endSuite();
  }

  async testPDFAPIs() {
    this.startSuite('APIs de PDF');
    
    const pdfAPIs = [
      { name: 'PDF Demo', url: '/api/pdf/demo', method: 'GET' },
      { name: 'PDF Demo Gastro', url: '/api/pdf/demo?triage=gastro', method: 'GET' },
      { name: 'PDF Demo Geral', url: '/api/pdf/demo?triage=geral', method: 'GET' },
      { name: 'PDF Optimized', url: '/api/pdf/optimized', method: 'POST' },
    ];

    for (const api of pdfAPIs) {
      await this.testPDFEndpoint(api.name, api.url, api.method);
    }

    this.endSuite();
  }

  async testPremiumAPIs() {
    this.startSuite('APIs Premium');
    
    const premiumAPIs = [
      { name: 'Stripe Checkout', url: '/api/stripe/checkout', method: 'POST' },
      { name: 'Create Checkout Session', url: '/api/stripe/create-checkout-session', method: 'POST' },
      { name: 'Create Portal Session', url: '/api/stripe/create-portal-session', method: 'POST' },
      { name: 'Stripe Webhook', url: '/api/stripe/webhook', method: 'POST' },
      { name: 'Gift Create', url: '/api/gift/create', method: 'POST' },
      { name: 'Gift Redeem', url: '/api/gift/redeem', method: 'POST' },
      { name: 'User Access Status', url: '/api/user/access-status', method: 'GET' },
      { name: 'User Delete Data', url: '/api/user/delete-data', method: 'POST' },
    ];

    for (const api of premiumAPIs) {
      await this.testAPIEndpoint(api.name, api.url, api.method);
    }

    this.endSuite();
  }

  async testAdminAPIs() {
    this.startSuite('APIs Admin (Segurança)');
    
    const adminAPIs = [
      { name: 'Admin Alerts', url: '/api/admin/alerts', method: 'GET' },
      { name: 'Admin KPIs', url: '/api/admin/kpis', method: 'GET' },
      { name: 'Admin Export', url: '/api/admin/export', method: 'GET' },
      { name: 'Admin Stats', url: '/api/admin/stats', method: 'GET' },
      { name: 'Admin Tech', url: '/api/admin/tech', method: 'GET' },
      { name: 'Admin Funnel', url: '/api/admin/funnel', method: 'GET' },
      { name: 'Admin Product', url: '/api/admin/product', method: 'GET' },
      { name: 'Admin Revenue', url: '/api/admin/revenue', method: 'GET' },
      { name: 'Admin Vercel Analytics', url: '/api/admin/vercel-analytics', method: 'GET' },
    ];

    for (const api of adminAPIs) {
      await this.testSecurityEndpoint(api.name, api.url, api.method);
    }

    this.endSuite();
  }

  async testIntegrationAPIs() {
    this.startSuite('APIs de Integração');
    
    const integrationAPIs = [
      { name: 'TTS Service', url: '/api/tts', method: 'POST' },
      { name: 'TTS Insecure', url: '/api/tts-insecure', method: 'POST' },
      { name: 'TTS Secure', url: '/api/tts-secure', method: 'POST' },
      { name: 'Meta Lead', url: '/api/meta-lead', method: 'POST' },
      { name: 'CRM Sink', url: '/api/crm/sink', method: 'POST' },
      { name: 'Chat Médico', url: '/api/chat-medico', method: 'POST' },
      { name: 'IA Médica', url: '/api/ia-medica', method: 'POST' },
      { name: 'Upload Logo', url: '/api/upload-logo', method: 'POST' },
      { name: 'LGPD Consent', url: '/api/lgpd/consent', method: 'POST' },
      { name: 'Privacy Delete Data', url: '/api/privacy/delete-data', method: 'POST' },
      { name: 'Privacy Export Data', url: '/api/privacy/export-data', method: 'POST' },
    ];

    for (const api of integrationAPIs) {
      await this.testAPIEndpoint(api.name, api.url, api.method);
    }

    this.endSuite();
  }

  async testPerformanceEndpoints() {
    this.startSuite('Testes de Performance');
    
    const perfTests = [
      { name: 'Landing Page Performance', url: '/' },
      { name: 'Triagem Gastro Performance', url: '/triagem/gastro' },
      { name: 'Relatório Demo Performance', url: '/relatorio/demo' },
      { name: 'FAQ Performance', url: '/faq' },
      { name: 'Pricing Performance', url: '/pricing' },
    ];

    for (const test of perfTests) {
      await this.testPerformanceEndpoint(test.name, test.url);
    }

    this.endSuite();
  }

  async testSpecificFeatures() {
    this.startSuite('Funcionalidades Específicas');
    
    const features = [
      { name: 'Relatório Demo Gastro', url: '/relatorio/demo?triage=gastro' },
      { name: 'Relatório Demo Geral', url: '/relatorio/demo?triage=geral' },
      { name: 'Relatório Demo Mental', url: '/relatorio/demo?triage=mental' },
      { name: 'Triagem com Parâmetros', url: '/triagem/gastro?utm_source=test' },
      { name: 'Dashboard com Auth', url: '/dashboard?auth=test' },
      { name: 'Perfil com ID', url: '/perfil?user=test' },
      { name: 'Billing com Session', url: '/billing?session=test' },
      { name: 'Checkout Sucesso', url: '/checkout/sucesso' },
      { name: 'Checkout Confirmação', url: '/checkout/confirmacao' },
      { name: 'Auth Callback', url: '/auth/callback' },
    ];

    for (const feature of features) {
      await this.testEndpoint(feature.name, feature.url);
    }

    this.endSuite();
  }

  async testStressLoad() {
    this.startSuite('Teste de Stress');
    
    console.log('🔥 Executando teste de stress com múltiplas requisições...');
    
    const stressTests = [
      { name: 'Landing Page (10x)', url: '/', count: 10 },
      { name: 'Triagem Gastro (5x)', url: '/triagem/gastro', count: 5 },
      { name: 'Relatório Demo (5x)', url: '/relatorio/demo', count: 5 },
      { name: 'Health Check (10x)', url: '/api/health', count: 10 },
      { name: 'PDF Demo (3x)', url: '/api/pdf/demo', count: 3 },
    ];

    for (const test of stressTests) {
      console.log(`   📊 ${test.name}...`);
      const promises = [];
      
      for (let i = 0; i < test.count; i++) {
        promises.push(this.makeRequest(test.url));
      }
      
      try {
        const results = await Promise.all(promises);
        const avgTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
        const successCount = results.filter(r => r.statusCode >= 200 && r.statusCode < 400).length;
        
        console.log(`   ✅ ${test.name}: ${successCount}/${test.count} sucessos (${Math.round(avgTime)}ms média)`);
        
        this.currentSuite?.tests.push({
          name: test.name,
          status: successCount === test.count ? 'PASS' : 'FAIL',
          responseTime: avgTime,
          statusCode: successCount === test.count ? 200 : 500,
          details: { successCount, totalCount: test.count }
        });
      } catch (error) {
        console.log(`   ❌ ${test.name}: ERRO - ${error}`);
        this.currentSuite?.tests.push({
          name: test.name,
          status: 'FAIL',
          error: String(error)
        });
      }
    }

    this.endSuite();
  }

  startSuite(name) {
    this.currentSuite = {
      name,
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, skipped: 0 }
    };
    console.log(`\n🧪 ${name}`);
    console.log('-'.repeat(50));
  }

  endSuite() {
    if (this.currentSuite) {
      this.currentSuite.summary.total = this.currentSuite.tests.length;
      this.currentSuite.summary.passed = this.currentSuite.tests.filter(t => t.status === 'PASS').length;
      this.currentSuite.summary.failed = this.currentSuite.tests.filter(t => t.status === 'FAIL').length;
      this.currentSuite.summary.skipped = this.currentSuite.tests.filter(t => t.status === 'SKIP').length;
      
      this.results.push(this.currentSuite);
      
      console.log(`\n📊 Resumo: ${this.currentSuite.summary.passed}/${this.currentSuite.summary.total} passaram`);
      if (this.currentSuite.summary.failed > 0) {
        console.log(`❌ ${this.currentSuite.summary.failed} falharam`);
      }
      if (this.currentSuite.summary.skipped > 0) {
        console.log(`⏭️  ${this.currentSuite.summary.skipped} pulados`);
      }
    }
  }

  async testEndpoint(name, path, method = 'GET') {
    const startTime = Date.now();
    
    try {
      const result = await this.makeRequest(path, method);
      const responseTime = Date.now() - startTime;
      
      const testResult = {
        name,
        status: result.statusCode >= 200 && result.statusCode < 400 ? 'PASS' : 'FAIL',
        responseTime,
        statusCode: result.statusCode,
        details: result.headers
      };

      if (testResult.status === 'PASS') {
        console.log(`✅ ${name}: ${result.statusCode} (${responseTime}ms)`);
      } else {
        console.log(`❌ ${name}: ${result.statusCode} (${responseTime}ms)`);
        testResult.error = `HTTP ${result.statusCode}`;
      }

      this.currentSuite?.tests.push(testResult);
      this.totalRequests++;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.currentSuite?.tests.push({
        name,
        status: 'FAIL',
        responseTime,
        error: String(error)
      });
      this.totalRequests++;
    }
  }

  async testAPIEndpoint(name, path, method) {
    const startTime = Date.now();
    
    try {
      const result = await this.makeRequest(path, method);
      const responseTime = Date.now() - startTime;
      
      // Para APIs, esperamos 200, 201, 400, 401, 403, 405, 422 como válidos
      const validStatusCodes = [200, 201, 400, 401, 403, 405, 422];
      const isValid = validStatusCodes.includes(result.statusCode);
      
      const testResult = {
        name,
        status: isValid ? 'PASS' : 'FAIL',
        responseTime,
        statusCode: result.statusCode,
        details: result.headers
      };

      if (testResult.status === 'PASS') {
        console.log(`✅ ${name}: ${result.statusCode} (${responseTime}ms)`);
      } else {
        console.log(`❌ ${name}: ${result.statusCode} (${responseTime}ms)`);
        testResult.error = `HTTP ${result.statusCode}`;
      }

      this.currentSuite?.tests.push(testResult);
      this.totalRequests++;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.currentSuite?.tests.push({
        name,
        status: 'FAIL',
        responseTime,
        error: String(error)
      });
      this.totalRequests++;
    }
  }

  async testPDFEndpoint(name, path, method) {
    const startTime = Date.now();
    
    try {
      const result = await this.makeRequest(path, method);
      const responseTime = Date.now() - startTime;
      
      // Para PDFs, esperamos 200 e content-type application/pdf
      const isPDF = result.headers['content-type']?.includes('application/pdf');
      const isValid = result.statusCode === 200 && isPDF;
      
      const testResult = {
        name,
        status: isValid ? 'PASS' : 'FAIL',
        responseTime,
        statusCode: result.statusCode,
        details: {
          contentType: result.headers['content-type'],
          contentLength: result.headers['content-length']
        }
      };

      if (testResult.status === 'PASS') {
        console.log(`✅ ${name}: PDF gerado (${responseTime}ms, ${result.headers['content-length'] || 'N/A'} bytes)`);
      } else {
        console.log(`❌ ${name}: ${result.statusCode} - ${result.headers['content-type']} (${responseTime}ms)`);
        testResult.error = `Expected PDF, got ${result.headers['content-type']}`;
      }

      this.currentSuite?.tests.push(testResult);
      this.totalRequests++;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.currentSuite?.tests.push({
        name,
        status: 'FAIL',
        responseTime,
        error: String(error)
      });
      this.totalRequests++;
    }
  }

  async testPerformanceEndpoint(name, path) {
    const startTime = Date.now();
    
    try {
      const result = await this.makeRequest(path);
      const responseTime = Date.now() - startTime;
      
      // Performance: < 2s é excelente, < 5s é bom, > 5s é ruim
      let status = 'PASS';
      let performance = 'excellent';
      
      if (responseTime > 5000) {
        status = 'FAIL';
        performance = 'poor';
      } else if (responseTime > 2000) {
        performance = 'good';
      }
      
      const testResult = {
        name,
        status,
        responseTime,
        statusCode: result.statusCode,
        details: { performance }
      };

      if (testResult.status === 'PASS') {
        console.log(`✅ ${name}: ${result.statusCode} (${responseTime}ms - ${performance})`);
      } else {
        console.log(`❌ ${name}: ${result.statusCode} (${responseTime}ms - SLOW)`);
        testResult.error = `Slow response: ${responseTime}ms`;
      }

      this.currentSuite?.tests.push(testResult);
      this.totalRequests++;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.currentSuite?.tests.push({
        name,
        status: 'FAIL',
        responseTime,
        error: String(error)
      });
      this.totalRequests++;
    }
  }

  async testSecurityEndpoint(name, path, method) {
    const startTime = Date.now();
    
    try {
      const result = await this.makeRequest(path, method);
      const responseTime = Date.now() - startTime;
      
      // Para endpoints de admin, esperamos 401 (não autorizado)
      const isSecure = result.statusCode === 401 || result.statusCode === 403;
      
      const testResult = {
        name,
        status: isSecure ? 'PASS' : 'FAIL',
        responseTime,
        statusCode: result.statusCode,
        details: result.headers
      };

      if (testResult.status === 'PASS') {
        console.log(`✅ ${name}: ${result.statusCode} (${responseTime}ms) - Seguro`);
      } else {
        console.log(`❌ ${name}: ${result.statusCode} (${responseTime}ms) - INSEGURO`);
        testResult.error = `Expected 401/403, got ${result.statusCode}`;
      }

      this.currentSuite?.tests.push(testResult);
      this.totalRequests++;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.currentSuite?.tests.push({
        name,
        status: 'FAIL',
        responseTime,
        error: String(error)
      });
      this.totalRequests++;
    }
  }

  makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${path}`;
      const options = {
        method,
        headers: {
          'User-Agent': 'AlloeHealth-Production-Test/1.0',
          'Accept': 'application/json, text/html, */*',
          'Cache-Control': 'no-cache',
        }
      };

      const req = https.request(url, options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 0,
            headers: res.headers,
            body,
            responseTime: Date.now()
          });
        });
      });

      req.on('error', reject);
      req.setTimeout(15000, () => reject(new Error('Request timeout')));
      req.end();
    });
  }

  generateProductionReport() {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 RELATÓRIO COMPLETO - TESTE PÓS-DEPLOY EM PRODUÇÃO');
    console.log('='.repeat(70));

    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    for (const suite of this.results) {
      console.log(`\n🧪 ${suite.name}`);
      console.log(`   Total: ${suite.summary.total}`);
      console.log(`   ✅ Passou: ${suite.summary.passed}`);
      console.log(`   ❌ Falhou: ${suite.summary.failed}`);
      console.log(`   ⏭️  Pulado: ${suite.summary.skipped}`);

      totalTests += suite.summary.total;
      totalPassed += suite.summary.passed;
      totalFailed += suite.summary.failed;
      totalSkipped += suite.summary.skipped;

      // Mostrar falhas detalhadas
      const failures = suite.tests.filter(t => t.status === 'FAIL');
      if (failures.length > 0) {
        console.log('   🔍 Falhas:');
        failures.forEach(failure => {
          console.log(`      - ${failure.name}: ${failure.error || 'Unknown error'}`);
        });
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('📈 RESUMO GERAL - PRODUÇÃO');
    console.log('='.repeat(70));
    console.log(`🎯 Target: ${BASE_URL}`);
    console.log(`⏰ Duração Total: ${Math.round(totalDuration/1000)}s`);
    console.log(`📊 Total de Requisições: ${this.totalRequests}`);
    console.log(`🧪 Total de Testes: ${totalTests}`);
    console.log(`✅ Passaram: ${totalPassed} (${Math.round(totalPassed/totalTests*100)}%)`);
    console.log(`❌ Falharam: ${totalFailed} (${Math.round(totalFailed/totalTests*100)}%)`);
    console.log(`⏭️  Pulados: ${totalSkipped} (${Math.round(totalSkipped/totalTests*100)}%)`);

    const successRate = Math.round(totalPassed/totalTests*100);
    if (successRate >= 95) {
      console.log('\n🎉 PRODUÇÃO EM ESTADO EXCELENTE!');
    } else if (successRate >= 90) {
      console.log('\n✅ PRODUÇÃO EM BOM ESTADO');
    } else if (successRate >= 80) {
      console.log('\n⚠️  PRODUÇÃO PRECISA DE ATENÇÃO');
    } else {
      console.log('\n🚨 PRODUÇÃO COM PROBLEMAS CRÍTICOS');
    }

    // Salvar relatório em arquivo
    const reportData = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      duration: totalDuration,
      totalRequests: this.totalRequests,
      summary: {
        totalTests,
        totalPassed,
        totalFailed,
        totalSkipped,
        successRate
      },
      suites: this.results
    };

    const reportPath = path.join(process.cwd(), 'production-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);
    
    console.log('\n🔍 LOGS GERADOS NA VERCEL:');
    console.log('   - Acesse: https://vercel.com/alloe-healths-projects/aistotele');
    console.log('   - Vá para "Logs" do deployment atual');
    console.log('   - Filtre por "Last 30 minutes"');
    console.log('   - Você verá todas as requisições deste teste!');
  }
}

// Executar teste de produção
async function main() {
  const tester = new ProductionTester();
  await tester.runCompleteProductionTest();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ProductionTester };
