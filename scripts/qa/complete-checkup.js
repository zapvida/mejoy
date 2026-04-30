#!/usr/bin/env node
// scripts/qa/complete-checkup.js
// Check-up completo do sistema AlloeHealth

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.alloehealth.com.br';

class AlloeHealthChecker {
  constructor() {
    this.results = [];
    this.currentSuite = null;
    console.log('🔍 AlloeHealth - Check-up Completo do Sistema');
    console.log('='.repeat(60));
  }

  async runCompleteCheckup() {
    console.log('\n📋 INICIANDO CHECK-UP COMPLETO...\n');

    // 1. Testes de Infraestrutura
    await this.testInfrastructure();
    
    // 2. Testes de Páginas Principais
    await this.testMainPages();
    
    // 3. Testes de Triagens
    await this.testTriages();
    
    // 4. Testes de APIs
    await this.testAPIs();
    
    // 5. Testes de Relatórios
    await this.testReports();
    
    // 6. Testes de PDFs
    await this.testPDFs();
    
    // 7. Testes de Funcionalidades Premium
    await this.testPremiumFeatures();
    
    // 8. Testes de Performance
    await this.testPerformance();
    
    // 9. Testes de Segurança
    await this.testSecurity();

    // Gerar relatório final
    this.generateReport();
  }

  async testInfrastructure() {
    this.startSuite('Infraestrutura');
    
    const tests = [
      { name: 'Site Principal', url: '/' },
      { name: 'Health Check', url: '/api/health' },
      { name: 'Health Check Legacy', url: '/api/healthcheck' },
      { name: 'Sitemap', url: '/sitemap.xml' },
      { name: '404 Page', url: '/404' },
    ];

    for (const test of tests) {
      await this.testEndpoint(test.name, test.url);
    }

    this.endSuite();
  }

  async testMainPages() {
    this.startSuite('Páginas Principais');
    
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
    ];

    for (const page of pages) {
      await this.testEndpoint(page.name, page.url);
    }

    this.endSuite();
  }

  async testTriages() {
    this.startSuite('Triagens Disponíveis');
    
    const triages = [
      'gastro',
      'testeSaude', 
      'geral',
      'geralRapida',
      'mental',
      'sono',
      'cardiovascular',
      'diabetes-metabolismo',
      'dor-cronica',
      'coluna',
      'respiratoria',
      'renal',
      'hepatica',
      'mulher',
      'prostata',
      'tireoide',
      'mama',
      'ocular',
      'auditiva',
      'pele',
      'alergias',
      'sexual',
      'idoso',
      'bucal',
      'crianca',
      'trabalhador',
      'longevidade',
      'vitalidade',
      'microbioma',
      'micronutrientes',
      'biohacking'
    ];

    for (const triage of triages) {
      await this.testEndpoint(`Triagem ${triage}`, `/triagem/${triage}`);
    }

    this.endSuite();
  }

  async testAPIs() {
    this.startSuite('APIs do Sistema');
    
    const apis = [
      { name: 'Health Check', url: '/api/health', method: 'GET' },
      { name: 'Triage Session', url: '/api/triage/session', method: 'POST' },
      { name: 'Triage Answer', url: '/api/triage/answer', method: 'POST' },
      { name: 'Generate Report', url: '/api/gerarRelatorio', method: 'POST' },
      { name: 'PDF Generation', url: '/api/pdf/demo', method: 'GET' },
      { name: 'TTS Service', url: '/api/tts', method: 'POST' },
      { name: 'WhatsApp Report', url: '/api/report/whatsapp', method: 'POST' },
      { name: 'Share Report', url: '/api/report/share', method: 'POST' },
      { name: 'Meta Lead', url: '/api/meta-lead', method: 'POST' },
      { name: 'Test Environment', url: '/api/teste-env', method: 'GET' },
    ];

    for (const api of apis) {
      await this.testAPIEndpoint(api.name, api.url, api.method);
    }

    this.endSuite();
  }

  async testReports() {
    this.startSuite('Sistema de Relatórios');
    
    const reportTests = [
      { name: 'Relatório Demo', url: '/relatorio/demo' },
      { name: 'Relatório Gastro Demo', url: '/relatorio/demo?triage=gastro' },
      { name: 'Relatório Geral Demo', url: '/relatorio/demo?triage=geral' },
    ];

    for (const test of reportTests) {
      await this.testEndpoint(test.name, test.url);
    }

    this.endSuite();
  }

  async testPDFs() {
    this.startSuite('Geração de PDFs');
    
    const pdfTests = [
      { name: 'PDF Demo', url: '/api/pdf/demo' },
      { name: 'PDF Demo Gastro', url: '/api/pdf/demo?triage=gastro' },
      { name: 'PDF Demo Geral', url: '/api/pdf/demo?triage=geral' },
    ];

    for (const test of pdfTests) {
      await this.testPDFGeneration(test.name, test.url);
    }

    this.endSuite();
  }

  async testPremiumFeatures() {
    this.startSuite('Funcionalidades Premium');
    
    const premiumTests = [
      { name: 'Stripe Checkout', url: '/api/stripe/checkout', method: 'POST' },
      { name: 'Create Checkout Session', url: '/api/stripe/create-checkout-session', method: 'POST' },
      { name: 'Create Portal Session', url: '/api/stripe/create-portal-session', method: 'POST' },
      { name: 'Gift Create', url: '/api/gift/create', method: 'POST' },
      { name: 'User Access Status', url: '/api/user/access-status', method: 'GET' },
    ];

    for (const test of premiumTests) {
      await this.testAPIEndpoint(test.name, test.url, test.method);
    }

    this.endSuite();
  }

  async testPerformance() {
    this.startSuite('Performance e Otimização');
    
    const perfTests = [
      { name: 'Landing Page Performance', url: '/' },
      { name: 'Triagem Performance', url: '/triagem/gastro' },
      { name: 'Relatório Performance', url: '/relatorio/demo' },
    ];

    for (const test of perfTests) {
      await this.testPerformanceEndpoint(test.name, test.url);
    }

    this.endSuite();
  }

  async testSecurity() {
    this.startSuite('Segurança');
    
    const securityTests = [
      { name: 'Admin Alerts (Should 401)', url: '/api/admin/alerts', method: 'GET' },
      { name: 'Admin KPIs (Should 401)', url: '/api/admin/kpis', method: 'GET' },
      { name: 'Admin Export (Should 401)', url: '/api/admin/export', method: 'GET' },
      { name: 'Admin Stats (Should 401)', url: '/api/admin/stats', method: 'GET' },
      { name: 'Admin Tech (Should 401)', url: '/api/admin/tech', method: 'GET' },
    ];

    for (const test of securityTests) {
      await this.testSecurityEndpoint(test.name, test.url, test.method);
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
    console.log('-'.repeat(40));
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

  async testEndpoint(name, path) {
    const startTime = Date.now();
    
    try {
      const result = await this.makeRequest(path);
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
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.currentSuite?.tests.push({
        name,
        status: 'FAIL',
        responseTime,
        error: String(error)
      });
    }
  }

  async testAPIEndpoint(name, path, method) {
    const startTime = Date.now();
    
    try {
      const result = await this.makeRequest(path, method);
      const responseTime = Date.now() - startTime;
      
      // Para APIs, esperamos 200, 201, 400, 401, 403, 405 como válidos
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
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.currentSuite?.tests.push({
        name,
        status: 'FAIL',
        responseTime,
        error: String(error)
      });
    }
  }

  async testPDFGeneration(name, path) {
    const startTime = Date.now();
    
    try {
      const result = await this.makeRequest(path);
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
        console.log(`✅ ${name}: PDF gerado (${responseTime}ms, ${result.headers['content-length']} bytes)`);
      } else {
        console.log(`❌ ${name}: ${result.statusCode} - ${result.headers['content-type']} (${responseTime}ms)`);
        testResult.error = `Expected PDF, got ${result.headers['content-type']}`;
      }

      this.currentSuite?.tests.push(testResult);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.currentSuite?.tests.push({
        name,
        status: 'FAIL',
        responseTime,
        error: String(error)
      });
    }
  }

  async testPerformanceEndpoint(name, path) {
    const startTime = Date.now();
    
    try {
      const result = await this.makeRequest(path);
      const responseTime = Date.now() - startTime;
      
      // Performance: < 2s é bom, < 5s é aceitável, > 5s é ruim
      let status = 'PASS';
      if (responseTime > 5000) status = 'FAIL';
      
      const testResult = {
        name,
        status,
        responseTime,
        statusCode: result.statusCode,
        details: {
          performance: responseTime < 2000 ? 'excellent' : responseTime < 5000 ? 'good' : 'poor'
        }
      };

      if (testResult.status === 'PASS') {
        console.log(`✅ ${name}: ${result.statusCode} (${responseTime}ms - ${testResult.details.performance})`);
      } else {
        console.log(`❌ ${name}: ${result.statusCode} (${responseTime}ms - SLOW)`);
        testResult.error = `Slow response: ${responseTime}ms`;
      }

      this.currentSuite?.tests.push(testResult);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.currentSuite?.tests.push({
        name,
        status: 'FAIL',
        responseTime,
        error: String(error)
      });
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
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.currentSuite?.tests.push({
        name,
        status: 'FAIL',
        responseTime,
        error: String(error)
      });
    }
  }

  makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${path}`;
      const options = {
        method,
        headers: {
          'User-Agent': 'AlloeHealth-Checkup/1.0',
          'Accept': 'application/json, text/html, */*',
        }
      };

      const req = https.request(url, options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 0,
            headers: res.headers,
            body
          });
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Request timeout')));
      req.end();
    });
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RELATÓRIO COMPLETO DO CHECK-UP');
    console.log('='.repeat(60));

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

    console.log('\n' + '='.repeat(60));
    console.log('📈 RESUMO GERAL');
    console.log('='.repeat(60));
    console.log(`Total de Testes: ${totalTests}`);
    console.log(`✅ Passaram: ${totalPassed} (${Math.round(totalPassed/totalTests*100)}%)`);
    console.log(`❌ Falharam: ${totalFailed} (${Math.round(totalFailed/totalTests*100)}%)`);
    console.log(`⏭️  Pulados: ${totalSkipped} (${Math.round(totalSkipped/totalTests*100)}%)`);

    const successRate = Math.round(totalPassed/totalTests*100);
    if (successRate >= 90) {
      console.log('\n🎉 SISTEMA EM EXCELENTE ESTADO!');
    } else if (successRate >= 80) {
      console.log('\n✅ SISTEMA EM BOM ESTADO');
    } else if (successRate >= 70) {
      console.log('\n⚠️  SISTEMA PRECISA DE ATENÇÃO');
    } else {
      console.log('\n🚨 SISTEMA COM PROBLEMAS CRÍTICOS');
    }

    // Salvar relatório em arquivo
    const reportData = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      summary: {
        totalTests,
        totalPassed,
        totalFailed,
        totalSkipped,
        successRate
      },
      suites: this.results
    };

    const reportPath = path.join(process.cwd(), 'checkup-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);
  }
}

// Executar check-up
async function main() {
  const checker = new AlloeHealthChecker();
  await checker.runCompleteCheckup();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { AlloeHealthChecker };
