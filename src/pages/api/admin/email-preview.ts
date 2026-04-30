import type { NextApiRequest, NextApiResponse } from 'next';
import { renderTemplate } from '@/lib/email/templates';
import type { EmailTemplate } from '@/lib/email/types';

/**
 * Endpoint de preview de emails para validação
 * 
 * Uso: GET /api/admin/email-preview?template=triage-completed&name=João Silva
 * 
 * Templates disponíveis:
 * - triage-completed
 * - report-ready
 * - payment-confirmed
 * - welcome
 * - gift-received
 * - follow-up-d1
 * - follow-up-d3
 * - follow-up-d7
 */

const TEMPLATES: EmailTemplate[] = [
  'triage-completed',
  'report-ready',
  'payment-confirmed',
  'welcome',
  'gift-received',
  'follow-up-d1',
  'follow-up-d3',
  'follow-up-d7',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Em produção, adicionar autenticação/admin aqui
  if (process.env.NODE_ENV === 'production' && !req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { template, ...queryData } = req.query;

  if (!template || typeof template !== 'string') {
    return res.status(400).json({
      error: 'Template parameter is required',
      availableTemplates: TEMPLATES,
    });
  }

  if (!TEMPLATES.includes(template as EmailTemplate)) {
    return res.status(400).json({
      error: 'Invalid template',
      availableTemplates: TEMPLATES,
    });
  }

  try {
    // Preparar dados de exemplo
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zapfarm.com.br';
    const defaultData: Record<string, any> = {
      name: queryData.name as string || 'João Silva',
      firstName: queryData.firstName as string || 'João',
      email: queryData.email as string || 'joao@exemplo.com',
      reportUrl: queryData.reportUrl as string || `${siteUrl}/dashboard`,
      triageType: queryData.triageType as string || 'gastro',
      productName: queryData.productName as string || 'Plano Plus - Mensal',
      amount: queryData.amount ? parseFloat(queryData.amount as string) : 99.9,
      orderId: queryData.orderId as string || 'ord_123456',
      paymentMethod: queryData.paymentMethod as string || 'Cartão de crédito',
      giftCode: queryData.giftCode as string || 'GIFT-ABC123',
      giftMessage: queryData.giftMessage as string || 'Um presente especial para você!',
      tipSono: queryData.tipSono as string || 'Durma pelo menos 7-8 horas por noite',
      tipNutricao: queryData.tipNutricao as string || 'Beba 2 litros de água por dia',
      tipRotina: queryData.tipRotina as string || 'Faça 30 minutos de exercício diário',
    };

    // Renderizar template
    const { html, text } = renderTemplate(template as EmailTemplate, defaultData);

    // Retornar HTML para preview
    if (req.query.format === 'html') {
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    }

    if (req.query.format === 'text') {
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(text);
    }

    // Retornar JSON com ambos
    return res.status(200).json({
      template,
      html,
      text,
      data: defaultData,
    });
  } catch (error: any) {
    console.error('[email-preview] Erro:', error);
    return res.status(500).json({
      error: 'Failed to render template',
      message: error.message,
    });
  }
}

