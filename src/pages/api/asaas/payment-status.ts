import { NextApiRequest, NextApiResponse } from 'next';
import { asaasClient } from '@/lib/asaas/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      status: 'error',
      code: 'METHOD_NOT_ALLOWED',
      message: 'Método não permitido' 
    });
  }

  const { paymentId } = req.query;

  if (!paymentId || typeof paymentId !== 'string') {
    return res.status(400).json({ 
      status: 'error',
      code: 'MISSING_PAYMENT_ID',
      message: 'ID do pagamento é obrigatório' 
    });
  }

  // Validar API Key do Asaas
  if (!process.env.ASAAS_API_KEY) {
    console.error('[asaas-payment-status] ASAAS_API_KEY não configurada');
    return res.status(500).json({ 
      status: 'error',
      code: 'ASAAS_NOT_CONFIGURED',
      message: 'Sistema de pagamento não configurado' 
    });
  }

  try {
    const payment = await asaasClient.getPayment(paymentId);

    return res.status(200).json({ 
      status: 'success',
      paymentStatus: payment.status,
      payment: {
        id: payment.id,
        status: payment.status,
        value: payment.value,
        billingType: payment.billingType,
        paymentDate: payment.paymentDate,
        dueDate: payment.dueDate,
      }
    });
  } catch (error: any) {
    console.error('[asaas-payment-status] Erro ao buscar status do pagamento:', error);
    
    // Tratar erros específicos do Asaas
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        status: 'error',
        code: 'PAYMENT_NOT_FOUND',
        message: 'Pagamento não encontrado' 
      });
    }
    
    return res.status(500).json({ 
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: 'Erro ao buscar status do pagamento. Tente novamente em alguns instantes.' 
    });
  }
}
