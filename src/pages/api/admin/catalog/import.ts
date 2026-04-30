/**
 * Admin-only: import CSV para catálogo Store V2
 * Protegido por ADMIN_SECRET_KEY
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { importCatalogFromCSV } from '@/lib/catalog/import-csv';
import { prisma } from '@/lib/prisma';
import { storeLogger } from '@/lib/store-v2/logger';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'admin-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = req.headers.authorization || req.query.secret;
  const secret = typeof auth === 'string' ? auth.replace(/^Bearer\s+/i, '') : req.body?.secret;
  if (secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const csvPath = path.join(process.cwd(), 'data', 'catalogo_master_mejoy_seed_200.csv');

  try {
    const result = await importCatalogFromCSV(csvPath, prisma);
    storeLogger.catalog('Import completed', {
      created: result.created,
      updated: result.updated,
      errors: result.errors.length,
      total: result.total,
    });
    return res.status(200).json({
      ok: true,
      created: result.created,
      updated: result.updated,
      total: result.total,
      errors: result.errors,
    });
  } catch (err) {
    storeLogger.error('Import failed', err);
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
