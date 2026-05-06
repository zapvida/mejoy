import type { NextApiRequest, NextApiResponse } from 'next';
import { getHost } from '@/lib/getHost';
import { getPrisma } from '@/lib/prisma';
import { isRootB2BDomain } from '@/lib/flags';

const FALLBACK = {
  name: 'MeJoy',
  logoUrl: '/brand/logo-horizontal-primary.png',
  primaryColor: '#004c2e',
  secondaryColor: '#0b6b46',
  ctaPrimaryUrl: process.env.ZAPVIDA_FALLBACK_CTA || 'https://zapvida.com/',
  ctaLabel: 'Atendimento imediato',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tenantMode = process.env.TENANT_MODE || 'single';
    const host = (req.headers['x-tenant-host'] as string) || getHost(req);

    // Root B2B domain não consulta tenant (retorna fallback padrão)
    if (isRootB2BDomain(host)) {
      return res.status(200).json(FALLBACK);
    }

    const prisma = getPrisma();

    if (tenantMode === 'single') {
      // modo legado: retorna fallback ou tenant default se existir
      const one = await prisma.tenant.findFirst().catch(() => null);
      return res.status(200).json(one ? {
        name: one.name,
        logoUrl: one.logoUrl ?? FALLBACK.logoUrl,
        primaryColor: one.brandColor ?? FALLBACK.primaryColor,
        secondaryColor: one.accentColor ?? FALLBACK.secondaryColor,
        ctaPrimaryUrl: one.ctaUrl ?? FALLBACK.ctaPrimaryUrl,
        ctaLabel: one.ctaText ?? FALLBACK.ctaLabel,
      } : FALLBACK);
    }

    // multi: resolve por host (não há model Domain, usar Tenant diretamente por domain)
    const t = await prisma.tenant.findFirst({
      where: { domain: host.toLowerCase() }
    }).catch(() => null);

    if (!t) return res.status(200).json(FALLBACK);

    return res.status(200).json({
      name: t.name,
      logoUrl: t.logoUrl ?? FALLBACK.logoUrl,
      primaryColor: t.brandColor ?? FALLBACK.primaryColor,
      secondaryColor: t.accentColor ?? FALLBACK.secondaryColor,
      ctaPrimaryUrl: t.ctaUrl ?? FALLBACK.ctaPrimaryUrl,
      ctaLabel: t.ctaText ?? FALLBACK.ctaLabel,
      whatsapp: t.whatsapp,
    });
  } catch {
    return res.status(200).json(FALLBACK);
  }
}
