// src/pages/api/privacy/delete-data.ts
// API para exclusão de dados (LGPD)

import { NextApiRequest, NextApiResponse } from 'next';

import { deleteUserData, canDeleteUserData, sendDeletionConfirmationEmail } from '@/lib/privacy';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { userId, email, confirmDeletion } = req.body;

  if (!userId) {
    return res.status(400).json({ 
      error: 'ID do usuário é obrigatório' 
    });
  }

  try {
    // Verificar se usuário pode excluir dados
    const canDelete = await canDeleteUserData(userId);
    
    if (!canDelete) {
      return res.status(400).json({ 
        error: 'Não é possível excluir dados. Usuário possui assinaturas ativas ou presentes não resgatados.',
        canDelete: false
      });
    }

    // Se não confirmou a exclusão, retornar aviso
    if (!confirmDeletion) {
      return res.status(200).json({ 
        message: 'Confirmação necessária. Esta ação é irreversível.',
        canDelete: true,
        requiresConfirmation: true
      });
    }

    // Executar exclusão/anonimização
    const success = await deleteUserData(userId);

    if (success) {
      // Enviar email de confirmação
      if (email) {
        await sendDeletionConfirmationEmail(userId, email);
      }

      return res.status(200).json({ 
        success: true,
        message: 'Dados excluídos/anonimizados com sucesso. Email de confirmação enviado.'
      });
    } else {
      return res.status(404).json({ 
        error: 'Usuário não encontrado' 
      });
    }
  } catch (error) {
    console.error('Erro ao excluir dados do usuário:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
}
