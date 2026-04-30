#!/usr/bin/env node

/**
 * Script de QA automatizado para PDF v1/v2
 * Testa geração de PDFs com diferentes flags e valida tamanhos
 */

import fs from 'fs';
import https from 'https';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TMP_DIR = './tmp';

// Criar diretório tmp se não existir
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

// Mock de dados para teste
// Mock de dados comentado - não utilizado no teste atual
// const _mockReportData = { ... };

function generateTestReport(): string {
  console.log('📝 Usando relatório de teste mock...');
  return 'test-report-id-' + Date.now();
}

async function testPDFGeneration(reportId: string, pdfVersion: 'v1' | 'v2'): Promise<{ size: number; status: number }> {
  console.log(`🔍 Testando PDF ${pdfVersion}...`);
  
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}/api/pdf/${reportId}`);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'QA-Test-Script'
      }
    };

    const req = https.request(options, (res) => {
      let data = Buffer.alloc(0);
      
      res.on('data', (chunk) => {
        data = Buffer.concat([data, chunk]);
      });
      
      res.on('end', () => {
        const filename = `${TMP_DIR}/pdf_${pdfVersion}.pdf`;
        fs.writeFileSync(filename, data);
        
        console.log(`✅ PDF ${pdfVersion} gerado: ${data.length} bytes`);
        
        resolve({
          size: data.length,
          status: res.statusCode || 200
        });
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Erro ao gerar PDF ${pdfVersion}: ${error.message}`));
    });

    req.end();
  });
}

async function runQATests(): Promise<void> {
  console.log('🚀 Iniciando QA automatizado de PDFs...\n');

  try {
    // Gerar relatório de teste
    const reportId = await generateTestReport();
    console.log(`📋 Relatório ID: ${reportId}\n`);

    // Teste 1: PDF v2 (flag ON)
    process.env.PDF_V2 = '1';
    const v2Result = await testPDFGeneration(reportId, 'v2');
    
    // Teste 2: PDF v1 (flag OFF)
    process.env.PDF_V2 = '0';
    const v1Result = await testPDFGeneration(reportId, 'v1');

    // Resultados
    console.log('\n📊 RESULTADOS DOS TESTES:');
    console.log('========================');
    console.log(`PDF v2: ${v2Result.status} OK - ${v2Result.size} bytes`);
    console.log(`PDF v1: ${v1Result.status} OK - ${v1Result.size} bytes`);
    
    // Validações
    const validations = [
      { test: 'PDF v2 status 200', passed: v2Result.status === 200 },
      { test: 'PDF v1 status 200', passed: v1Result.status === 200 },
      { test: 'PDF v2 tamanho válido', passed: v2Result.size > 10000 && v2Result.size < 1000000 },
      { test: 'PDF v1 tamanho válido', passed: v1Result.size > 10000 && v1Result.size < 1000000 },
      { test: 'PDFs diferentes', passed: v2Result.size !== v1Result.size }
    ];

    console.log('\n✅ VALIDAÇÕES:');
    validations.forEach(({ test, passed }) => {
      console.log(`${passed ? '✅' : '❌'} ${test}`);
    });

    const allPassed = validations.every(v => v.passed);
    console.log(`\n${allPassed ? '🎉 TODOS OS TESTES PASSARAM!' : '⚠️  ALGUNS TESTES FALHARAM'}`);

  } catch (error) {
    console.error('❌ Erro durante os testes:', (error as Error).message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runQATests().catch(console.error);
}

export { runQATests };
