import type { NextApiRequest, NextApiResponse } from 'next';

import { methodNotAllowed } from '@/lib/mobile/http';
import { analyzeMeal } from '@/lib/mobile/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  try {
    const response = await analyzeMeal(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Erro ao analisar refeição',
    });
  }
}
