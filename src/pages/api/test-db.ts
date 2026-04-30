import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Teste 1: Verificar conexão Prisma
    await getPrisma().$executeRaw`SELECT 1`;
    
    // Teste 2: Tentar criar um draft temporário
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const tmp = await getPrisma().brandingDraft.create({
      data: {
        fantasyName: 'HealthCheck',
        brandColor: '#10b981',
        accentColor: '#059669',
        ctaText: 'Test',
        ctaUrl: 'https://wa.me/123',
        expiresAt,
      },
    });

    // Cleanup best-effort
    await getPrisma().brandingDraft.delete({ where: { id: tmp.id } }).catch(() => {});

    return res.status(200).json({ 
      ok: true, 
      via: 'prisma',
      message: 'Prisma connection and write working'
    });
  } catch (e: any) {
    const msg = String(e?.message || e);
    
    // Fallback via Supabase PostgREST se erro "Tenant or user not found"
    if (msg.includes('Tenant or user not found')) {
      console.log('[test-db] Tentando fallback via Supabase PostgREST...');
      
      try {
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
        
        const { data, error } = await supabaseAdmin
          .from('BrandingDraft')
          .insert([{
            id: randomUUID(),
            fantasyName: 'HealthCheckFallback',
            brandColor: '#10b981',
            accentColor: '#059669',
            ctaText: 'Test',
            ctaUrl: 'https://wa.me/123',
            expiresAt: expiresAt.toISOString(),
          }])
          .select()
          .single();

        if (error) {
          console.error('[test-db] Fallback error:', error);
          return res.status(500).json({ 
            ok: false,
            error: 'Both Prisma and fallback failed',
            prismaError: msg,
            fallbackError: error.message
          });
        }

        // Cleanup best-effort
        if (data?.id) {
          try {
            await supabaseAdmin
              .from('BrandingDraft')
              .delete()
              .eq('id', data.id);
          } catch {
            // Ignore cleanup errors
          }
        }

        return res.status(200).json({ 
          ok: true,
          via: 'supabase-fallback',
          message: 'Fallback via Supabase PostgREST working'
        });
      } catch (fallbackError: any) {
        console.error('[test-db] Fallback também falhou:', fallbackError);
        return res.status(500).json({ 
          ok: false,
          error: 'Both Prisma and fallback failed',
          prismaError: msg,
          fallbackError: fallbackError?.message
        });
      }
    }

    // Outros erros
    console.error('[test-db] Erro completo:', e);
    return res.status(500).json({ 
      ok: false,
      error: 'Erro ao testar banco',
      message: msg,
      code: e?.code,
      meta: e?.meta,
    });
  }
}
