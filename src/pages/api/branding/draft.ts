import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrisma } from '@/lib/prisma';
import { z } from 'zod';
import { withRateLimit } from '@/pages/api/_utils/withRateLimit';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';

const DraftSchema = z.object({
  fantasyName: z.string().min(1, 'fantasyName obrigatório').optional(),
  brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'brandColor deve ser hex válido (ex: #10b981)').optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'accentColor deve ser hex válido').optional().or(z.literal('')),
  logoUrl: z.string().url('logoUrl deve ser URL válida').optional().or(z.literal('')),
  ctaText: z.string().optional(),
  ctaUrl: z.string().url('ctaUrl deve ser URL válida').optional(),
  whatsapp: z.string().optional(),
  desiredDomain: z.string().optional(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing draft id' });
      }

      try {
        const prisma = getPrisma();
        const draft = await prisma.brandingDraft.findUnique({ where: { id } });

        if (!draft) {
          return res.status(404).json({ error: 'Draft not found' });
        }

        // Verificar se expirou
        if (new Date() > draft.expiresAt) {
          return res.status(410).json({ error: 'Draft expired' });
        }

        return res.status(200).json({
          draft: {
            id: draft.id,
            fantasyName: draft.fantasyName,
            brandColor: draft.brandColor,
            accentColor: draft.accentColor,
            logoUrl: draft.logoUrl,
            ctaText: draft.ctaText,
            ctaUrl: draft.ctaUrl,
            whatsapp: draft.whatsapp,
            desiredDomain: draft.desiredDomain,
            expiresAt: draft.expiresAt,
          },
          via: 'prisma',
        });
      } catch (e: any) {
        const msg = String(e?.message || e);
        
        // Fallback via Supabase PostgREST se erro "Tenant or user not found"
        if (msg.includes('Tenant or user not found')) {
          console.log('[branding/draft][GET] Tentando fallback via Supabase PostgREST...');
          
          try {
            const { data, error } = await supabaseAdmin
              .from('BrandingDraft')
              .select('*')
              .eq('id', id)
              .single();

            if (error) {
              console.error('[branding/draft][GET] Fallback error:', error);
              return res.status(error.code === 'PGRST116' ? 404 : 500).json({ 
                error: 'Draft not found',
                details: error.message,
                via: 'supabase-fallback'
              });
            }

            if (!data) {
              return res.status(404).json({ error: 'Draft not found', via: 'supabase-fallback' });
            }

            // Verificar se expirou
            if (new Date() > new Date(data.expiresAt)) {
              return res.status(410).json({ error: 'Draft expired', via: 'supabase-fallback' });
            }

            return res.status(200).json({
              draft: {
                id: data.id,
                fantasyName: data.fantasyName,
                brandColor: data.brandColor,
                accentColor: data.accentColor,
                logoUrl: data.logoUrl,
                ctaText: data.ctaText,
                ctaUrl: data.ctaUrl,
                whatsapp: data.whatsapp,
                desiredDomain: data.desiredDomain,
                expiresAt: data.expiresAt,
              },
              via: 'supabase-fallback',
            });
          } catch (fallbackError: any) {
            console.error('[branding/draft][GET] Fallback também falhou:', fallbackError);
            return res.status(500).json({ 
              error: 'Internal error (both Prisma and fallback failed)', 
              details: msg,
              fallbackError: fallbackError?.message
            });
          }
        }
        
        console.error('[branding/draft][GET]', e);
        return res.status(500).json({ error: 'Internal error', details: e?.message });
      }
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = DraftSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ 
      error: 'Invalid body', 
      issues: parsed.error.flatten().fieldErrors 
    });
  }

  const body = parsed.data;

  // Validar campos obrigatórios para criação
  if (!body.fantasyName || !body.brandColor || !body.ctaText || !body.ctaUrl) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'fantasyName, brandColor, ctaText, and ctaUrl are required'
    });
  }

  try {
    let prisma;
    try {
      prisma = getPrisma();
    } catch (prismaError: any) {
      console.error('[branding/draft][POST] getPrisma error:', prismaError);
      return res.status(500).json({ 
        error: 'Database unavailable',
        details: prismaError?.message || 'Prisma client not initialized',
        hint: 'Verifique DATABASE_URL e DIRECT_URL no Vercel. DIRECT_URL deve usar porta 5432 (sem pgbouncer).'
      });
    }
    
    if (!prisma) {
      return res.status(500).json({ 
        error: 'Database unavailable',
        details: 'Prisma client not initialized'
      });
    }

    // Verificar se brandingDraft existe no Prisma Client
    if (!('brandingDraft' in prisma)) {
      console.error('[branding/draft][POST] brandingDraft não existe no Prisma Client');
      return res.status(500).json({ 
        error: 'Prisma Client não sincronizado',
        details: 'brandingDraft model não encontrado no Prisma Client',
        hint: 'Verifique se postinstall: prisma generate está no package.json e se o deploy executou corretamente'
      });
    }

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 horas
    let status = 201;
    let draft;

    // Upsert por desiredDomain se informado
    if (body.desiredDomain) {
      const existing = await prisma.brandingDraft.findFirst({
        where: { desiredDomain: body.desiredDomain },
      });

      if (existing) {
        // Atualizar existente - retorna 200
        draft = await prisma.brandingDraft.update({
          where: { id: existing.id },
          data: {
            logoUrl: body.logoUrl || null,
            brandColor: body.brandColor || null,
            accentColor: body.accentColor || null,
            fantasyName: body.fantasyName || null,
            ctaText: body.ctaText || null,
            ctaUrl: body.ctaUrl || null,
            whatsapp: body.whatsapp || null,
            desiredDomain: body.desiredDomain,
            expiresAt,
          },
        });
        status = 200;
      } else {
        // Criar novo com desiredDomain - retorna 201
        draft = await prisma.brandingDraft.create({
          data: {
            logoUrl: body.logoUrl || null,
            brandColor: body.brandColor || null,
            accentColor: body.accentColor || null,
            fantasyName: body.fantasyName || null,
            ctaText: body.ctaText || null,
            ctaUrl: body.ctaUrl || null,
            whatsapp: body.whatsapp || null,
            desiredDomain: body.desiredDomain,
            expiresAt,
          },
        });
      }
    } else {
      // Criar novo sem desiredDomain - retorna 201
      draft = await prisma.brandingDraft.create({
        data: {
          logoUrl: body.logoUrl || null,
          brandColor: body.brandColor || null,
          accentColor: body.accentColor || null,
          fantasyName: body.fantasyName || null,
          ctaText: body.ctaText || null,
          ctaUrl: body.ctaUrl || null,
          whatsapp: body.whatsapp || null,
          desiredDomain: null,
          expiresAt,
        },
      });
    }

    return res.status(status).json({
      ok: true,
      id: draft.id,
      via: 'prisma',
      draft: {
        id: draft.id,
        fantasyName: draft.fantasyName,
        brandColor: draft.brandColor,
        accentColor: draft.accentColor,
        logoUrl: draft.logoUrl,
        ctaText: draft.ctaText,
        ctaUrl: draft.ctaUrl,
        whatsapp: draft.whatsapp,
        desiredDomain: draft.desiredDomain,
        expiresAt: draft.expiresAt,
      },
    });
  } catch (e: any) {
    console.error('[branding/draft][POST] ERROR:', e);
    console.error('[branding/draft][POST] Message:', e?.message);
    console.error('[branding/draft][POST] Stack:', e?.stack);
    console.error('[branding/draft][POST] Code:', e?.code);
    console.error('[branding/draft][POST] Meta:', JSON.stringify(e?.meta, null, 2));
    
    const msg = String(e?.message || e);
    
    // Fallback via Supabase PostgREST se erro "Tenant or user not found"
    if (msg.includes('Tenant or user not found')) {
      console.log('[branding/draft][POST] Tentando fallback via Supabase PostgREST...');
      
      try {
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
        
        // Preparar dados para inserção (Supabase aceita ISO string ou Date)
        // Gerar UUID para id (exigido pelo schema)
        const insertData: any = {
          id: randomUUID(),
          logoUrl: body.logoUrl || null,
          brandColor: body.brandColor || null,
          accentColor: body.accentColor || null,
          fantasyName: body.fantasyName || null,
          ctaText: body.ctaText || null,
          ctaUrl: body.ctaUrl || null,
          whatsapp: body.whatsapp || null,
          desiredDomain: body.desiredDomain || null,
          expiresAt: expiresAt.toISOString(),
        };

        // Upsert por desiredDomain se informado
        if (body.desiredDomain) {
          const { data: existing } = await supabaseAdmin
            .from('BrandingDraft')
            .select('id')
            .eq('desiredDomain', body.desiredDomain)
            .single();

          if (existing) {
            // Atualizar existente
            const { data, error } = await supabaseAdmin
              .from('BrandingDraft')
              .update(insertData)
              .eq('id', existing.id)
              .select()
              .single();

            if (error) {
              console.error('[branding/draft][POST] Fallback update error:', error);
              return res.status(500).json({ 
                error: 'Insert fallback failed', 
                details: error.message,
                via: 'supabase-fallback-update'
              });
            }

            return res.status(200).json({
              ok: true,
              id: data.id,
              via: 'supabase-fallback',
              draft: {
                id: data.id,
                fantasyName: data.fantasyName,
                brandColor: data.brandColor,
                accentColor: data.accentColor,
                logoUrl: data.logoUrl,
                ctaText: data.ctaText,
                ctaUrl: data.ctaUrl,
                whatsapp: data.whatsapp,
                desiredDomain: data.desiredDomain,
                expiresAt: data.expiresAt,
              },
            });
          }
        }

        // Criar novo
        const { data, error } = await supabaseAdmin
          .from('BrandingDraft')
          .insert([insertData])
          .select()
          .single();

        if (error) {
          console.error('[branding/draft][POST] Fallback insert error:', error);
          return res.status(500).json({ 
            error: 'Insert fallback failed', 
            details: error.message,
            via: 'supabase-fallback-insert'
          });
        }

        console.log('[branding/draft][POST] Fallback via Supabase PostgREST: sucesso');
        
        return res.status(201).json({
          ok: true,
          id: data.id,
          via: 'supabase-fallback',
          draft: {
            id: data.id,
            fantasyName: data.fantasyName,
            brandColor: data.brandColor,
            accentColor: data.accentColor,
            logoUrl: data.logoUrl,
            ctaText: data.ctaText,
            ctaUrl: data.ctaUrl,
            whatsapp: data.whatsapp,
            desiredDomain: data.desiredDomain,
            expiresAt: data.expiresAt,
          },
        });
      } catch (fallbackError: any) {
        console.error('[branding/draft][POST] Fallback também falhou:', fallbackError);
        return res.status(500).json({ 
          error: 'Internal error (both Prisma and fallback failed)', 
          details: msg,
          fallbackError: fallbackError?.message
        });
      }
    }
    
    // Erros não-relacionados: mantém comportamento atual
    return res.status(500).json({ 
      error: 'Internal error', 
      details: msg,
      code: e?.code || 'UNKNOWN',
      meta: e?.meta,
      hint: e?.code === 'P2003' ? 'Foreign key constraint failed' : 
            e?.code === 'P2025' ? 'Record not found' :
            e?.code === 'P1001' ? 'Cannot reach database server - verifique DATABASE_URL' :
            e?.code === 'P1017' ? 'Server closed connection' :
            e?.code === 'P2002' ? 'Unique constraint failed' :
            e?.message?.includes('brandingDraft') ? 'Prisma Client não reconhece brandingDraft - verifique postinstall: prisma generate' :
            undefined,
    });
  }
}

export default withRateLimit(handler, { limit: 10, windowSec: 60 });
