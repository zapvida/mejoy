// Endpoint de teste para verificar se Resend está funcionando
import { NextApiRequest, NextApiResponse } from 'next';
import { sendTriageCompletedEmail } from '@/lib/email';

// Configurar CORS
function setCorsHeaders(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Suportar OPTIONS para preflight CORS
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    return res.status(200).end();
  }

  // Permitir GET para teste fácil (mostra status)
  if (req.method === 'GET') {
    setCorsHeaders(res);
    return res.status(200).json({
      status: 'ok',
      message: 'Endpoint funcionando. Use POST para testar envio de email.',
      method: 'POST',
      example: {
        email: 'zapfarmx@gmail.com'
      },
      resendConfigured: !!process.env.RESEND_API_KEY,
      emailFrom: process.env.EMAIL_FROM || 'padrão',
      emailReplyTo: process.env.EMAIL_REPLY_TO || 'padrão',
    });
  }

  if (req.method !== 'POST') {
    setCorsHeaders(res);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  setCorsHeaders(res);

  const { email } = req.body;
  const testEmail = email || 'zapfarmx@gmail.com';

  try {
    console.log('🧪 [test-resend] Iniciando teste...');
    console.log('📧 [test-resend] Email:', testEmail);
    console.log('🔑 [test-resend] RESEND_API_KEY configurada:', !!process.env.RESEND_API_KEY);
    console.log('📧 [test-resend] EMAIL_FROM:', process.env.EMAIL_FROM || 'padrão');
    console.log('📧 [test-resend] EMAIL_REPLY_TO:', process.env.EMAIL_REPLY_TO || 'padrão');

    const result = await sendTriageCompletedEmail(testEmail, {
      name: 'Teste Me Joy',
      firstName: 'Teste',
      reportUrl: 'https://www.zapfarm.com.br/dashboard',
    });

    if (result.success) {
      console.log('✅ [test-resend] Email enviado com sucesso!');
      console.log('📧 [test-resend] Message ID:', result.messageId);
      
      return res.status(200).json({
        success: true,
        message: 'Email enviado com sucesso!',
        messageId: result.messageId,
        email: testEmail,
        checkInbox: `Verifique sua caixa de entrada: ${testEmail}`,
        dashboard: 'https://resend.com/emails',
      });
    } else {
      console.error('❌ [test-resend] Erro ao enviar:', result.error);
      
      setCorsHeaders(res);
      return res.status(500).json({
        success: false,
        error: result.error || 'Erro desconhecido',
        details: {
          email: testEmail,
          resendApiKeyConfigured: !!process.env.RESEND_API_KEY,
          resendApiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 15) || 'não configurada',
          emailFrom: process.env.EMAIL_FROM || 'padrão',
          emailReplyTo: process.env.EMAIL_REPLY_TO || 'padrão',
        },
      });
    }
  } catch (error: any) {
    console.error('❌ [test-resend] Erro fatal:', error);
    
    setCorsHeaders(res);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao testar Resend',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      details: {
        email: testEmail,
        resendApiKeyConfigured: !!process.env.RESEND_API_KEY,
        resendApiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 15) || 'não configurada',
      },
    });
  }
}

