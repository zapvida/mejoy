#!/usr/bin/env tsx
/**
 * Script de teste para validar todos os templates de email
 * 
 * Uso:
 *   npm run test:emails
 *   ou
 *   tsx scripts/test-emails.ts
 */

import {
  sendTriageCompletedEmail,
  sendReportReadyEmail,
  sendPaymentConfirmedEmail,
  sendWelcomeEmail,
  sendGiftReceivedEmail,
  sendFollowUpD1Email,
  sendFollowUpD3Email,
  sendFollowUpD7Email,
} from '../src/lib/email';

const TEST_EMAIL = process.env.TEST_EMAIL || 'teste@zapfarm.com.br';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEmail(
  name: string,
  fn: () => Promise<any>
): Promise<boolean> {
  try {
    log(`\n📧 Testando: ${name}...`, 'blue');
    const result = await fn();
    
    if (result.success) {
      log(`✅ ${name} - Sucesso!`, 'green');
      if (result.messageId) {
        log(`   Message ID: ${result.messageId}`, 'reset');
      }
      return true;
    } else {
      log(`❌ ${name} - Falhou: ${result.error}`, 'red');
      return false;
    }
  } catch (error: any) {
    log(`❌ ${name} - Erro: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('\n🚀 Iniciando testes de email...\n', 'yellow');
  log(`📬 Email de teste: ${TEST_EMAIL}`, 'blue');
  log(`💡 Configure TEST_EMAIL=seu-email@exemplo.com para testar com seu email\n`, 'yellow');

  const results: { name: string; success: boolean }[] = [];

  // Teste 1: Triagem completada
  results.push({
    name: 'Triagem Completada',
    success: await testEmail('Triagem Completada', () =>
      sendTriageCompletedEmail(TEST_EMAIL, {
        name: 'João Silva',
        firstName: 'João',
        reportUrl: 'https://www.zapfarm.com.br/dashboard',
      })
    ),
  });

  // Teste 2: Relatório pronto
  results.push({
    name: 'Relatório Pronto',
    success: await testEmail('Relatório Pronto', () =>
      sendReportReadyEmail(TEST_EMAIL, {
        name: 'João Silva',
        firstName: 'João',
        reportUrl: 'https://www.zapfarm.com.br/report/123',
        triageType: 'gastro',
      })
    ),
  });

  // Teste 3: Pagamento confirmado
  results.push({
    name: 'Pagamento Confirmado',
    success: await testEmail('Pagamento Confirmado', () =>
      sendPaymentConfirmedEmail(TEST_EMAIL, {
        name: 'João Silva',
        firstName: 'João',
        productName: 'Plano Plus - Mensal',
        amount: 99.9,
        orderId: 'ord_123456',
        paymentMethod: 'Cartão de crédito',
      })
    ),
  });

  // Teste 4: Boas-vindas
  results.push({
    name: 'Boas-vindas',
    success: await testEmail('Boas-vindas', () =>
      sendWelcomeEmail(TEST_EMAIL, {
        name: 'João Silva',
        firstName: 'João',
      })
    ),
  });

  // Teste 5: Presente recebido
  results.push({
    name: 'Presente Recebido',
    success: await testEmail('Presente Recebido', () =>
      sendGiftReceivedEmail(TEST_EMAIL, {
        name: 'João Silva',
        firstName: 'João',
        giftCode: 'GIFT-ABC123',
        giftMessage: 'Um presente especial para você!',
      })
    ),
  });

  // Teste 6: Follow-up D+1
  results.push({
    name: 'Follow-up D+1',
    success: await testEmail('Follow-up D+1', () =>
      sendFollowUpD1Email(TEST_EMAIL, {
        name: 'João Silva',
        firstName: 'João',
        tipSono: 'Durma pelo menos 7-8 horas por noite',
        tipNutricao: 'Beba 2 litros de água por dia',
        tipRotina: 'Faça 30 minutos de exercício diário',
      })
    ),
  });

  // Teste 7: Follow-up D+3
  results.push({
    name: 'Follow-up D+3',
    success: await testEmail('Follow-up D+3', () =>
      sendFollowUpD3Email(TEST_EMAIL, {
        name: 'João Silva',
        firstName: 'João',
      })
    ),
  });

  // Teste 8: Follow-up D+7
  results.push({
    name: 'Follow-up D+7',
    success: await testEmail('Follow-up D+7', () =>
      sendFollowUpD7Email(TEST_EMAIL, {
        name: 'João Silva',
        firstName: 'João',
      })
    ),
  });

  // Resumo
  log('\n' + '='.repeat(50), 'yellow');
  log('📊 RESUMO DOS TESTES', 'yellow');
  log('='.repeat(50), 'yellow');

  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;

  results.forEach((result) => {
    if (result.success) {
      log(`✅ ${result.name}`, 'green');
    } else {
      log(`❌ ${result.name}`, 'red');
    }
  });

  log('\n' + '='.repeat(50), 'yellow');
  log(`Total: ${successCount}/${totalCount} testes passaram`, successCount === totalCount ? 'green' : 'red');
  log('='.repeat(50) + '\n', 'yellow');

  if (successCount === totalCount) {
    log('🎉 Todos os testes passaram!', 'green');
    process.exit(0);
  } else {
    log('⚠️  Alguns testes falharam. Verifique a configuração do Resend.', 'yellow');
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

