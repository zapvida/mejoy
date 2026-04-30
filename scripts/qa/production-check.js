#!/usr/bin/env node
// scripts/qa/production-check.js
// Check completo de produção

const https = require('https');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'https://www.alloehealth.com.br';

class ProductionChecker {
  constructor() {
    this.results = [];
    this.requestCount = 0;
    console.log('🔍 Production Check - AlloeHealth');
    console.log('='.repeat(60));
  }

  async runProductionCheck() {
    console.log('\n📋 INICIANDO CHECK DE PRODUÇÃO...\n');

    // 1. Páginas principais
    await this.testMainPages();
    
    // 2. Fluxo GI completo
    await this.testGIFlow();
    
    // 3. APIs críticas
    await this.testCriticalAPIs();
    
    // 4. CTAs de parceiros
    await this.testPartnerCTAs();

    // Gerar relatório
    this.generateReport();
  }

  async testMainPages() {
    console.log('🧪 Testando Páginas Principais...');
    
    const pages = [
      { name: 'Landing Page', url: '/' },
      { name: 'Triagem Geral', url: '/triagem' },
      { name: 'Triagem Gastro', url: '/triagem/gastro' },
      { name: 'FAQ', url: '/faq' },
      { name: 'Termos', url: '/termos' },
      { name: 'Privacidade', url: '/privacidade' },
    ];

    for (const page of pages) {
      await this.testEndpoint(page.name, page.url);
    }
  }

  async testGIFlow() {
    console.log('\n🧪 Testando Fluxo GI...');
    
    const flowTests = [
      { name: 'Início Triagem GI', url: '/triagem/gastro' },
      { name: 'Relatório Demo', url: '/relatorio/demo' },
      { name: 'PDF Demo', url: '/api/pdf/report?demo=1' },
    ];

    for (const test of flowTests) {
      await this.testEndpoint(test.name, test.url);
    }
  }

  async testCriticalAPIs() {
    console.log('\n🧪 Testando APIs Críticas...');
    
    const apis = [
      { name: 'Health Check', url: '/api/health', method: 'GET' },
      { name: 'Triage Session', url: '/api/triage/session', method: 'POST' },
      { name: 'PDF Generation', url: '/api/pdf/report?demo=1', method: 'GET' },
    ];

    for (const api of apis) {
      await this.testAPIEndpoint(api.name, api.url, api.method);
    }
  }

  async testPartnerCTAs() {
    console.log('\n🧪 Testando CTAs de Parceiros...');
    
    const ctaTests = [
      { name: 'Alloezil URL', url: 'https://alloezil.com.br/', method: 'HEAD' },
      { name: 'ZapVida URL', url: 'https://zapvida.com/', method: 'HEAD' },
    ];

    for (const test of ctaTests) {
      await this.testExternalEndpoint(test.name, test.url, test.method);
    }
  }

  async testEndpoint(name, path) {
    const startTime = Date.now();
    
    try {
      const result = await this.makeRequest(path);
      const responseTime = Date.now() - startTime;
      this.requestCount++;
      
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

      this.results.push(testResult);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.results.push({
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
      this.requestCount++;
      
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

      this.results.push(testResult);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.results.push({
        name,
        status: 'FAIL',
        responseTime,
        error: String(error)
      });
    }
  }

  async testExternalEndpoint(name, url, method) {
    const startTime = Date.now();
    
    try {
      const result = await this.makeExternalRequest(url, method);
      const responseTime = Date.now() - startTime;
      this.requestCount++;
      
      const isValid = result.statusCode >= 200 && result.statusCode < 400;
      
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

      this.results.push(testResult);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ERRO (${responseTime}ms) - ${error}`);
      
      this.results.push({
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
          'User-Agent': 'Production-Check/1.0',
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
      req.setTimeout(15000, () => reject(new Error('Request timeout')));
      req.end();
    });
  }

  makeExternalRequest(url, method = 'HEAD') {
    return new Promise((resolve, reject) => {
      const options = {
        method,
        headers: {
          'User-Agent': 'Production-Check/1.0',
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
    console.log('📊 RELATÓRIO DE PRODUÇÃO');
    console.log('='.repeat(60));

    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;

    for (const result of this.results) {
      totalTests++;
      if (result.status === 'PASS') totalPassed++;
      else totalFailed++;
    }

    console.log(`Total de Testes: ${totalTests}`);
    console.log(`Total de Requisições: ${this.requestCount}`);
    console.log(`✅ Passaram: ${totalPassed} (${Math.round(totalPassed/totalTests*100)}%)`);
    console.log(`❌ Falharam: ${totalFailed} (${Math.round(totalFailed/totalTests*100)}%)`);

    const successRate = Math.round(totalPassed/totalTests*100);
    if (successRate >= 90) {
      console.log('\n🎉 PRODUÇÃO EM EXCELENTE ESTADO!');
    } else if (successRate >= 80) {
      console.log('\n✅ PRODUÇÃO EM BOM ESTADO');
    } else if (successRate >= 70) {
      console.log('\n⚠️  PRODUÇÃO PRECISA DE ATENÇÃO');
    } else {
      console.log('\n🚨 PRODUÇÃO COM PROBLEMAS CRÍTICOS');
    }

    // Mostrar falhas detalhadas
    const failures = this.results.filter(r => r.status === 'FAIL');
    if (failures.length > 0) {
      console.log('\n🔍 Falhas:');
      failures.forEach(failure => {
        console.log(`   - ${failure.name}: ${failure.error || 'Unknown error'}`);
      });
    }

    // Salvar relatório
    const reportData = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      summary: {
        totalTests,
        totalPassed,
        totalFailed,
        successRate,
        requestCount: this.requestCount
      },
      results: this.results
    };

    const reportPath = 'production-check-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);
  }
}

// Executar check de produção
async function main() {
  const checker = new ProductionChecker();
  await checker.runProductionCheck();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ProductionChecker };
