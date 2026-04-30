#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 INICIANDO TESTE COMPREHENSIVO - ALLOE HEALTH\n');

const results = {
  unit: { passed: 0, failed: 0, total: 0 },
  integration: { passed: 0, failed: 0, total: 0 },
  e2e: { passed: 0, failed: 0, total: 0 },
  coverage: { lines: 0, functions: 0, branches: 0, statements: 0 }
};

function runCommand(command, description) {
  try {
    console.log(`🔍 ${description}...`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description}: PASS`);
    return { success: true, output };
  } catch (error) {
    console.log(`❌ ${description}: FAIL`);
    console.log(`   Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function runJestTests() {
  console.log('\n📋 EXECUTANDO TESTES UNITÁRIOS E DE INTEGRAÇÃO...\n');
  
  const jestResult = runCommand('npm run test -- --coverage --watchAll=false', 'Testes Jest');
  
  if (jestResult.success) {
    // Parse coverage from output
    const coverageMatch = jestResult.output.match(/All files\s+\|\s+(\d+\.?\d*)\s+\|\s+(\d+\.?\d*)\s+\|\s+(\d+\.?\d*)\s+\|\s+(\d+\.?\d*)/);
    if (coverageMatch) {
      results.coverage.statements = parseFloat(coverageMatch[1]);
      results.coverage.branches = parseFloat(coverageMatch[2]);
      results.coverage.functions = parseFloat(coverageMatch[3]);
      results.coverage.lines = parseFloat(coverageMatch[4]);
    }
    
    // Parse test results
    const testMatch = jestResult.output.match(/Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed/);
    if (testMatch) {
      results.unit.failed = parseInt(testMatch[1]);
      results.unit.passed = parseInt(testMatch[2]);
      results.unit.total = results.unit.passed + results.unit.failed;
    }
  }
  
  return jestResult.success;
}

function runPlaywrightTests() {
  console.log('\n🎭 EXECUTANDO TESTES E2E COM PLAYWRIGHT...\n');
  
  const playwrightResult = runCommand('npx playwright test --reporter=line', 'Testes Playwright');
  
  if (playwrightResult.success) {
    // Parse Playwright results
    const testMatch = playwrightResult.output.match(/(\d+) passed/);
    if (testMatch) {
      results.e2e.passed = parseInt(testMatch[1]);
      results.e2e.total = results.e2e.passed;
    }
  }
  
  return playwrightResult.success;
}

function validateProjectStructure() {
  console.log('\n📁 VALIDANDO ESTRUTURA DO PROJETO...\n');
  
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'tailwind.config.js',
    'prisma/schema.prisma',
    'src/pages/index.tsx',
    'src/components/layout/Navbar.tsx',
    'src/components/layout/Footer.tsx',
    'src/forms/gastro.ts',
    'src/utils/health.ts',
    'src/hooks/useAutosaveTriage.ts',
    'src/pages/api/triage/start.ts',
    'src/pages/api/triage/autosave.ts',
    'src/pages/api/gerarRelatorio.ts',
    'jest.config.js',
    'jest.setup.js',
    'playwright.config.ts'
  ];
  
  const requiredDirs = [
    'src/components/__tests__',
    'src/pages/__tests__',
    'src/pages/api/__tests__',
    'src/utils/__tests__',
    'src/forms/__tests__',
    'tests/e2e'
  ];
  
  let structureValid = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}: EXISTS`);
    } else {
      console.log(`❌ ${file}: MISSING`);
      structureValid = false;
    }
  });
  
  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`✅ ${dir}/: EXISTS`);
    } else {
      console.log(`❌ ${dir}/: MISSING`);
      structureValid = false;
    }
  });
  
  return structureValid;
}

function validateCodeQuality() {
  console.log('\n🔍 VALIDANDO QUALIDADE DO CÓDIGO...\n');
  
  const typeCheck = runCommand('npx tsc --noEmit', 'TypeScript Type Check');
  const buildCheck = runCommand('npm run build', 'Next.js Build');
  const lintCheck = runCommand('npm run lint', 'ESLint Check');
  
  return typeCheck.success && buildCheck.success && lintCheck.success;
}

function validateDatabase() {
  console.log('\n🗄️ VALIDANDO BANCO DE DADOS...\n');
  
  const prismaGenerate = runCommand('npx prisma generate', 'Prisma Generate');
  const prismaValidate = runCommand('npx prisma validate', 'Prisma Validate');
  
  return prismaGenerate.success && prismaValidate.success;
}

function validateAPIs() {
  console.log('\n🌐 VALIDANDO APIs...\n');
  
  const apiFiles = [
    'src/pages/api/triage/start.ts',
    'src/pages/api/triage/autosave.ts',
    'src/pages/api/gerarRelatorio.ts',
    'src/pages/api/pdf/[id].tsx'
  ];
  
  let apisValid = true;
  
  apiFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}: EXISTS`);
      
      // Check if file has proper structure
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('export default') && content.includes('handler')) {
        console.log(`   ✅ Proper API structure`);
      } else {
        console.log(`   ❌ Invalid API structure`);
        apisValid = false;
      }
    } else {
      console.log(`❌ ${file}: MISSING`);
      apisValid = false;
    }
  });
  
  return apisValid;
}

function validateForms() {
  console.log('\n📝 VALIDANDO FORMULÁRIOS...\n');
  
  const formFiles = [
    'src/forms/gastro.ts',
    'src/forms/index.ts'
  ];
  
  let formsValid = true;
  
  formFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}: EXISTS`);
      
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('export const') && content.includes('steps')) {
        console.log(`   ✅ Proper form structure`);
      } else {
        console.log(`   ❌ Invalid form structure`);
        formsValid = false;
      }
    } else {
      console.log(`❌ ${file}: MISSING`);
      formsValid = false;
    }
  });
  
  return formsValid;
}

function generateReport() {
  console.log('\n📊 RELATÓRIO FINAL...\n');
  
  const totalTests = results.unit.total + results.e2e.total;
  const totalPassed = results.unit.passed + results.e2e.passed;
  const totalFailed = results.unit.failed + results.e2e.failed;
  
  console.log('📈 ESTATÍSTICAS DE TESTES:');
  console.log(`   Testes Unitários: ${results.unit.passed}/${results.unit.total} passaram`);
  console.log(`   Testes E2E: ${results.e2e.passed}/${results.e2e.total} passaram`);
  console.log(`   Total: ${totalPassed}/${totalTests} passaram`);
  
  console.log('\n📊 COBERTURA DE CÓDIGO:');
  console.log(`   Statements: ${results.coverage.statements}%`);
  console.log(`   Branches: ${results.coverage.branches}%`);
  console.log(`   Functions: ${results.coverage.functions}%`);
  console.log(`   Lines: ${results.coverage.lines}%`);
  
  const coverageThreshold = 80;
  const coveragePassed = 
    results.coverage.statements >= coverageThreshold &&
    results.coverage.branches >= coverageThreshold &&
    results.coverage.functions >= coverageThreshold &&
    results.coverage.lines >= coverageThreshold;
  
  console.log(`\n🎯 STATUS FINAL: ${coveragePassed && totalFailed === 0 ? '✅ PROJETO PRONTO' : '❌ NECESSITA CORREÇÕES'}`);
  
  if (coveragePassed && totalFailed === 0) {
    console.log('\n🎉 PARABÉNS! O projeto Alloe Health está 100% validado e pronto para deploy!');
  } else {
    console.log('\n⚠️  O projeto precisa de correções antes de estar pronto para produção.');
  }
  
  // Save report to file
  const report = {
    timestamp: new Date().toISOString(),
    results,
    totalTests,
    totalPassed,
    totalFailed,
    coveragePassed,
    status: coveragePassed && totalFailed === 0 ? 'READY' : 'NEEDS_FIXES'
  };
  
  fs.writeFileSync('comprehensive-test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Relatório salvo em: comprehensive-test-report.json');
}

// Main execution
async function main() {
  try {
    const structureValid = validateProjectStructure();
    const codeQualityValid = validateCodeQuality();
    const databaseValid = validateDatabase();
    const apisValid = validateAPIs();
    const formsValid = validateForms();
    
    if (!structureValid || !codeQualityValid || !databaseValid || !apisValid || !formsValid) {
      console.log('\n❌ Validação básica falhou. Corrija os problemas antes de continuar.');
      process.exit(1);
    }
    
    const jestSuccess = runJestTests();
    const playwrightSuccess = runPlaywrightTests();
    
    generateReport();
    
    if (!jestSuccess || !playwrightSuccess) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n💥 Erro durante a execução dos testes:', error.message);
    process.exit(1);
  }
}

main();
