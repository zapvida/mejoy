// src/pages/api/privacy/export-data.ts
// API para exportação de dados (LGPD)

import { NextApiRequest, NextApiResponse } from 'next';

import { exportUserData } from '@/lib/privacy';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ 
      error: 'ID do usuário é obrigatório' 
    });
  }

  try {
    const userData = await exportUserData(userId);

    if (!userData) {
      return res.status(404).json({ 
        error: 'Usuário não encontrado' 
      });
    }

    // Definir headers para download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="zapfarm-data-${userId}.json"`);

    return res.status(200).json(userData);
  } catch (error) {
    console.error('Erro ao exportar dados do usuário:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
}
