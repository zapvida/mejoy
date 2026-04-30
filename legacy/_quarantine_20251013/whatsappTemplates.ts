import { t } from '@/lib/i18n';
import { buildZapVidaUrl } from '@/lib/utm';

// Templates de mensagens WhatsApp
export function getWhatsAppTemplate(templateType: string, data: any = {}) {
  const templates: Record<string, any> = {
    'report_ready': {
      message: t('whatsapp.report_ready', { link: data.link }),
      type: 'notification'
    },
    'daily_tip': {
      message: t('whatsapp.daily_tip', { 
        dica: data.dica || 'Mantenha-se hidratado', 
        link: data.link 
      }),
      type: 'tip'
    },
    'doctor_now': {
      message: t('whatsapp.doctor_now', { 
        zapvida_link: buildZapVidaUrl('whatsapp', 'gastro')
      }),
      type: 'urgent'
    }
  };

  return templates[templateType] || null;
}

// Helper para enviar mensagem WhatsApp
export function sendWhatsAppMessage(phone: string, message: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
  
  return whatsappUrl;
}

// Sequência de mensagens WhatsApp pós-triagem
export function getWhatsAppSequence(triageType: string, reportId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alloehealth.com';
  const reportLink = `${baseUrl}/relatorio/${reportId}`;
  
  return [
    {
      delay: 0, // Imediato
      template: 'report_ready',
      data: { link: reportLink }
    },
    {
      delay: 24 * 60 * 60 * 1000, // 24 horas
      template: 'daily_tip',
      data: { 
        dica: 'Beba pelo menos 2 litros de água por dia',
        link: reportLink 
      }
    },
    {
      delay: 3 * 24 * 60 * 60 * 1000, // 3 dias
      template: 'daily_tip',
      data: { 
        dica: 'Faça uma caminhada de 30 minutos hoje',
        link: reportLink 
      }
    },
    {
      delay: 7 * 24 * 60 * 60 * 1000, // 7 dias
      template: 'doctor_now',
      data: {}
    }
  ];
}

// Helper para formatar mensagem com emojis
export function formatWhatsAppMessage(template: any, data: any = {}) {
  let message = template.message;
  
  // Substituir variáveis
  Object.keys(data).forEach(key => {
    message = message.replace(`{{${key}}}`, data[key]);
  });
  
  // Adicionar emojis baseado no tipo
  const emojiMap: Record<string, string> = {
    notification: '📄',
    tip: '💡',
    urgent: '🚨'
  };
  
  const emoji = emojiMap[template.type] || '📱';
  return `${emoji} ${message}`;
}

export default {
  getWhatsAppTemplate,
  sendWhatsAppMessage,
  getWhatsAppSequence,
  formatWhatsAppMessage
};
