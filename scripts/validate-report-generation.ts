#!/usr/bin/env tsx
/**
 * Script de Validação da Geração de Relatórios
 * 
 * Verifica se todas as condições necessárias para gerar relatórios estão configuradas
 */

const requiredEnvVars = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  AI_REPORT_ENABLED: process.env.AI_REPORT_ENABLED,
  PDF_V2: process.env.PDF_V2,
};

console.log('🔍 Validando configuração para geração de relatórios...\n');

let hasErrors = false;
let hasWarnings = false;

// Verificar variáveis críticas
console.log('📋 Variáveis de Ambiente:');
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.log(`  ❌ ${key}: NÃO CONFIGURADA`);
    hasErrors = true;
  } else if (key === 'OPENAI_API_KEY') {
    const masked = value.substring(0, 7) + '...' + value.substring(value.length - 4);
    console.log(`  ✅ ${key}: ${masked}`);
  } else if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
    const masked = value.substring(0, 7) + '...' + value.substring(value.length - 4);
    console.log(`  ✅ ${key}: ${masked}`);
  } else {
    console.log(`  ✅ ${key}: ${value}`);
  }
});

console.log('\n📊 Status das Feature Flags:');
const pdfV2Enabled = requiredEnvVars.PDF_V2 === '1' || requiredEnvVars.PDF_V2 === 'true';
const aiReportEnabled = requiredEnvVars.AI_REPORT_ENABLED === '1';

console.log(`  ${pdfV2Enabled ? '✅' : '⚠️'} PDF_V2: ${pdfV2Enabled ? 'HABILITADO' : 'DESABILITADO'}`);
console.log(`  ${aiReportEnabled ? '✅' : '⚠️'} AI_REPORT_ENABLED: ${aiReportEnabled ? 'HABILITADO' : 'DESABILITADO'}`);

if (!pdfV2Enabled) {
  console.log('\n  ⚠️  AVISO: PDF_V2 está desabilitado. Relatórios podem não ser gerados corretamente.');
  hasWarnings = true;
}

if (!aiReportEnabled) {
  console.log('\n  ⚠️  AVISO: AI_REPORT_ENABLED está desabilitado. Relatórios serão gerados sem IA.');
  hasWarnings = true;
}

// Verificar se OpenAI API Key está válida (formato básico)
if (requiredEnvVars.OPENAI_API_KEY) {
  const isValidFormat = requiredEnvVars.OPENAI_API_KEY.startsWith('sk-') && requiredEnvVars.OPENAI_API_KEY.length > 20;
  if (!isValidFormat) {
    console.log('\n  ⚠️  AVISO: OPENAI_API_KEY não parece ter formato válido (deve começar com "sk-")');
    hasWarnings = true;
  }
}

console.log('\n📝 Resumo:');
if (hasErrors) {
  console.log('  ❌ ERROS ENCONTRADOS: Algumas variáveis críticas não estão configuradas.');
  console.log('  ⚠️  A geração de relatórios pode falhar em produção.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('  ⚠️  AVISOS: Algumas configurações podem afetar a geração de relatórios.');
  console.log('  ✅ Variáveis críticas estão configuradas.');
  process.exit(0);
} else {
  console.log('  ✅ Tudo configurado corretamente!');
  console.log('  ✅ A geração de relatórios deve funcionar em produção.');
  process.exit(0);
}

