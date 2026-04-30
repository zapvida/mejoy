// Teste rápido do Resend
const { Resend } = require('resend');

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_P3HGAEGN_GdGZznTsjAQAtPkdBL447...';

const resend = new Resend(RESEND_API_KEY);

async function test() {
  console.log('🧪 Testando Resend...');
  console.log('API Key:', RESEND_API_KEY.substring(0, 20) + '...');
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'ZapFarm <zapvidafarmx@gmail.com>',
      to: 'zapvidafarmx@gmail.com',
      subject: '✅ Teste Resend - ZapFarm',
      html: `
        <h1>Teste de Configuração</h1>
        <p>Se você recebeu este email, o Resend está funcionando corretamente!</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      `,
      text: 'Teste de configuração do Resend - Se você recebeu isso, está funcionando!',
    });

    if (error) {
      console.error('❌ Erro:', error);
      console.error('Detalhes:', JSON.stringify(error, null, 2));
      process.exit(1);
    }

    console.log('✅ Email enviado com sucesso!');
    console.log('📧 ID do email:', data?.id);
    console.log('📬 Verifique sua caixa de entrada: zapvidafarmx@gmail.com');
    console.log('🔗 Dashboard: https://resend.com/emails');
  } catch (err) {
    console.error('❌ Erro ao enviar:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
}

test();
