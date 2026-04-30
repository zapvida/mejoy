import { Resend } from 'resend';
import { EmailData, EmailResult } from './types';
import { renderTemplate } from './templates';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ RESEND_API_KEY não configurada. Emails não serão enviados em produção.');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Resend permite usar @resend.dev quando não há domínio verificado
// Se EMAIL_FROM usar @gmail.com ou outro domínio não verificado, usar @resend.dev
function sanitizeEmailFrom(emailFrom: string | undefined): string {
  if (!emailFrom) {
    return 'Me Joy <onboarding@resend.dev>';
  }
  
  // Se usar @gmail.com, @yahoo.com, @hotmail.com ou outros domínios não verificados, substituir por @resend.dev
  const unverifiedDomains = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@live.com'];
  const hasUnverifiedDomain = unverifiedDomains.some(domain => emailFrom.includes(domain));
  
  if (hasUnverifiedDomain) {
    // Extrair o nome antes do <
    const nameMatch = emailFrom.match(/^([^<]+)</);
    const name = nameMatch ? nameMatch[1].trim() : 'Me Joy';
    console.log(`⚠️ [email] EMAIL_FROM usa domínio não verificado, substituindo por @resend.dev: ${emailFrom} → ${name} <onboarding@resend.dev>`);
    return `${name} <onboarding@resend.dev>`;
  }
  
  return emailFrom;
}

const DEFAULT_FROM = sanitizeEmailFrom(process.env.EMAIL_FROM);
const DEFAULT_REPLY_TO = process.env.EMAIL_REPLY_TO || 'onboarding@resend.dev';

export async function sendEmail({
  to,
  subject,
  template,
  data,
  from = DEFAULT_FROM,
  replyTo = DEFAULT_REPLY_TO,
  cc,
  bcc,
  attachments,
}: EmailData): Promise<EmailResult> {
  // Validar destinatário
  if (!to || (typeof to === 'string' && !to.includes('@'))) {
    const errorMsg = 'Destinatário inválido';
    console.error(`❌ ${errorMsg}:`, to);
    return { success: false, error: errorMsg };
  }

  // Se não houver API key, apenas logar em desenvolvimento
  if (!resend) {
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 [DEV] Email não enviado (RESEND_API_KEY não configurada):', {
        to,
        subject,
        template,
      });
      return { success: true, messageId: 'dev-mock-id' };
    }
    // Em produção, logar mas não quebrar o fluxo
    console.warn('⚠️ RESEND_API_KEY não configurada. Email não enviado:', { 
      to, 
      subject, 
      template,
      nodeEnv: process.env.NODE_ENV,
      hasApiKey: !!process.env.RESEND_API_KEY,
      apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) || 'não configurada',
    });
    return {
      success: false,
      error: 'RESEND_API_KEY não configurada',
    };
  }

  try {
    // Renderizar template HTML
    const { html, text } = renderTemplate(template, data);

    // Preparar destinatários
    const recipients = Array.isArray(to) ? to : [to];

    // Garantir que 'from' não usa domínio não verificado
    const sanitizedFrom = sanitizeEmailFrom(from || DEFAULT_FROM);
    
    console.log(`📧 [email] Enviando email:`, {
      from: sanitizedFrom,
      to: recipients,
      subject,
    });

    // Enviar email via Resend
    const result = await resend.emails.send({
      from: sanitizedFrom,
      to: recipients,
      subject,
      html,
      text,
      replyTo: replyTo,
      cc: cc?.length ? cc : undefined,
      bcc: bcc?.length ? bcc : undefined,
      attachments: attachments?.map((att) => ({
        filename: att.filename,
        content: typeof att.content === 'string' 
          ? Buffer.from(att.content).toString('base64')
          : att.content.toString('base64'),
        content_type: att.contentType,
      })),
    });

    if (result.error) {
      console.error('❌ Erro ao enviar email:', result.error);
      return {
        success: false,
        error: result.error.message || 'Erro desconhecido ao enviar email',
      };
    }

    console.log('✅ Email enviado com sucesso:', {
      to: recipients.join(', '),
      subject,
      messageId: result.data?.id,
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('❌ Erro ao enviar email:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Função auxiliar para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para normalizar email (lowercase, trim)
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

