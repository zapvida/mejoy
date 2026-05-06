import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

function isMissingSubscriptionStorage(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const code = 'code' in error ? String(error.code) : '';
  const message = error instanceof Error ? error.message : String(error);

  return (
    code === 'P2021' ||
    message.includes('Subscription') && (
      message.includes('does not exist') ||
      message.includes('does not exist in the current database') ||
      message.includes('relation')
    )
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!prisma) {
      // Para desenvolvimento local, retornar acesso mock
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Prisma não configurado. Usando modo mock para desenvolvimento.');
        return res.status(200).json({ 
          hasAccess: true, // Permitir acesso em desenvolvimento
          message: 'Modo desenvolvimento - acesso liberado'
        });
      }
      
      return res.status(503).json({ error: "Database not available" });
    }

    // Para simplificar, vamos verificar se existe alguma subscription ativa
    // Em produção, você deveria verificar o userId do usuário logado
    let activeSubscription = null;

    try {
      activeSubscription = await prisma.subscription.findFirst({
        where: {
          status: 'active',
          activeUntil: { gt: new Date() }
        }
      });
    } catch (error) {
      if (isMissingSubscriptionStorage(error)) {
        console.warn('Subscription storage indisponivel. Retornando acesso gratuito por fallback.');
        return res.status(200).json({
          hasAccess: false,
          message: 'Sem acesso pago'
        });
      }

      throw error;
    }

    const hasAccess = !!activeSubscription;

    return res.status(200).json({ 
      hasAccess,
      message: hasAccess ? 'Acesso ativo' : 'Sem acesso pago'
    });

  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return res.status(500).json({ 
      hasAccess: false,
      error: 'Erro interno do servidor' 
    });
  }
}
