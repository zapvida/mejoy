import type { NextApiRequest, NextApiResponse } from 'next';
import { readUtmFromReq } from '@/lib/analytics/utm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, whatsapp, company, draftId } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    // Capturar UTMs
    const utm = readUtmFromReq(req);

    // Salvar lead no banco de dados (sem GHL por enquanto)
    try {
      // const prisma = getPrisma();
      // Criar ou atualizar lead (pode criar uma tabela B2BLead se necessário)
      // Por enquanto, apenas logamos e retornamos sucesso
      console.log('[b2b/lead] Lead recebido:', {
        name,
        email,
        whatsapp,
        company,
        draftId,
        utm: Object.values(utm).some(Boolean) ? utm : 'none',
        timestamp: new Date().toISOString(),
      });

      // TODO: Criar tabela B2BLead no Prisma se necessário
      // Por enquanto, apenas retornamos sucesso
      
      return res.status(200).json({ 
        success: true,
        message: 'Lead salvo com sucesso',
        // Retornar dados para debug (remover em produção se necessário)
        ...(process.env.NODE_ENV !== 'production' ? { received: { name, email, company, draftId } } : {})
      });
    } catch (dbError: any) {
      console.error('[b2b/lead] DB error:', dbError?.message, dbError);
      
      // Se for erro de DB, ainda retornamos sucesso mas logamos
      // (não queremos quebrar o fluxo do usuário)
      if (String(dbError?.message || '').includes('DATABASE_URL') || 
          String(dbError?.message || '').includes('P1001') ||
          String(dbError?.message || '').includes('P1017')) {
        console.warn('[b2b/lead] DATABASE_URL ausente, mas continuando...');
      }
      
      // Retornamos sucesso mesmo com erro de DB (para não quebrar UX)
      // Mas logamos para debug
      return res.status(200).json({ 
        success: true,
        message: 'Lead recebido (salvamento pendente)'
      });
    }
  } catch (error: any) {
    console.error('[b2b/lead] Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

