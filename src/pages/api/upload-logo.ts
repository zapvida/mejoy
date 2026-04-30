// src/pages/api/upload-logo.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export const config = {
  api: {
    bodyParser: false, // necessário para FormData
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = await getToken({ req });
    const uid = token?.sub;

    if (!uid) return res.status(401).json({ error: 'Não autorizado' });

    // Por enquanto, retornar erro pois não temos multer configurado
    // TODO: Implementar upload para Supabase Storage
    return res.status(501).json({ error: 'Upload de logo temporariamente desabilitado' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro inesperado no servidor' });
  }
}