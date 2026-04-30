import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

export const config = {
  api: {
    bodyParser: {
      // ✅ permite base64 de até ~6MB; se quiser maior, aumente aqui
      sizeLimit: '6mb',
    },
  },
};

// ✅ Fallback seguro: SUPABASE_URL (server) ou NEXT_PUBLIC_SUPABASE_URL (client)
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = process.env.BRANDING_BUCKET || 'branding-logos';

function getAdmin() {
  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL deve estar configurada');
  }
  if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY deve estar configurada');
  }
  return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
}

async function ensureBucket() {
  const supa = getAdmin();
  try {
    const { data: buckets, error } = await supa.storage.listBuckets();
    if (error) {
      console.error('[upload-logo] listBuckets error:', error);
      return; // Continua mesmo se falhar
    }
    
    const exists = (buckets ?? []).some((b: any) => b.name === BUCKET_NAME);
    if (!exists) {
      const { error: createError } = await supa.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'],
        fileSizeLimit: 5242880, // 5MB
      });
      if (createError && !createError.message.includes('already exists')) {
        console.error('[upload-logo] Bucket creation error:', createError);
      }
    }
  } catch (err) {
    console.error('[upload-logo] ensureBucket error:', err);
    // Continua mesmo se falhar - pode já existir
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ✅ Validação de variáveis de ambiente
    if (!supabaseUrl) {
      return res.status(500).json({ 
        error: 'Configuração inválida',
        details: 'SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL deve estar configurada no .env.local'
      });
    }
    if (!supabaseKey) {
      return res.status(500).json({ 
        error: 'Configuração inválida',
        details: 'SUPABASE_SERVICE_ROLE_KEY deve estar configurada no .env.local'
      });
    }

    await ensureBucket();
    const supa = getAdmin();

    // ✅ aceita { base64 } ou { url }
    const body = req.body ?? {};
    
    if (!body.base64 && !body.url) {
      return res.status(400).json({ error: 'Missing base64 or url' });
    }

    if (body.url) {
      return res.status(200).json({ url: body.url });
    }

    // ✅ Validação melhorada de base64
    const match = String(body.base64).match(/^data:image\/(\w+);base64,(.*)$/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid base64 format' });
    }

    const ext = match[1].toLowerCase();
    const bin = Buffer.from(match[2], 'base64');

    // ✅ Validar tamanho (máx 5MB)
    if (bin.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large (max 5MB)' });
    }

    const filePath = `logos/${Date.now()}-${randomUUID()}.${ext}`;

    const { error } = await supa.storage.from(BUCKET_NAME).upload(filePath, bin, {
      contentType: `image/${ext}`,
      upsert: true,
    });

    if (error) {
      console.error('[upload-logo] Supabase error:', error);
      return res.status(500).json({ error: 'Upload failed', details: error.message });
    }

    const { data } = supa.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return res.status(200).json({ url: data.publicUrl, path: filePath });
  } catch (e: any) {
    console.error('[upload-logo] Error:', e);
    return res.status(500).json({ error: 'Internal server error', details: e.message });
  }
}
