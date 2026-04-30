#!/usr/bin/env node

/**
 * ⚡ TESTE RÁPIDO - ALLOE HEALTH
 * Verificação rápida de funcionalidades críticas
 */

const { execSync } = require('child_process');

console.log('⚡ TESTE RÁPIDO - ALLOE HEALTH\n');

try {
  // 1. Typecheck
  console.log('🔍 Verificando tipos...');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript OK');

  // 2. Build
  console.log('🔨 Testando build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build OK');

  // 3. Prisma
  console.log('🗄️ Verificando Prisma...');
  execSync('npx prisma generate', { stdio: 'pipe' });
  console.log('✅ Prisma OK');

  console.log('\n🎉 TODOS OS TESTES PASSARAM!');
  console.log('🚀 Projeto pronto para deploy!');

} catch (error) {
  console.error('❌ Erro encontrado:', error.message);
  process.exit(1);
}
