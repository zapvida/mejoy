'use client';

import { useState, useEffect, useMemo } from 'react';
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
  const isHomeJourney =
    router.pathname === '/' ||
    asPath === '/';
  const useMedviMark =
    isLandingPage ||
    isHomeJourney ||
    asPath.startsWith('/triagem/emagrecimento');

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
  const navigationLinks =
    links?.length
      ? links
      : [
          { label: 'Programa', href: '/' },
          { label: 'Como funciona', href: '/#como-funciona' },
          { label: 'Planos', href: '/#planos' },
          { label: 'FAQ', href: '/#faq' },
        ];
  const isEmagrecimentoFlow =
    isLandingPage || asPath.startsWith('/triagem/emagrecimento');

  if (isLandingPage) {
    return (
      <header className="fixed inset-x-0 top-0 z-50" data-testid="home-medvi-header">
        <div className="border-b border-emerald-100 bg-white/95 px-3 py-1.5 text-center text-[9px] font-semibold tracking-[0.06em] text-emerald-800 backdrop-blur sm:px-4 sm:py-2.5 sm:text-[11px] sm:uppercase sm:tracking-[0.12em]">
          <span className="sm:hidden">Avaliação médica e suporte oficial no WhatsApp</span>
          <span className="hidden sm:inline">Programa com avaliação médica individual e suporte oficial no WhatsApp</span>
        </div>
        <div
          className={`border-b border-emerald-100/80 backdrop-blur transition-all duration-300 ${
            scrolled ? 'bg-white/95 shadow-sm' : 'bg-[#f6fbf7]/92'
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex h-14 items-center justify-between sm:h-24">
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-[22px] border border-emerald-100 bg-white/92 px-3 py-2 shadow-sm sm:gap-3 sm:rounded-full sm:px-4"
                aria-label="Me Joy — início"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f7efe9] text-xl font-black text-amber-950 sm:h-9 sm:w-9 sm:text-sm">
                  Me
                </span>
                <span className="leading-none sm:leading-tight">
                  <span className="block text-[15px] font-bold tracking-[-0.03em] text-slate-950 sm:text-xl">MeJoy</span>
                  <span className="hidden text-[11px] text-slate-500 sm:block">Me cuido. Me amo!</span>
                </span>
              </a>

              <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex">
                <a href="/emagrecimento#programa" className="transition-colors hover:text-emerald-700">
                  Programa
                </a>
                <a href="/emagrecimento#tratamentos" className="transition-colors hover:text-emerald-700">
                  Tratamentos
                </a>
                <a href="/emagrecimento#depoimentos" className="transition-colors hover:text-emerald-700">
                  Resultados
                </a>
                <a href="/emagrecimento#faq" className="transition-colors hover:text-emerald-700">
                  FAQ
                </a>
              </nav>

              <a
                href="/emagrecimento#faq"
                className="inline-flex rounded-full border border-emerald-200 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.06em] text-emerald-800 shadow-sm transition-colors hover:bg-emerald-50 md:hidden"
              >
                FAQ
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const shouldUseScrolledStyle = isReportPage ? true : transparentAtTop === false ? true : scrolled;
  const textColor = shouldUseScrolledStyle ? 'text-slate-700' : 'text-white';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldUseScrolledStyle
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
      data-testid="home-medvi-header"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 sm:h-16 md:h-20">
          <a href="/" className="flex items-center shrink-0 gap-2" aria-label="Me Joy — início">
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
                  <span className={`hidden text-xs font-semibold md:inline ${textColor}`}>
                    Programa de emagrecimento
                  </span>
                )}
                {!isEmagrecimentoFlow && brandSubtitle && (
                  <span className={`hidden text-xs md:inline ${textColor}`}>
                    {brandSubtitle}
                  </span>
                )}
              </div>
            ) : (
              <Image
                src="/logosmejoy/logomejoy.png"
                alt="Me Joy Farma"
                width={160}
                height={48}
                className="h-8 sm:h-9 md:h-10 w-auto object-contain"
                priority
              />
            )}
          </a>

          <nav className="hidden lg:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:opacity-80 ${textColor}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {secondaryCtaHref && secondaryCtaLabel && (
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
              className={`inline-block rounded-full px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-bold transition-all hover:scale-105 ${
                shouldUseScrolledStyle || isReportPage
                  ? 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-700'
                  : 'bg-white text-emerald-700 shadow-xl'
              }`}
            >
              {resolvedPrimaryLabel}
            </a>
          </div>

          <a
            href={resolvedPrimaryHref}
            onClick={primaryCtaOnClick}
            className={`md:hidden rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-bold transition-all shadow-lg hover:shadow-xl whitespace-nowrap ${
              shouldUseScrolledStyle || isReportPage
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-white text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {resolvedPrimaryMobileLabel}
          </a>
        </div>
      </div>
    </header>
  );
}
