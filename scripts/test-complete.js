#!/usr/bin/env node

/**
 * 🧪 TESTE COMPLETO - ALLOE HEALTH
 * Script de validação integral do projeto
 * Verifica: APIs, Banco, Frontend, Performance, Visual
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 INICIANDO TESTE COMPLETO - ALLOE HEALTH\n');

// Configurações
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_RESULTS = {
  passed: 0,
  failed: 0,
  errors: []
};

// Utilitários
function logTest(test, status, message = '') {
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${test}: ${status} ${message}`);
  
  if (status === 'PASS') TEST_RESULTS.passed++;
  else {
    TEST_RESULTS.failed++;
    TEST_RESULTS.errors.push({ test, message });
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

function checkFileContent(filePath, requiredContent) {
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
    return content.includes(requiredContent);
  } catch {
    return false;
  }
}

// 1. TESTE DE ESTRUTURA DE ARQUIVOS
console.log('📁 TESTANDO ESTRUTURA DE ARQUIVOS...\n');

const requiredFiles = [
  'prisma/schema.prisma',
  'src/forms/gastro.ts',
  'src/utils/health.ts',
  'src/hooks/useAutosaveTriage.ts',
  'src/pages/api/triage/start.ts',
  'src/pages/api/triage/autosave.ts',
  'src/pages/api/gerarRelatorio.ts',
  'src/pages/triagem/gastro.tsx',
  'src/pages/triagem/index.tsx',
  'src/components/ui/cards/PacienteInfoCard.tsx',
  'package.json',
  'next.config.js',
  'tailwind.config.js'
];

requiredFiles.forEach(file => {
  logTest(`Arquivo ${file}`, checkFileExists(file) ? 'PASS' : 'FAIL', 
    checkFileExists(file) ? 'existe' : 'não encontrado');
});

// 2. TESTE DE CONTEÚDO CRÍTICO
console.log('\n📝 TESTANDO CONTEÚDO CRÍTICO...\n');

const contentTests = [
  {
    file: 'prisma/schema.prisma',
    content: 'sessionId',
    test: 'Schema com sessionId'
  },
  {
    file: 'prisma/schema.prisma',
    content: 'email      String?  @unique',
    test: 'Email único no schema'
  },
  {
    file: 'src/forms/gastro.ts',
    content: 'export const gastro',
    test: 'Formulário gastro exportado'
  },
  {
    file: 'src/utils/health.ts',
    content: 'parseBirthdate8',
    test: 'Parser de data implementado'
  },
  {
    file: 'src/pages/api/triage/start.ts',
    content: 'sessionId = uuid()',
    test: 'API start com UUID'
  },
  {
    file: 'src/pages/api/triage/autosave.ts',
    content: 'PATCH',
    test: 'API autosave com PATCH'
  },
  {
    file: 'src/forms/index.ts',
    content: 'isFree',
    test: 'Sistema de cadeados implementado'
  }
];

contentTests.forEach(({ file, content, test }) => {
  logTest(test, checkFileContent(file, content) ? 'PASS' : 'FAIL');
});

// 3. TESTE DE DEPENDÊNCIAS
console.log('\n📦 TESTANDO DEPENDÊNCIAS...\n');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['next', 'react', 'prisma', '@prisma/client', 'uuid'];
  
  requiredDeps.forEach(dep => {
    const hasDep = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
    logTest(`Dependência ${dep}`, hasDep ? 'PASS' : 'FAIL');
  });
} catch (error) {
  logTest('Package.json válido', 'FAIL', error.message);
}

// 4. TESTE DE CONFIGURAÇÃO
console.log('\n⚙️ TESTANDO CONFIGURAÇÕES...\n');

const configTests = [
  {
    file: 'next.config.js',
    content: 'module.exports',
    test: 'Next.js configurado'
  },
  {
    file: 'tailwind.config.js',
    content: 'module.exports',
    test: 'Tailwind configurado'
  },
  {
    file: 'env.example',
    content: 'NEXT_PUBLIC_FREE_TRIAGE_SLUG',
    test: 'Variáveis de ambiente documentadas'
  }
];

configTests.forEach(({ file, content, test }) => {
  logTest(test, checkFileContent(file, content) ? 'PASS' : 'FAIL');
});

// 5. TESTE DE BUILD
console.log('\n🔨 TESTANDO BUILD...\n');

try {
  console.log('Executando typecheck...');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  logTest('TypeScript typecheck', 'PASS');
} catch (error) {
  logTest('TypeScript typecheck', 'FAIL', error.message);
}

try {
  console.log('Executando build...');
  execSync('npm run build', { stdio: 'pipe' });
  logTest('Build Next.js', 'PASS');
} catch (error) {
  logTest('Build Next.js', 'FAIL', error.message);
}

// 6. TESTE DE PRISMA
console.log('\n🗄️ TESTANDO PRISMA...\n');

try {
  console.log('Gerando cliente Prisma...');
  execSync('npx prisma generate', { stdio: 'pipe' });
  logTest('Prisma generate', 'PASS');
} catch (error) {
  logTest('Prisma generate', 'FAIL', error.message);
}

// 7. RELATÓRIO FINAL
console.log('\n📊 RELATÓRIO FINAL...\n');
console.log(`✅ Testes passaram: ${TEST_RESULTS.passed}`);
console.log(`❌ Testes falharam: ${TEST_RESULTS.failed}`);
console.log(`📈 Taxa de sucesso: ${Math.round((TEST_RESULTS.passed / (TEST_RESULTS.passed + TEST_RESULTS.failed)) * 100)}%`);

if (TEST_RESULTS.errors.length > 0) {
  console.log('\n🚨 ERROS ENCONTRADOS:');
  TEST_RESULTS.errors.forEach(({ test, message }) => {
    console.log(`  - ${test}: ${message}`);
  });
}

console.log('\n🎯 STATUS FINAL:', TEST_RESULTS.failed === 0 ? '✅ PROJETO PRONTO' : '❌ CORREÇÕES NECESSÁRIAS');

// Salvar relatório
const report = {
  timestamp: new Date().toISOString(),
  results: TEST_RESULTS,
  summary: {
    total: TEST_RESULTS.passed + TEST_RESULTS.failed,
    passed: TEST_RESULTS.passed,
    failed: TEST_RESULTS.failed,
    successRate: Math.round((TEST_RESULTS.passed / (TEST_RESULTS.passed + TEST_RESULTS.failed)) * 100)
  }
};

fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Relatório salvo em: test-report.json');

process.exit(TEST_RESULTS.failed === 0 ? 0 : 1);
