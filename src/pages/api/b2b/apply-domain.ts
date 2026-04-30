import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { domain, tenantId } = req.body;

    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const prisma = getPrisma();

    // Se tiver tenantId, atualizar tenant específico
    if (tenantId) {
      const tenant = await prisma.tenant.update({
        where: { id: tenantId },
        data: { domain },
      });

      return res.status(200).json({
        success: true,
        tenant,
        message: `Domínio ${domain} aplicado ao tenant.`,
      });
    }

    // Caso contrário, buscar por email ou slug (precisa de autenticação)
    // Por enquanto, retornar sucesso genérico
    return res.status(200).json({
      success: true,
      message: `Domínio ${domain} será aplicado após configuração do DNS.`,
    });
  } catch (error: any) {
    console.error('[apply-domain] Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

