'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getCheckoutUrl, getProductConfig, productExists } from '@/lib/zapfarm/product-loader';

interface HeaderZapfarmProps {
  links?: Array<{ label: string; href: string }>;
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  primaryCtaMobileLabel?: string;
  primaryCtaOnClick?: () => void;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  brandSubtitle?: string;
  transparentAtTop?: boolean;
}

const HOME_JOURNEY_LINKS = [
  { label: 'Programa', href: '/#programa' },
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Planos', href: '/#planos' },
  { label: 'Depoimentos', href: '/#depoimentos' },
  { label: 'FAQ', href: '/#faq' },
] as const;

export function HeaderZapfarm({
  links,
  primaryCtaHref,
  primaryCtaLabel,
  primaryCtaMobileLabel,
  primaryCtaOnClick,
  secondaryCtaHref,
  secondaryCtaLabel,
  brandSubtitle,
  transparentAtTop,
}: HeaderZapfarmProps = {}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const isReportPage = router.pathname.includes('/relatorio');
  const asPath = router.asPath?.split('?')[0] || '';
  const isLandingPage = router.pathname === '/emagrecimento' || asPath === '/emagrecimento';
  const isHomeJourney = router.pathname === '/' || asPath === '/';
  const isJourneyPage = isLandingPage || isHomeJourney;
  const useMedviMark = isJourneyPage || asPath.startsWith('/triagem/emagrecimento');
  const useMinimalReportHeader = isReportPage;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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
  const checkoutHref = productSlug ? getCheckoutUrl(productSlug, undefined, reportId) : '/protocolos';
  const resolvedPrimaryHref = primaryCtaHref || (isReportPage ? checkoutHref : triageHref);
  const resolvedPrimaryLabel =
    primaryCtaLabel || (isReportPage ? 'Ver programa sugerido →' : 'Fazer minha triagem');
  const resolvedPrimaryMobileLabel =
    primaryCtaMobileLabel || (isReportPage ? resolvedPrimaryLabel.replace(' →', '') : 'Iniciar');
  const navigationLinks = links?.length ? links : HOME_JOURNEY_LINKS;
  const isEmagrecimentoFlow = isJourneyPage || asPath.startsWith('/triagem/emagrecimento');
  const shouldUseScrolledStyle =
    isJourneyPage || isReportPage ? true : transparentAtTop === false ? true : scrolled;
  const textColor = shouldUseScrolledStyle ? 'text-slate-700' : 'text-white';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldUseScrolledStyle ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      data-testid="home-medvi-header"
    >
      {isJourneyPage && !useMinimalReportHeader && (
        <div className="border-b border-emerald-100/90 bg-white/92 px-3 py-1.5 text-center text-[9px] font-semibold tracking-[0.08em] text-emerald-800 backdrop-blur sm:px-4 sm:py-2 sm:text-[10px] sm:uppercase sm:tracking-[0.14em]">
          <span className="sm:hidden">Avaliacao medica, privacidade e suporte oficial</span>
          <span className="hidden sm:inline">Programa com avaliacao medica, privacidade e suporte oficial no mesmo fluxo</span>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between ${isJourneyPage ? 'h-14 sm:h-[76px]' : 'h-20 sm:h-16 md:h-20'}`}>
          <a href="/" className="flex items-center shrink-0 gap-2" aria-label="Me Joy — inicio">
            {useMedviMark ? (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black tracking-[0.22em] ${
                    shouldUseScrolledStyle || isReportPage
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-white/95 text-emerald-800 shadow-lg'
                  }`}
                  style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
                >
                  MEJOY
                </span>
                {isEmagrecimentoFlow && (
                  <span className={`hidden text-[11px] font-semibold uppercase tracking-[0.12em] lg:inline ${textColor}`}>
                    Emagrecimento com avaliacao medica
                  </span>
                )}
                {!isEmagrecimentoFlow && brandSubtitle && (
                  <span className={`hidden text-xs md:inline ${textColor}`}>{brandSubtitle}</span>
                )}
              </div>
            ) : (
              <Image
                src="/logosmejoy/logomejoy.png"
                alt="Me Joy Farma"
                width={160}
                height={48}
                className="h-8 w-auto object-contain sm:h-9 md:h-10"
                priority
              />
            )}
          </a>

          <nav className={`hidden items-center gap-7 text-[13px] font-semibold uppercase tracking-[0.08em] md:flex ${useMinimalReportHeader ? 'md:hidden' : ''}`}>
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-emerald-700 ${textColor}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {!useMinimalReportHeader && secondaryCtaHref && secondaryCtaLabel && (
              <a
                href={secondaryCtaHref}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all hover:scale-105 ${
                  shouldUseScrolledStyle || isReportPage
                    ? 'border border-emerald-200 bg-white text-emerald-700 shadow-sm hover:bg-emerald-50'
                    : 'border border-white/20 bg-white/10 text-white backdrop-blur-sm'
                }`}
              >
                {secondaryCtaLabel}
              </a>
            )}
            <a
              href={resolvedPrimaryHref}
              onClick={primaryCtaOnClick}
              className={`inline-block rounded-full px-5 py-2.5 text-xs font-bold transition-all hover:scale-105 md:px-6 md:py-3 md:text-sm ${
                shouldUseScrolledStyle || isReportPage
                  ? 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-700'
                  : 'bg-white text-emerald-700 shadow-xl'
              }`}
            >
              {resolvedPrimaryLabel}
            </a>
          </div>

          {isJourneyPage && !useMinimalReportHeader ? (
            <a
              href="/#planos"
              className="rounded-full border border-emerald-200 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-800 shadow-sm transition-colors hover:bg-emerald-50 md:hidden"
            >
              Planos
            </a>
          ) : (
            <a
              href={resolvedPrimaryHref}
              onClick={primaryCtaOnClick}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all shadow-lg hover:shadow-xl sm:px-6 sm:py-3 md:hidden ${
                shouldUseScrolledStyle || isReportPage
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {resolvedPrimaryMobileLabel}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
