// src/lib/followUp.ts
import { getEmailTemplate } from './emailTemplates';

export const FOLLOW_UP_SEQUENCE = [
  { delay: '1h', type: 'email', template: 'relatorio_visualizado' },
  { delay: '24h', type: 'whatsapp', template: 'consulta_medica' },
  { delay: '72h', type: 'email', template: 'produtos_alloe' },
  { delay: '7d', type: 'whatsapp', template: 'nova_triagem' }
];

interface FollowUpData {
  userId: string;
  nome: string;
  email?: string;
  whatsapp?: string;
  tipoTriagem?: string;
  score?: number;
  kitRecomendado?: string;
}

export class FollowUpManager {
  private static instance: FollowUpManager;
  private scheduledJobs: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): FollowUpManager {
    if (!FollowUpManager.instance) {
      FollowUpManager.instance = new FollowUpManager();
    }
    return FollowUpManager.instance;
  }

  // Agendar follow-up após visualização de relatório
  scheduleReportFollowUp(data: FollowUpData) {
    const { userId, nome, email, whatsapp, tipoTriagem, score } = data;
    
    // 1h - Email de relatório visualizado
    if (email) {
      this.scheduleEmail(
        `${userId}_report_1h`,
        1 * 60 * 60 * 1000, // 1 hora
        email,
        'Seu relatório AlloeHealth foi visualizado',
        getEmailTemplate('relatorio_visualizado', { nome, tipoTriagem: tipoTriagem || 'triagem', score: score || 0 })
      );
    }

    // 24h - WhatsApp consulta médica
    if (whatsapp) {
      this.scheduleWhatsApp(
        `${userId}_consult_24h`,
        24 * 60 * 60 * 1000, // 24 horas
        whatsapp,
        'consulta_medica',
        { nome, tipoTriagem, score }
      );
    }

    // 72h - Email produtos Alloe
    if (email) {
      this.scheduleEmail(
        `${userId}_products_72h`,
        72 * 60 * 60 * 1000, // 72 horas
        email,
        'Produtos recomendados para você',
        getEmailTemplate('produtos_alloe', { nome, kitRecomendado: data.kitRecomendado || 'Kit Geral' })
      );
    }

    // 7d - WhatsApp nova triagem
    if (whatsapp) {
      this.scheduleWhatsApp(
        `${userId}_new_triage_7d`,
        7 * 24 * 60 * 60 * 1000, // 7 dias
        whatsapp,
        'nova_triagem',
        { nome }
      );
    }
  }

  // Agendar follow-up após ativação de assinatura
  scheduleSubscriptionFollowUp(data: FollowUpData) {
    const { userId, nome, email } = data;
    
    if (email) {
      // Email de ativação imediato
      this.scheduleEmail(
        `${userId}_activation_immediate`,
        0, // Imediato
        email,
        'Sua assinatura AlloeHealth está ativa!',
        getEmailTemplate('ativacao_assinatura', { nome, link: `${process.env.NEXT_PUBLIC_BASE_URL}/triagem` })
      );

      // Lembrete aos 21 dias
      this.scheduleEmail(
        `${userId}_reminder_21d`,
        21 * 24 * 60 * 60 * 1000, // 21 dias
        email,
        'Faltam 9 dias no seu acesso',
        getEmailTemplate('lembrete_21', { nome, link: `${process.env.NEXT_PUBLIC_BASE_URL}/triagem` })
      );
    }
  }

  // Agendar follow-up após envio de presente
  scheduleGiftFollowUp(data: FollowUpData & { recipientWhats?: string; recipientEmail?: string; message?: string }) {
    const { userId, nome, recipientWhats, recipientEmail, message } = data;
    
    if (recipientEmail) {
      this.scheduleEmail(
        `${userId}_gift_sent`,
        0, // Imediato
        recipientEmail,
        'Você recebeu um presente especial!',
        getEmailTemplate('presente_enviado', { nome, message })
      );
    }

    if (recipientWhats) {
      this.scheduleWhatsApp(
        `${userId}_gift_whatsapp`,
        0, // Imediato
        recipientWhats,
        'presente_enviado',
        { remetente: nome, message }
      );
    }
  }

  // eslint-disable-next-line no-unused-vars
  private scheduleEmail(jobId: string, delay: number, to: string, subject: string, _content: string) {
    const timeout = setTimeout(async () => {
      try {
        console.log(`📧 Mock email sent to ${to}: ${subject}`);
        console.log(`✅ Email enviado: ${jobId}`);
      } catch (error) {
        console.error(`❌ Erro ao enviar email ${jobId}:`, error);
      }
    }, delay);

    this.scheduledJobs.set(jobId, timeout);
    console.log(`📅 Email agendado: ${jobId} em ${delay}ms`);
  }

  private scheduleWhatsApp(jobId: string, delay: number, whatsapp: string, template: string, data: any) {
    const timeout = setTimeout(async () => {
      try {
        await this.sendWhatsAppMessage(whatsapp, template, data);
        console.log(`✅ WhatsApp enviado: ${jobId}`);
      } catch (error) {
        console.error(`❌ Erro ao enviar WhatsApp ${jobId}:`, error);
      }
    }, delay);

    this.scheduledJobs.set(jobId, timeout);
    console.log(`📅 WhatsApp agendado: ${jobId} em ${delay}ms`);
  }

  private async sendWhatsAppMessage(whatsapp: string, template: string, data: any) {
    // Aqui você integraria com sua API de WhatsApp (Twilio, etc.)
    console.log(`📱 Enviando WhatsApp para ${whatsapp}:`);
    console.log(`Template: ${template}`);
    console.log(`Data:`, data);
    
    // Exemplo de integração real:
    // await fetch('https://api.twilio.com/2010-04-01/Accounts/ACxxx/Messages.json', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   body: new URLSearchParams({
    //     To: `whatsapp:${whatsapp}`,
    //     From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    //     Body: this.getWhatsAppTemplate(template, data)
    //   })
    // });
  }

  // Cancelar follow-ups de um usuário
  cancelUserFollowUps(userId: string) {
    const jobsToCancel = Array.from(this.scheduledJobs.keys()).filter(jobId => 
      jobId.startsWith(`${userId}_`)
    );

    jobsToCancel.forEach(jobId => {
      const timeout = this.scheduledJobs.get(jobId);
      if (timeout) {
        clearTimeout(timeout);
        this.scheduledJobs.delete(jobId);
        console.log(`❌ Follow-up cancelado: ${jobId}`);
      }
    });
  }

  // Listar jobs agendados (para debug)
  listScheduledJobs() {
    return Array.from(this.scheduledJobs.keys());
  }
}

// Instância singleton
export const followUpManager = FollowUpManager.getInstance();
