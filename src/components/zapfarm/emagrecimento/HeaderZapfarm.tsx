'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { MeJoyBrand } from '@/components/ui/MeJoyBrand';
import { getCheckoutUrl, getProductConfig, productExists } from '@/lib/zapfarm/product-loader';
import { cn } from '@/lib/utils';

type HeaderLink = {
  label: string;
  href: string;
};

interface HeaderZapfarmProps {
  homeHref?: string;
  links?: HeaderLink[];
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  primaryCtaMobileLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  brandSubtitle?: string;
  transparentAtTop?: boolean;
}

const DEFAULT_LINKS: HeaderLink[] = [
  { label: 'Programa', href: '/emagrecimento' },
  { label: 'Como funciona', href: '/emagrecimento#como-funciona' },
  { label: 'Planos', href: '/emagrecimento#planos' },
  { label: 'FAQ', href: '/emagrecimento#faq' },
];

export function HeaderZapfarm({
  homeHref = '/',
  links = DEFAULT_LINKS,
  primaryCtaHref,
  primaryCtaLabel,
  primaryCtaMobileLabel,
  secondaryCtaHref = '/produtos',
  secondaryCtaLabel = 'Ver produtos',
  brandSubtitle,
  transparentAtTop = false,
}: HeaderZapfarmProps = {}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const isReportPage = router.pathname.includes('/relatorio');
  const asPath = router.asPath?.split('?')[0] || '';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const queryProduct = router.query?.product;
  const querySlug = router.query?.slug;
  const queryReportId = router.query?.reportId;
  const queryId = router.query?.id;

  const productSlug = useMemo(() => {
    const slugFromQuery =
      typeof queryProduct === 'string'
        ? queryProduct
        : typeof querySlug === 'string'
          ? querySlug
          : undefined;

    const normalize = (value?: string) => {
      if (!value) return null;
      return productExists(value) ? value : null;
    };

    const [slugFromUrl, pathSlug, pathnameSlug] = [
      slugFromQuery,
      router.asPath?.split('?')[0]?.split('/').filter(Boolean)?.[0],
      router.pathname?.split('/').filter(Boolean)?.[0],
    ];

    return normalize(slugFromUrl) ?? normalize(pathSlug) ?? normalize(pathnameSlug);
  }, [queryProduct, querySlug, router.asPath, router.pathname]);

  const reportId =
    typeof queryReportId === 'string'
      ? queryReportId
      : typeof queryId === 'string'
        ? queryId
        : undefined;

  const productConfig = productSlug ? getProductConfig(productSlug) : null;
  const triageHref = productConfig ? `/triagem/${productConfig.triageSlug}` : '/triagem/emagrecimento';
  const checkoutHref = productSlug ? getCheckoutUrl(productSlug, undefined, reportId) : '/triagem/emagrecimento';

  const resolvedPrimaryHref = primaryCtaHref ?? (isReportPage ? checkoutHref : triageHref);
  const resolvedPrimaryLabel = primaryCtaLabel ?? (isReportPage ? 'Ver programa sugerido' : 'Começar avaliação');
  const resolvedPrimaryMobileLabel =
    primaryCtaMobileLabel ?? (resolvedPrimaryLabel.length > 18 ? 'Começar' : resolvedPrimaryLabel);
  const effectiveSubtitle = brandSubtitle ?? 'Me cuido. Me amo!';

  const lightHeader = !transparentAtTop || scrolled || isReportPage;

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        lightHeader
          ? 'border-b border-emerald-100 bg-white/94 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
        <a
          href={homeHref}
          className="flex min-w-0 shrink-0 items-center"
          aria-label="MeJoy — página inicial"
        >
          <div
            className={cn(
              'flex min-h-11 items-center rounded-full px-2.5 py-1.5 shadow-sm transition-colors sm:min-h-12 sm:px-3',
              lightHeader ? 'bg-emerald-50 ring-1 ring-emerald-100' : 'bg-white/92'
            )}
          >
            <MeJoyBrand
              iconClassName="h-7 w-7 rounded-[0.95rem] sm:h-8 sm:w-8 sm:rounded-xl"
              titleClassName="text-[14px] font-semibold sm:text-[15px]"
              subtitle={effectiveSubtitle}
              subtitleClassName={cn(
                'mt-0.5 text-[9px] font-semibold tracking-[-0.01em] sm:text-[10px]',
                lightHeader ? 'text-slate-500' : 'text-emerald-100/95'
              )}
            />
          </div>
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'whitespace-nowrap text-sm font-semibold transition-colors',
                lightHeader ? 'text-slate-700 hover:text-emerald-700' : 'text-emerald-50/95 hover:text-white'
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <a
            href={secondaryCtaHref}
            className={cn(
              'hidden whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-colors md:inline-flex',
              lightHeader
                ? 'border border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                : 'border border-white/30 bg-white/10 text-white hover:bg-white/16'
            )}
          >
            {secondaryCtaLabel}
          </a>
          <a
            href={resolvedPrimaryHref}
            className={cn(
              'inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold shadow-lg transition-all sm:px-6 sm:py-3',
              lightHeader
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-xl'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 hover:shadow-xl'
            )}
          >
            <span className="sm:hidden">{resolvedPrimaryMobileLabel}</span>
            <span className="hidden sm:inline">{resolvedPrimaryLabel}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
