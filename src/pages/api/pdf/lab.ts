// src/pages/api/pdf/lab.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const qs = req.url?.split('?')[1];
  const location = `/api/pdf/report${qs ? `?${qs}` : ''}`;
  res.setHeader('Location', location);
  return res.status(308).end();
}
