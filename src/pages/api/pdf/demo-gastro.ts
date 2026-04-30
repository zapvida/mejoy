import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Adapter: redirecionar para endpoint canônico com demo=1
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Preservar query parameters
  const queryParams = new URLSearchParams();
  queryParams.set('demo', '1');
  
  // Preservar outros parâmetros se existirem
  Object.entries(req.query).forEach(([key, value]) => {
    if (value) {
      queryParams.set(key, String(value));
    }
  });

  const redirectUrl = `${baseUrl}/api/pdf/report?${queryParams.toString()}`;
  
  // Redirecionar com 307 (Temporary Redirect) para preservar método HTTP
  res.redirect(307, redirectUrl);
}