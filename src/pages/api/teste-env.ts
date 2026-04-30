import type { NextApiRequest, NextApiResponse } from 'next';

function parseConnectionString(url: string) {
  try {
    const urlObj = new URL(url);
    const user = urlObj.username ? urlObj.username.replace(/.(?=.{4})/g, '•') : '';
    return {
      host: urlObj.hostname,
      port: urlObj.port || '5432',
      db: urlObj.pathname.replace('/', '') || 'postgres',
      user,
    };
  } catch {
    return null;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = process.env.DATABASE_URL || '';
  const du = process.env.DIRECT_URL || '';
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  res.status(200).json({
    NODE_ENV: process.env.NODE_ENV,
    hasServiceRole,
    hasSupabaseUrl: Boolean(supabaseUrl),
    supabaseUrl: supabaseUrl ? supabaseUrl.replace(/https?:\/\//, '').split('/')[0] : null,
    DATABASE_URL: db ? parseConnectionString(db) : null,
    DIRECT_URL: du ? parseConnectionString(du) : null,
    hasBrandingBucket: Boolean(process.env.BRANDING_BUCKET),
  });
}
