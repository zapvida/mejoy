// scripts/deploy-config.js
// Configurações para deploy seguro

export const DEPLOY_CONFIG = {
  // Feature flags para rollout seguro
  featureFlags: {
    TRIAGE_NEW_ROLLUP: process.env.NEXT_PUBLIC_TRIAGE_NEW_ROLLUP === '1',
    EMOJI_MODE: process.env.NEXT_PUBLIC_EMOJI_MODE || 'legacy',
    LAUNCH_ALL_FREE: process.env.NEXT_PUBLIC_LAUNCH_ALL_FREE === 'true'
  },
  
  // URLs base para CTAs
  ctaUrls: {
    zapvida: process.env.NEXT_PUBLIC_ZAPVIDA_URL || 'https://zapvida.com/',
    alloe: process.env.NEXT_PUBLIC_ALLOE_URL || 'https://alloeoficial.com.br/'
  },
  
  // Configurações de telemetria
  telemetry: {
    ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN
  },
  
  // Configurações de build
  build: {
    version: process.env.NEXT_PUBLIC_BUILD_VERSION || '1.0.0',
    date: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString().split('T')[0]
  }
};

// Validação de configurações
export function validateDeployConfig() {
  const errors = [];
  
  if (!DEPLOY_CONFIG.telemetry.ga4MeasurementId) {
    errors.push('NEXT_PUBLIC_GA4_MEASUREMENT_ID é obrigatório');
  }
  
  if (!DEPLOY_CONFIG.telemetry.sentryDsn) {
    errors.push('NEXT_PUBLIC_SENTRY_DSN é obrigatório');
  }
  
  if (errors.length > 0) {
    console.error('❌ Erros de configuração:');
    errors.forEach(error => console.error(`  - ${error}`));
    return false;
  }
  
  console.log('✅ Configurações válidas');
  return true;
}

// Log de configurações ativas
export function logActiveConfig() {
  console.log('🚀 Configurações ativas:');
  console.log(`  - Triagens expandidas: ${DEPLOY_CONFIG.featureFlags.TRIAGE_NEW_ROLLUP ? 'ON' : 'OFF'}`);
  console.log(`  - Modo Emoji: ${DEPLOY_CONFIG.featureFlags.EMOJI_MODE}`);
  console.log(`  - Todas gratuitas: ${DEPLOY_CONFIG.featureFlags.LAUNCH_ALL_FREE ? 'ON' : 'OFF'}`);
  console.log(`  - Versão: ${DEPLOY_CONFIG.build.version}`);
  console.log(`  - Data: ${DEPLOY_CONFIG.build.date}`);
}
