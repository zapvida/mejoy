import { t } from '@/lib/i18n';
import { getCtaDeck } from '@/lib/utm';

// Template base para emails
export function getEmailTemplate(templateType: string, data: any = {}) {
  const templates: Record<string, any> = {
    'd0_report_ready': {
      subject: t('emails.d0_report_ready.subject'),
      preview: t('emails.d0_report_ready.preview'),
      body: [
        `Olá, ${data.firstName || 'usuário'}!`,
        t('emails.d0_report_ready.body')[1],
        t('emails.d0_report_ready.body')[2],
        t('emails.d0_report_ready.body')[3]
      ],
      ctaDeck: true
    },
    'd1_act_today': {
      subject: t('emails.d1_act_today.subject'),
      preview: t('emails.d1_act_today.preview'),
      body: [
        t('emails.d1_act_today.body')[0],
        `• Sono: ${data.tip_sono || 'Mantenha horário regular'}`,
        `• Nutrição: ${data.tip_nutricao || 'Evite alimentos processados'}`,
        `• Rotina: ${data.tip_rotina || 'Faça exercícios regulares'}`
      ],
      ctaPriority: 'products_doctor'
    },
    'd3_pass_offer': {
      subject: t('emails.d3_pass_offer.subject'),
      preview: t('emails.d3_pass_offer.preview'),
      body: [
        t('emails.d3_pass_offer.body')[0],
        t('emails.d3_pass_offer.body')[1]
      ],
      cta: 'pass'
    },
    'd7_gift': {
      subject: t('emails.d7_gift.subject'),
      preview: t('emails.d7_gift.preview'),
      body: [
        t('emails.d7_gift.body')[0],
        t('emails.d7_gift.body')[1]
      ],
      cta: 'gift'
    }
  };

  return templates[templateType] || null;
}

// Helper para renderizar CTAs em emails
export function renderEmailCtas(context: string, triage: string = 'gastro', priority?: string) {
  const ctaDeck = getCtaDeck(context, triage);
  
  if (priority === 'products_doctor') {
    return ctaDeck.filter(cta => cta.type === 'products' || cta.type === 'doctor');
  }
  
  return ctaDeck;
}

// Template HTML básico para emails
export function generateEmailHTML(template: any, ctaDeck: any[] = []) {
  const ctaButtons = ctaDeck.map(cta => `
    <div style="margin: 20px 0; text-align: center;">
      <a href="${cta.href}" 
         style="display: inline-block; padding: 12px 24px; background-color: #00D084; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
        ${cta.label}
      </a>
      <p style="font-size: 12px; color: #666; margin-top: 8px;">${cta.sub}</p>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${template.subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #00D084; margin-bottom: 10px;">AlloeHealth</h1>
        <p style="color: #666; font-size: 14px;">Triagens inteligentes. Relatórios claros. Ação certa.</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        ${template.body.map((line: string) => `<p style="margin: 10px 0;">${line}</p>`).join('')}
      </div>
      
      ${ctaButtons}
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
        <p>${t('emails.footer_disclaimer')}</p>
        <p>${t('legal.footer_institutional')}</p>
        <p><a href="#" style="color: #00D084;">Descadastrar</a> | <a href="#" style="color: #00D084;">Política de Privacidade</a></p>
      </div>
    </body>
    </html>
  `;
}

export default {
  getEmailTemplate,
  renderEmailCtas,
  generateEmailHTML
};