import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

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
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        status: 'active',
        activeUntil: { gt: new Date() }
      }
    });

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
