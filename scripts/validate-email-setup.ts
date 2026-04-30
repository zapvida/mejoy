#!/usr/bin/env tsx
/**
 * Script de validação rápida do setup de emails
 * 
 * Uso:
 *   npm run validate:emails
 *   ou
 *   tsx scripts/validate-email-setup.ts
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvVar(name: string, required: boolean = true): boolean {
  const value = process.env[name];
  if (!value && required) {
    log(`❌ ${name} não configurada`, 'red');
    return false;
  } else if (!value) {
    log(`⚠️  ${name} não configurada (opcional)`, 'yellow');
    return true;
  } else {
    log(`✅ ${name} configurada`, 'green');
    return true;
  }
}

function checkFile(filePath: string, description: string): boolean {
  try {
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      log(`✅ ${description} existe`, 'green');
      return true;
    } else {
      log(`❌ ${description} não encontrado: ${filePath}`, 'red');
      return false;
    }
  } catch {
    log(`⚠️  Não foi possível verificar ${description}`, 'yellow');
    return false;
  }
}

async function main() {
  log('\n🔍 Validação do Setup de Emails - ZapFarm\n', 'cyan');
  log('='.repeat(60), 'blue');

  const checks: { name: string; passed: boolean }[] = [];

  // 1. Variáveis de ambiente
  log('\n📋 Variáveis de Ambiente:', 'yellow');
  checks.push({
    name: 'RESEND_API_KEY',
    passed: checkEnvVar('RESEND_API_KEY', true),
  });
  checks.push({
    name: 'EMAIL_FROM',
    passed: checkEnvVar('EMAIL_FROM', false),
  });
  checks.push({
    name: 'EMAIL_REPLY_TO',
    passed: checkEnvVar('EMAIL_REPLY_TO', false),
  });
  checks.push({
    name: 'NEXT_PUBLIC_SITE_URL',
    passed: checkEnvVar('NEXT_PUBLIC_SITE_URL', false),
  });

  // 2. Arquivos do sistema de email
  log('\n📁 Arquivos do Sistema:', 'yellow');
  checks.push({
    name: 'Email Client',
    passed: checkFile('src/lib/email/client.ts', 'Cliente de email'),
  });
  checks.push({
    name: 'Email Templates',
    passed: checkFile('src/lib/email/templates.ts', 'Templates de email'),
  });
  checks.push({
    name: 'Email Types',
    passed: checkFile('src/lib/email/types.ts', 'Tipos TypeScript'),
  });
  checks.push({
    name: 'Email Index',
    passed: checkFile('src/lib/email/index.ts', 'Índice de emails'),
  });

  // 3. Integrações
  log('\n🔗 Integrações:', 'yellow');
  checks.push({
    name: 'Analytics Integration',
    passed: checkFile('src/pages/api/analytics/event.ts', 'Integração com analytics'),
  });
  checks.push({
    name: 'Stripe Integration',
    passed: checkFile('src/lib/stripe/handlers.ts', 'Integração com Stripe'),
  });
  checks.push({
    name: 'Asaas Integration',
    passed: checkFile('src/pages/api/asaas/webhook.ts', 'Integração com Asaas'),
  });

  // 4. Scripts de teste
  log('\n🧪 Scripts de Teste:', 'yellow');
  checks.push({
    name: 'Test Script',
    passed: checkFile('scripts/test-emails.ts', 'Script de teste'),
  });
  checks.push({
    name: 'Preview Endpoint',
    passed: checkFile('src/pages/api/admin/email-preview.ts', 'Endpoint de preview'),
  });

  // 5. Verificar Resend instalado
  log('\n📦 Dependências:', 'yellow');
  try {
    const packageJson = require('../package.json');
    if (packageJson.dependencies?.resend || packageJson.dependencies?.['resend']) {
      log('✅ Resend instalado', 'green');
      checks.push({ name: 'Resend Package', passed: true });
    } else {
      log('❌ Resend não encontrado no package.json', 'red');
      checks.push({ name: 'Resend Package', passed: false });
    }
  } catch {
    log('⚠️  Não foi possível verificar package.json', 'yellow');
    checks.push({ name: 'Resend Package', passed: false });
  }

  // Resumo
  log('\n' + '='.repeat(60), 'blue');
  log('📊 RESUMO', 'cyan');
  log('='.repeat(60), 'blue');

  const passed = checks.filter((c) => c.passed).length;
  const total = checks.length;

  checks.forEach((check) => {
    if (check.passed) {
      log(`✅ ${check.name}`, 'green');
    } else {
      log(`❌ ${check.name}`, 'red');
    }
  });

  log('\n' + '='.repeat(60), 'blue');
  log(`Total: ${passed}/${total} verificações passaram`, passed === total ? 'green' : 'yellow');
  log('='.repeat(60) + '\n', 'blue');

  if (passed === total) {
    log('🎉 Setup completo! Pronto para testes.', 'green');
    log('\nPróximos passos:', 'cyan');
    log('1. Execute: TEST_EMAIL=seu-email@exemplo.com npm run test:emails', 'reset');
    log('2. Acesse: http://localhost:3000/admin/email-validation', 'reset');
    log('3. Verifique o checklist: docs/EMAIL_VALIDATION_CHECKLIST.md\n', 'reset');
    process.exit(0);
  } else {
    log('⚠️  Algumas verificações falharam. Corrija antes de continuar.', 'yellow');
    log('\nConsulte: docs/EMAIL_SETUP.md\n', 'cyan');
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

export {};

