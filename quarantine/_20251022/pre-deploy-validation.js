#!/usr/bin/env node

// scripts/pre-deploy-validation.js
// Validação completa antes do deploy

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Iniciando validação pré-deploy...');

const checks = [
  {
    name: 'Lint',
    command: 'pnpm lint',
    critical: false
  },
  {
    name: 'Type Check',
    command: 'pnpm typecheck',
    critical: true
  },
  {
    name: 'Build',
    command: 'pnpm build',
    critical: true
  },
  {
    name: 'Testes E2E Básicos',
    command: 'pnpm test:e2e:basic',
    critical: false
  }
];

const results = [];

for (const check of checks) {
  console.log(`⏳ Executando: ${check.name}...`);
  
  try {
    execSync(check.command, { 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    console.log(`✅ ${check.name}: PASSOU`);
    results.push({ name: check.name, status: 'PASSOU', critical: check.critical });
    
  } catch (error) {
    console.log(`❌ ${check.name}: FALHOU`);
    console.log(`   Erro: ${error.message}`);
    results.push({ name: check.name, status: 'FALHOU', critical: check.critical });
  }
}

// Verificar arquivos essenciais
console.log('⏳ Verificando arquivos essenciais...');

const essentialFiles = [
  'src/features/patient/profile.ts',
  'src/features/triage/emojis.ts',
  'src/features/triage/ctas.ts',
  'src/features/triage/catalog.ts',
  'src/components/patient/PatientBasicsForm.tsx'
];

for (const file of essentialFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}: EXISTE`);
  } else {
    console.log(`❌ ${file}: NÃO ENCONTRADO`);
    results.push({ name: `Arquivo ${file}`, status: 'FALHOU', critical: true });
  }
}

// Verificar triagens geradas
console.log('⏳ Verificando triagens geradas...');

const triageFiles = [
  'cardiovascular.ts', 'diabetes-metabolismo.ts', 'dor-cronica.ts',
  'coluna.ts', 'respiratoria.ts', 'renal.ts', 'hepatica.ts',
  'mulher.ts', 'prostata.ts', 'tireoide.ts', 'mama.ts',
  'ocular.ts', 'auditiva.ts', 'pele.ts', 'alergias.ts',
  'sexual.ts', 'idoso.ts', 'bucal.ts', 'crianca.ts',
  'trabalhador.ts', 'longevidade.ts', 'vitalidade.ts',
  'microbioma.ts', 'micronutrientes.ts', 'biohacking.ts'
];

let triageCount = 0;
for (const file of triageFiles) {
  const formPath = path.join('src/forms', file);
  const configPath = path.join('src/features/triage/configs', file);
  
  if (fs.existsSync(formPath) && fs.existsSync(configPath)) {
    triageCount++;
  }
}

console.log(`✅ Triagens geradas: ${triageCount}/${triageFiles.length}`);

if (triageCount < triageFiles.length) {
  results.push({ name: 'Triagens geradas', status: 'FALHOU', critical: true });
}

// Relatório final
console.log('\n📊 RELATÓRIO FINAL:');

const passed = results.filter(r => r.status === 'PASSOU').length;
const failed = results.filter(r => r.status === 'FALHOU').length;
const criticalFailed = results.filter(r => r.status === 'FALHOU' && r.critical).length;

console.log(`✅ Testes passaram: ${passed}`);
console.log(`❌ Testes falharam: ${failed}`);
console.log(`🚨 Falhas críticas: ${criticalFailed}`);

if (criticalFailed > 0) {
  console.log('\n❌ DEPLOY BLOQUEADO - Falhas críticas encontradas:');
  results
    .filter(r => r.status === 'FALHOU' && r.critical)
    .forEach(r => console.log(`  - ${r.name}`));
  
  process.exit(1);
} else if (failed > 0) {
  console.log('\n⚠️  DEPLOY PERMITIDO - Apenas falhas não críticas');
  results
    .filter(r => r.status === 'FALHOU' && !r.critical)
    .forEach(r => console.log(`  - ${r.name}`));
} else {
  console.log('\n🎉 DEPLOY APROVADO - Todos os testes passaram!');
}

console.log('\n🚀 Pronto para deploy!');
