import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/log';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar token de segurança
  const token = req.headers['x-cron-token'] || req.headers['authorization']?.replace('Bearer ', '');
  const expectedToken = process.env.CLEANUP_CRON_TOKEN;

  if (!expectedToken || token !== expectedToken) {
    logger.warn({ ip: req.headers['x-forwarded-for'] }, 'cleanup_unauthorized');
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  try {
    const prisma = getPrisma();
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 horas atrás

    // 1) Deletar drafts antigos (>48h)
    const oldDrafts = await prisma.brandingDraft.findMany({
      where: {
        OR: [
          { createdAt: { lt: cutoff } },
          { expiresAt: { lt: new Date() } }
        ]
      },
      select: { id: true, logoUrl: true },
    });

    const deletedDrafts = await prisma.brandingDraft.deleteMany({
      where: {
        OR: [
          { createdAt: { lt: cutoff } },
          { expiresAt: { lt: new Date() } }
        ]
      },
    });

    // 2) Deletar tenants pendentes antigos (>48h sem pagamento)
    const oldTenants = await prisma.tenant.findMany({
      where: {
        status: 'pending',
        createdAt: { lt: cutoff },
      },
      select: { id: true, slug: true, provisionalUrl: true, logoUrl: true },
    });

    const deletedTenants = await prisma.tenant.deleteMany({
      where: {
        status: 'pending',
        createdAt: { lt: cutoff },
      },
    });

    // 3) Limpar logos órfãs do Supabase Storage
    let deletedLogos = 0;
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const toDelete: string[] = [];

        // Extrair paths dos logos dos drafts
        for (const draft of oldDrafts) {
          if (draft.logoUrl) {
            const match = draft.logoUrl.match(/\/storage\/v1\/object\/public\/(.+)$/);
            if (match && match[1].startsWith('branding-drafts/')) {
              toDelete.push(match[1]);
            }
          }
        }

        // Extrair paths dos logos dos tenants pendentes
        for (const tenant of oldTenants) {
          if (tenant.logoUrl) {
            const match = tenant.logoUrl.match(/\/storage\/v1\/object\/public\/(.+)$/);
            if (match && match[1].startsWith('branding-drafts/')) {
              toDelete.push(match[1]);
            }
          }
        }

        // Remover arquivos duplicados
        const uniquePaths = [...new Set(toDelete)];

        if (uniquePaths.length > 0) {
          const { error: deleteError } = await supabase.storage
            .from('public')
            .remove(uniquePaths);

          if (!deleteError) {
            deletedLogos = uniquePaths.length;
          } else {
            logger.error({ error: deleteError }, 'cleanup_storage_error');
          }
        }
      }
    } catch (storageError: any) {
      logger.error({ error: storageError?.message }, 'cleanup_storage_exception');
      // Não falhar o cleanup se storage falhar
    }

    logger.info({
      deletedDrafts: deletedDrafts.count,
      deletedTenants: deletedTenants.count,
      deletedLogos,
    }, 'cleanup_completed');

    return res.status(200).json({
      ok: true,
      removedDrafts: deletedDrafts.count,
      removedTenants: deletedTenants.count,
      removedLogos: deletedLogos,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error({ error: error?.message }, 'cleanup_error');
    return res.status(500).json({
      ok: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

