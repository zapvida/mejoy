import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { domain } = req.body;

    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ error: 'Domain is required' });
    }

    // Verificar CNAME (simplificado - em produção usar serviço de DNS)
    // Por enquanto, retornar instruções
    const cnameValue = 'cname.vercel-dns.com'; // Ajustar conforme necessário

    return res.status(200).json({
      configured: false, // Sempre pendente até implementar verificação real
      cnameValue,
      message: `Configure o CNAME apontando para ${cnameValue} no seu DNS.`,
    });
  } catch (error: any) {
    console.error('[check-domain] Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

