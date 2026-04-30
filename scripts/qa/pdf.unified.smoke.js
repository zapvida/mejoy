#!/usr/bin/env node
// scripts/qa/pdf.unified.smoke.js
// Smoke test para PDF unificado

const https = require('https');
const http = require('http');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class PDFSmokeTester {
  constructor() {
    this.results = [];
    console.log('🔍 PDF Unified Smoke Test');
    console.log('='.repeat(50));
  }

  async runSmokeTest() {
    console.log('\n📋 INICIANDO SMOKE TEST PDF UNIFICADO...\n');

    // 1. Teste PDF Demo
    await this.testPDFDemo();
    
    // 2. Teste PDF com ID (simulado)
    await this.testPDFWithId();
    
    // 3. Teste Adapters
    await this.testAdapters();

    // Gerar relatório
    this.generateReport();
  }

  async testPDFDemo() {
    console.log('🧪 Testando PDF Demo...');
    
    const tests = [
      { name: 'PDF Demo', url: '/api/pdf/report?demo=1' },
      { name: 'PDF Demo Gastro', url: '/api/pdf/report?demo=1&triage=gastro' },
      { name: 'PDF Demo Geral', url: '/api/pdf/report?demo=1&triage=geral' },
    ];

    for (const test of tests) {
      await this.testPDFGeneration(test.name, test.url);
    }
  }

  async testPDFWithId() {
    console.log('\n🧪 Testando PDF com ID...');
    
    const tests = [
      { name: 'PDF com ID válido', url: '/api/pdf/report?id=demo-123' },
      { name: 'PDF com ID inválido', url: '/api/pdf/report?id=invalid-id' },
    ];

    for (const test of tests) {
      await this.testPDFGeneration(test.name, test.url);
    }
  }

  async testAdapters() {
    console.log('\n🧪 Testando Adapters...');
    
    const tests = [
      { name: 'Adapter [id]', url: '/api/pdf/demo-123' },
      { name: 'Adapter optimized', url: '/api/pdf/optimized?demo=1' },
      { name: 'Adapter demo', url: '/api/pdf/demo' },
      { name: 'Adapter demo-gastro', url: '/api/pdf/demo-gastro' },
      { name: 'Adapter demo-geral', url: '/api/pdf/demo-geral' },
    ];

    for (const test of tests) {
      await this.testPDFGeneration(test.name, test.url);
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
      const sizeKB = Math.round((parseInt(result.headers['content-length'] || '0')) / 1024);
      
      const testResult = {
        name,
        status: isValid ? 'PASS' : 'FAIL',
        responseTime,
        statusCode: result.statusCode,
        contentType: result.headers['content-type'],
        sizeKB,
        details: {
          isPDF,
          hasContent: sizeKB > 0,
          meetsSizeRequirement: sizeKB > 80
        }
      };

      if (testResult.status === 'PASS') {
        console.log(`✅ ${name}: PDF gerado (${responseTime}ms, ${sizeKB}KB)`);
      } else {
        console.log(`❌ ${name}: ${result.statusCode} - ${result.headers['content-type']} (${responseTime}ms)`);
        testResult.error = `Expected PDF, got ${result.headers['content-type']}`;
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

  makeRequest(path) {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${path}`;
      const isHttps = url.startsWith('https://');
      const client = isHttps ? https : http;
      
      const options = {
        method: 'GET',
        headers: {
          'User-Agent': 'PDF-SmokeTest/1.0',
          'Accept': 'application/pdf, */*',
        }
      };

      const req = client.request(url, options, (res) => {
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
    console.log('\n' + '='.repeat(50));
    console.log('📊 RELATÓRIO SMOKE TEST PDF');
    console.log('='.repeat(50));

    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;

    for (const result of this.results) {
      totalTests++;
      if (result.status === 'PASS') totalPassed++;
      else totalFailed++;
    }

    console.log(`Total de Testes: ${totalTests}`);
    console.log(`✅ Passaram: ${totalPassed} (${Math.round(totalPassed/totalTests*100)}%)`);
    console.log(`❌ Falharam: ${totalFailed} (${Math.round(totalFailed/totalTests*100)}%)`);

    const successRate = Math.round(totalPassed/totalTests*100);
    if (successRate >= 90) {
      console.log('\n🎉 PDF UNIFICADO EM EXCELENTE ESTADO!');
    } else if (successRate >= 80) {
      console.log('\n✅ PDF UNIFICADO EM BOM ESTADO');
    } else if (successRate >= 70) {
      console.log('\n⚠️  PDF UNIFICADO PRECISA DE ATENÇÃO');
    } else {
      console.log('\n🚨 PDF UNIFICADO COM PROBLEMAS CRÍTICOS');
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
        successRate
      },
      results: this.results
    };

    const reportPath = 'pdf-smoke-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);
  }
}

// Executar smoke test
async function main() {
  const tester = new PDFSmokeTester();
  await tester.runSmokeTest();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { PDFSmokeTester };