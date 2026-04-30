import Stripe from 'stripe';
import { getPrisma } from '@/lib/prisma';
import { logger } from '@/lib/log';
import { deriveBrand, type Hex } from '@/lib/theme/brand';

/**
 * Gera slug único baseado no nome
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

/**
 * Cria slug único verificando no banco
 */
async function createUniqueSlug(baseSlug: string): Promise<string> {
  const prisma = getPrisma();
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.tenant.findUnique({
      where: { slug },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * Provisiona tenant a partir de uma sessão de checkout Stripe
 */
export async function provisionTenantFromSession(session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {};
  const draftId = meta.draft_id;

  if (!draftId) {
    logger.warn({ sessionId: session.id }, 'provision_no_draft_id');
    throw new Error('draft_id não encontrado no metadata');
  }

  const prisma = getPrisma();

  // Buscar draft
  const draft = await prisma.brandingDraft.findUnique({
    where: { id: draftId },
  });

  if (!draft) {
    logger.error({ draftId }, 'provision_draft_not_found');
    throw new Error(`Draft ${draftId} não encontrado`);
  }

  // Verificar se já expirou (por segurança)
  if (new Date() > draft.expiresAt) {
    logger.warn({ draftId }, 'provision_draft_expired');
    throw new Error('Draft expirado');
  }

  // Gerar slug único
  const baseSlug = draft.fantasyName 
    ? generateSlug(draft.fantasyName)
    : `tenant-${Date.now()}`;
  const slug = await createUniqueSlug(baseSlug);

  // URL provisória
  const provisionalUrl = `https://${slug}.zapfarm.app`;

  // Normalizar cores com deriveBrand (garante contraste AA)
  const brandSeed = (draft.brandColor as Hex) || '#10b981';
  const { brand600: normalizedBrand } = deriveBrand(brandSeed);
  
  const accentSeed = draft.accentColor ? (draft.accentColor as Hex) : undefined;
  const normalizedAccent = accentSeed ? deriveBrand(accentSeed).brand600 : null;

  // Criar tenant
  const tenant = await prisma.tenant.create({
    data: {
      slug,
      name: draft.fantasyName || 'Clínica',
      domain: draft.desiredDomain || null,
      provisionalUrl,
      logoUrl: draft.logoUrl || null,
      brandColor: normalizedBrand, // Já otimizada
      accentColor: normalizedAccent, // Já otimizada (se fornecida)
      ctaText: draft.ctaText || null,
      ctaUrl: draft.ctaUrl || null,
      status: 'active',
      ownerEmail: session.customer_email || session.customer_details?.email || '',
      ownerName: session.customer_details?.name || null,
      ownerPhone: session.customer_details?.phone || draft.whatsapp || null,
      stripeCustomerId: (session.customer as string) || null,
      stripeSubscriptionId: (session.subscription as string) || null,
    },
  });

  logger.info({ tenantId: tenant.id, slug, provisionalUrl }, 'tenant_provisioned');

  // Deletar draft após criar tenant (não deixar lixo no banco)
  if (draftId) {
    await prisma.brandingDraft.delete({ where: { id: draftId } }).catch((err) => {
      logger.warn({ draftId, error: err?.message }, 'provision_draft_delete_failed');
      // Não falhar se não conseguir deletar o draft
    });
  }

  // Enviar email de boas-vindas (opcional - implementar depois)
  // await sendWelcomeEmail(tenant);

  return tenant;
}

