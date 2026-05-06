import { EmailTemplate, EmailTemplateData } from './types';

const BRAND_COLORS = {
  primary: '#00D084', // Verde MeJoy
  secondary: '#0A0A0A', // Preto
  text: '#333333',
  textLight: '#666666',
  background: '#FFFFFF',
  border: '#E5E5E5',
};

function getBaseTemplate(content: string, data: EmailTemplateData): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mejoy.com.br';
  const unsubscribeUrl = data.unsubscribeUrl || `${siteUrl}/unsubscribe?email=${encodeURIComponent(data.email || '')}`;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>MeJoy</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: ${BRAND_COLORS.background}; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, #00B875 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: ${BRAND_COLORS.background}; font-size: 28px; font-weight: 700;">
                MeJoy
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9f9f9; border-top: 1px solid ${BRAND_COLORS.border};">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: ${BRAND_COLORS.textLight}; text-align: center;">
                Este é um email automático da MeJoy. Por favor, não responda diretamente.
              </p>
              <p style="margin: 0; font-size: 12px; color: ${BRAND_COLORS.textLight}; text-align: center;">
                <a href="${unsubscribeUrl}" style="color: ${BRAND_COLORS.textLight}; text-decoration: underline;">Descadastrar</a> | 
                <a href="${siteUrl}" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">Visitar site</a>
              </p>
              <p style="margin: 20px 0 0 0; font-size: 11px; color: ${BRAND_COLORS.textLight}; text-align: center; line-height: 1.5;">
                MeJoy - Saúde personalizada com inteligência artificial<br>
                ${siteUrl}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function getButtonStyle(href: string, label: string): string {
  return `
    <table role="presentation" style="margin: 30px 0;">
      <tr>
        <td align="center">
          <a href="${href}" style="display: inline-block; padding: 14px 32px; background-color: ${BRAND_COLORS.primary}; color: ${BRAND_COLORS.background}; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function renderTemplate(template: EmailTemplate, data: EmailTemplateData): { html: string; text: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mejoy.com.br';
  const firstName = data.firstName || data.name?.split(' ')[0] || 'Cliente';

  let html = '';
  let text = '';

  switch (template) {
    case 'triage-completed':
      html = getBaseTemplate(`
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.secondary}; font-size: 24px;">
          Olá, ${firstName}! 👋
        </h2>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Recebemos suas respostas da triagem! Estamos analisando suas informações com inteligência artificial para criar seu relatório personalizado.
        </p>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Em breve você receberá um email com seu relatório completo e recomendações personalizadas.
        </p>
        ${data.reportUrl ? getButtonStyle(data.reportUrl, 'Ver meu relatório') : ''}
        <p style="margin: 30px 0 0 0; font-size: 14px; color: ${BRAND_COLORS.textLight};">
          <strong>Próximos passos:</strong><br>
          • Aguarde o processamento (alguns minutos)<br>
          • Receba seu relatório por email<br>
          • Compartilhe com seu médico se necessário
        </p>
      `, data);
      text = `Olá ${firstName}!\n\nRecebemos suas respostas da triagem. Estamos analisando suas informações e em breve você receberá seu relatório personalizado.\n\n${data.reportUrl || ''}`;
      break;

    case 'report-ready':
      html = getBaseTemplate(`
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.secondary}; font-size: 24px;">
          Seu relatório está pronto! 📄
        </h2>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Olá, ${firstName}!
        </p>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Seu relatório personalizado está pronto. Analisamos suas respostas e preparamos recomendações específicas para você.
        </p>
        ${data.reportUrl ? getButtonStyle(data.reportUrl, 'Ver relatório completo') : ''}
        <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid ${BRAND_COLORS.primary}; border-radius: 4px;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: ${BRAND_COLORS.text}; font-weight: 600;">
            💡 Dica importante:
          </p>
          <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.textLight};">
            Você pode imprimir este relatório e levar ao seu médico. As informações são de caráter educativo e não substituem uma consulta médica.
          </p>
        </div>
      `, data);
      text = `Olá ${firstName}!\n\nSeu relatório personalizado está pronto. Acesse: ${data.reportUrl || ''}`;
      break;

    case 'payment-confirmed':
      html = getBaseTemplate(`
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.secondary}; font-size: 24px;">
          Pagamento confirmado! ✅
        </h2>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Olá, ${firstName}!
        </p>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Seu pagamento foi confirmado com sucesso! Bem-vindo(a) à MeJoy.
        </p>
        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 6px;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: ${BRAND_COLORS.text};">
            <strong>Detalhes do pedido:</strong>
          </p>
          <p style="margin: 5px 0; font-size: 14px; color: ${BRAND_COLORS.textLight};">
            Produto: ${data.productName || 'Acesso MeJoy'}<br>
            Valor: R$ ${data.amount?.toFixed(2) || '0,00'}<br>
            ${data.orderId ? `Pedido: ${data.orderId}<br>` : ''}
            ${data.paymentMethod ? `Método: ${data.paymentMethod}` : ''}
          </p>
        </div>
        ${getButtonStyle(`${siteUrl}/dashboard`, 'Acessar minha conta')}
        <p style="margin: 30px 0 0 0; font-size: 14px; color: ${BRAND_COLORS.textLight};">
          Em instantes você receberá seu acesso e orientações personalizadas. Qualquer dúvida, estamos à disposição!
        </p>
      `, data);
      text = `Olá ${firstName}!\n\nPagamento confirmado! Bem-vindo(a) à MeJoy.\n\nProduto: ${data.productName || 'Acesso MeJoy'}\nValor: R$ ${data.amount?.toFixed(2) || '0,00'}\n\nAcesse: ${siteUrl}/dashboard`;
      break;

    case 'welcome':
      html = getBaseTemplate(`
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.secondary}; font-size: 24px;">
          Bem-vindo(a) à MeJoy! 🎉
        </h2>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Olá, ${firstName}!
        </p>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Estamos muito felizes em tê-lo(a) conosco! A MeJoy utiliza inteligência artificial para oferecer análises personalizadas de saúde.
        </p>
        <div style="margin: 20px 0;">
          <p style="margin: 0 0 10px 0; font-size: 16px; color: ${BRAND_COLORS.text}; font-weight: 600;">
            O que você pode fazer:
          </p>
          <ul style="margin: 0; padding-left: 20px; color: ${BRAND_COLORS.textLight}; font-size: 14px;">
            <li>Realizar triagens personalizadas</li>
            <li>Receber relatórios detalhados</li>
            <li>Acompanhar sua saúde</li>
            <li>Compartilhar resultados com seu médico</li>
          </ul>
        </div>
        ${getButtonStyle(`${siteUrl}/dashboard`, 'Começar agora')}
      `, data);
      text = `Bem-vindo(a) à MeJoy, ${firstName}!\n\nEstamos felizes em tê-lo(a) conosco. Acesse: ${siteUrl}/dashboard`;
      break;

    case 'gift-received':
      html = getBaseTemplate(`
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.secondary}; font-size: 24px;">
          Você recebeu um presente! 🎁
        </h2>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Olá, ${firstName}!
        </p>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Alguém especial presenteou você com acesso à MeJoy!
        </p>
        ${data.giftMessage ? `
          <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 6px; border-left: 4px solid ${BRAND_COLORS.primary};">
            <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.text}; font-style: italic;">
              "${data.giftMessage}"
            </p>
          </div>
        ` : ''}
        ${data.giftCode ? `
          <p style="margin: 20px 0; font-size: 14px; color: ${BRAND_COLORS.text};">
            <strong>Código do presente:</strong> <code style="background-color: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${data.giftCode}</code>
          </p>
        ` : ''}
        ${getButtonStyle(`${siteUrl}/redeem?code=${data.giftCode || ''}`, 'Resgatar presente')}
      `, data);
      text = `Olá ${firstName}!\n\nVocê recebeu um presente da MeJoy!\n\n${data.giftCode ? `Código: ${data.giftCode}\n` : ''}Resgatar: ${siteUrl}/redeem?code=${data.giftCode || ''}`;
      break;

    case 'follow-up-d1':
      html = getBaseTemplate(`
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.secondary}; font-size: 24px;">
          3 passos práticos para hoje
        </h2>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Olá, ${firstName}!
        </p>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Selecionamos três ações simples para você começar agora, baseadas no seu relatório:
        </p>
        <div style="margin: 20px 0;">
          <div style="margin-bottom: 15px; padding: 15px; background-color: #f9f9f9; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.text};">
              <strong>🌙 Sono:</strong> ${data.tipSono || 'Mantenha uma rotina regular de sono'}
            </p>
          </div>
          <div style="margin-bottom: 15px; padding: 15px; background-color: #f9f9f9; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.text};">
              <strong>🥗 Nutrição:</strong> ${data.tipNutricao || 'Priorize alimentos naturais e hidratação'}
            </p>
          </div>
          <div style="margin-bottom: 15px; padding: 15px; background-color: #f9f9f9; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.text};">
              <strong>🏃 Rotina:</strong> ${data.tipRotina || 'Inclua atividade física na sua rotina'}
            </p>
          </div>
        </div>
        ${getButtonStyle(`${siteUrl}/dashboard`, 'Ver meu relatório completo')}
      `, data);
      text = `Olá ${firstName}!\n\n3 passos práticos para hoje:\n\n🌙 Sono: ${data.tipSono || 'Mantenha uma rotina regular'}\n🥗 Nutrição: ${data.tipNutricao || 'Priorize alimentos naturais'}\n🏃 Rotina: ${data.tipRotina || 'Inclua atividade física'}\n\nAcesse: ${siteUrl}/dashboard`;
      break;

    case 'follow-up-d3':
      html = getBaseTemplate(`
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.secondary}; font-size: 24px;">
          Desbloqueie todas as triagens por R$ 49
        </h2>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Olá, ${firstName}!
        </p>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Amplie sua visão com acesso total por 30 dias.
        </p>
        <div style="margin: 20px 0; padding: 20px; background-color: #f0fdf4; border-radius: 6px; border: 2px solid ${BRAND_COLORS.primary};">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: ${BRAND_COLORS.text}; font-weight: 600;">
            ✅ O que está incluído:
          </p>
          <ul style="margin: 10px 0 0 0; padding-left: 20px; color: ${BRAND_COLORS.textLight}; font-size: 14px;">
            <li>Todas as triagens liberadas</li>
            <li>Relatórios completos e imprimíveis</li>
            <li>Suporte por e-mail</li>
            <li>Sem renovação automática</li>
          </ul>
          <p style="margin: 15px 0 0 0; font-size: 14px; color: ${BRAND_COLORS.text};">
            <strong>Garantia:</strong> 7 dias para reembolso
          </p>
        </div>
        ${getButtonStyle(`${siteUrl}/pricing`, 'Ativar meu passe de 30 dias')}
      `, data);
      text = `Olá ${firstName}!\n\nDesbloqueie todas as triagens por R$ 49.\n\nAcesso total por 30 dias - sem renovação automática.\n\nGarantia de 7 dias.\n\nAcesse: ${siteUrl}/pricing`;
      break;

    case 'follow-up-d7':
      html = getBaseTemplate(`
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.secondary}; font-size: 24px;">
          Um presente útil de verdade 🎁
        </h2>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Olá, ${firstName}!
        </p>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Surpreenda alguém especial com 30 dias de MeJoy.
        </p>
        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 6px;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: ${BRAND_COLORS.text}; font-weight: 600;">
            🎁 O que está incluído:
          </p>
          <ul style="margin: 10px 0 0 0; padding-left: 20px; color: ${BRAND_COLORS.textLight}; font-size: 14px;">
            <li>Entrega por e-mail/WhatsApp</li>
            <li>Mensagem personalizada</li>
            <li>Resgate em 1 clique</li>
            <li>Válido por 6 meses</li>
          </ul>
        </div>
        <p style="margin: 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Um presente que cuida da saúde de quem você ama.
        </p>
        ${getButtonStyle(`${siteUrl}/presente`, 'Presentear acesso • R$ 89')}
      `, data);
      text = `Olá ${firstName}!\n\nSurpreenda alguém com 30 dias de MeJoy por R$ 89.\n\nUm presente útil de verdade!\n\nAcesse: ${siteUrl}/presente`;
      break;

    case 'store-v2-order-confirmed': {
      const orderUrl = data.orderUrl || `${siteUrl}/pedidos/${data.orderId || ''}`;
      const itemsList = Array.isArray(data.items) ? data.items.map((i: any) =>
        `• ${i.name} × ${i.quantity} — R$ ${((i.priceCents * i.quantity) / 100).toFixed(2)}`
      ).join('<br>') : '';
      const totalBrl = data.totalCents ? (data.totalCents / 100).toFixed(2) : '0,00';
      const shipBrl = data.shippingCents ? (data.shippingCents / 100).toFixed(2) : '0,00';
      html = getBaseTemplate(`
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.secondary}; font-size: 24px;">
          Compra confirmada! ✅
        </h2>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Olá, ${firstName}!
        </p>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Seu pedido #${(data.orderNumber || data.orderId || '').toString().slice(-8).toUpperCase()} foi confirmado. Em breve iniciaremos a manipulação e envio.
        </p>
        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 6px;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: ${BRAND_COLORS.text}; font-weight: 600;">Resumo do pedido:</p>
          <p style="margin: 5px 0; font-size: 14px; color: ${BRAND_COLORS.textLight}; line-height: 1.6;">
            ${itemsList || 'Itens do pedido'}<br>
            Frete: R$ ${shipBrl}<br>
            <strong>Total: R$ ${totalBrl}</strong>
          </p>
          ${data.shippingDays ? `<p style="margin: 10px 0 0 0; font-size: 14px;">Previsão de entrega: até ${data.shippingDays} dias úteis.</p>` : ''}
        </div>
        ${getButtonStyle(orderUrl, 'Ver detalhes do pedido')}
        <p style="margin: 30px 0 0 0; font-size: 14px; color: ${BRAND_COLORS.textLight};">
          Dúvidas? Estamos à disposição no WhatsApp.
        </p>
      `, data);
      text = `Olá ${firstName}!\n\nCompra confirmada! Pedido #${(data.orderNumber || data.orderId || '').toString().slice(-8).toUpperCase()}\n\nTotal: R$ ${totalBrl}\n\nVer detalhes: ${orderUrl}`;
      break;
    }

    case 'store-v2-order-shipped': {
      const orderUrl2 = data.orderUrl || `${siteUrl}/pedidos/${data.orderId || ''}`;
      const trackUrl = data.trackingUrl || orderUrl2;
      html = getBaseTemplate(`
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.secondary}; font-size: 24px;">
          Seu pedido foi enviado! 🚚
        </h2>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Olá, ${firstName}!
        </p>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          O pedido #${(data.orderId || '').toString().slice(-8).toUpperCase()} foi enviado e está a caminho.
        </p>
        ${data.trackingCode ? `<p style="margin: 0 0 10px 0; font-size: 14px;">Código de rastreio: <strong>${data.trackingCode}</strong></p>` : ''}
        ${getButtonStyle(trackUrl, 'Rastrear entrega')}
      `, data);
      text = `Olá ${firstName}!\n\nPedido #${(data.orderId || '').toString().slice(-8).toUpperCase()} enviado!\n\nRastrear: ${trackUrl}`;
      break;
    }

    case 'store-v2-order-delivered': {
      const orderUrl3 = data.orderUrl || `${siteUrl}/pedidos/${data.orderId || ''}`;
      html = getBaseTemplate(`
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.secondary}; font-size: 24px;">
          Pedido entregue! 🏠
        </h2>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Olá, ${firstName}!
        </p>
        <p style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          O pedido #${(data.orderId || '').toString().slice(-8).toUpperCase()} foi entregue. Esperamos que aproveite!
        </p>
        ${getButtonStyle(orderUrl3, 'Ver detalhes do pedido')}
      `, data);
      text = `Olá ${firstName}!\n\nPedido #${(data.orderId || '').toString().slice(-8).toUpperCase()} entregue!`;
      break;
    }

    default:
      html = getBaseTemplate(`
        <p style="margin: 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Olá, ${firstName}!
        </p>
        <p style="margin: 20px 0; color: ${BRAND_COLORS.text}; font-size: 16px;">
          Este é um email da MeJoy.
        </p>
      `, data);
      text = `Olá ${firstName}!\n\nEste é um email da MeJoy.`;
  }

  return { html, text };
}
