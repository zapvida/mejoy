import type { NextApiRequest, NextApiResponse } from 'next';
import { calculateShippingAsync } from '@/lib/store-v2/shipping';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cep, subtotalCents } = req.body as { cep?: string; subtotalCents?: number };
  if (!cep || typeof subtotalCents !== 'number' || subtotalCents < 0) {
    return res.status(400).json({
      error: 'cep e subtotalCents são obrigatórios',
    });
  }

  try {
    const result = await calculateShippingAsync(cep, subtotalCents);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Erro ao calcular frete',
    });
  }
}
