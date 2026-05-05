'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getCheckoutUrl, getProductConfig, productExists } from '@/lib/zapfarm/product-loader';
import { MEDVI_GLP } from '@/lib/medvi-parity-tokens';

function IconMenuTwoLines({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
    </svg>
  );
}

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
  { label: 'Programa', href: '/#tratamentos' },
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Planos', href: '/emagrecimento#tratamentos' },
  { label: 'Depoimentos', href: '/#depoimentos' },
  { label: 'FAQ', href: '/#faq' },
] as const;

const EMAGRECIMENTO_LANDING_LINKS = [
  { label: 'Programa', href: '/emagrecimento#programa' },
  { label: 'Tratamentos', href: '/emagrecimento#tratamentos' },
  { label: 'Resultados', href: '/emagrecimento#depoimentos' },
  { label: 'FAQ', href: '/emagrecimento#faq' },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const isReportPage = router.pathname.includes('/relatorio');
  const asPath = router.asPath?.split('?')[0] || '';
  const isLandingPage = router.pathname === '/emagrecimento' || asPath === '/emagrecimento';
  const isHomeHub = router.pathname === '/';
  const isJourneyPage = isLandingPage || isHomeHub;
  const useMedviMark = isJourneyPage || asPath.startsWith('/triagem/emagrecimento');
  const useMinimalReportHeader = isReportPage;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [router.asPath]);

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
    primaryCtaMobileLabel || (isReportPage ? resolvedPrimaryLabel.replace(' →', '') : 'Triagem');
  const navigationLinks = links?.length ? links : isLandingPage ? EMAGRECIMENTO_LANDING_LINKS : HOME_JOURNEY_LINKS;
  const isEmagrecimentoFlow = isJourneyPage || asPath.startsWith('/triagem/emagrecimento');

  const shouldUseScrolledStyle =
    isReportPage ||
    isLandingPage ||
    scrolled ||
    (isJourneyPage && !isHomeHub) ||
    transparentAtTop === false;

  const textColor = shouldUseScrolledStyle ? 'text-slate-800' : 'text-white';
  const medviShell = isHomeHub || isLandingPage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldUseScrolledStyle ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]' : 'bg-transparent'
      }`}
      data-testid="home-medvi-header"
    >
      <div className="container mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className={`flex items-center justify-between ${isJourneyPage ? 'h-14 sm:h-[60px]' : 'h-20 sm:h-16 md:h-20'}`}>
          <a href="/" className="flex min-w-0 shrink-0 items-center gap-2" aria-label="Me Joy — inicio">
            {useMedviMark ? (
              <div className="flex min-w-0 items-center gap-2">
                {medviShell ? (
                  <span
                    className={`truncate text-[17px] font-bold tracking-[-0.02em] sm:text-[18px] ${
                      shouldUseScrolledStyle ? 'text-[#1f2937]' : 'text-white'
                    }`}
                  >
                    Me Joy
                  </span>
                ) : (
                  <>
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-black tracking-[0.2em] ${
                        shouldUseScrolledStyle || isReportPage
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-white/95 text-emerald-800 shadow-md'
                      }`}
                    >
                      MEJOY
                    </span>
                    {isEmagrecimentoFlow && (
                      <span
                        className={`hidden text-[11px] font-semibold uppercase tracking-[0.12em] lg:inline ${textColor}`}
                      >
                        Emagrecimento com avaliação médica
                      </span>
                    )}
                  </>
                )}
                {!medviShell && !isEmagrecimentoFlow && brandSubtitle && (
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

          <nav className={`hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-[0.11em] md:flex ${useMinimalReportHeader ? 'md:hidden' : ''}`}>
            {navigationLinks.map((link) => (
              <a key={link.href} href={link.href} className={`transition-colors hover:opacity-80 ${textColor}`}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isLandingPage && !useMinimalReportHeader && (
              <a
                href={resolvedPrimaryHref}
                onClick={primaryCtaOnClick}
                className="rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-95"
                style={{ backgroundColor: MEDVI_GLP.headerCtaDark }}
              >
                Começar
              </a>
            )}
            {!useMinimalReportHeader && secondaryCtaHref && secondaryCtaLabel && (
              <a
                href={secondaryCtaHref}
                className={`rounded-full px-5 py-2.5 text-[11px] font-bold transition ${
                  shouldUseScrolledStyle || isReportPage
                    ? 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    : 'border border-white/25 bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                {secondaryCtaLabel}
              </a>
            )}
            {!isLandingPage && (
              <a
                href={resolvedPrimaryHref}
                onClick={primaryCtaOnClick}
                className="inline-block rounded-full px-5 py-2.5 text-[11px] font-bold transition md:px-6 md:py-2.5 md:text-[12px]"
                style={{
                  backgroundColor: shouldUseScrolledStyle || isReportPage ? MEDVI_GLP.sage : '#ffffff',
                  color: shouldUseScrolledStyle || isReportPage ? '#ffffff' : MEDVI_GLP.charcoal,
                  boxShadow:
                    shouldUseScrolledStyle || isReportPage
                      ? '0 10px 28px rgba(112,136,105,0.35)'
                      : '0 12px 32px rgba(0,0,0,0.12)',
                }}
              >
                {resolvedPrimaryLabel}
              </a>
            )}
            {isLandingPage && (
              <a
                href={resolvedPrimaryHref}
                onClick={primaryCtaOnClick}
                className="inline-block rounded-full px-5 py-2.5 text-[11px] font-bold text-white transition md:px-6 md:py-2.5 md:text-[12px]"
                style={{
                  backgroundColor: MEDVI_GLP.sage,
                  boxShadow: '0 10px 28px rgba(112,136,105,0.35)',
                }}
              >
                {resolvedPrimaryLabel}
              </a>
            )}
          </div>

          {medviShell && !useMinimalReportHeader ? (
            <div className="flex items-center gap-2 md:hidden">
              {isLandingPage && (
                <a
                  href={resolvedPrimaryHref}
                  onClick={primaryCtaOnClick}
                  className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.07em] text-white"
                  style={{ backgroundColor: MEDVI_GLP.headerCtaDark }}
                >
                  Começar
                </a>
              )}
              <button
                type="button"
                className={`rounded-lg p-2 ${shouldUseScrolledStyle ? 'text-[#1f2937]' : 'text-white'}`}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                onClick={() => setMenuOpen((o) => !o)}
              >
                {menuOpen ? <XMarkIcon className="h-7 w-7" /> : <IconMenuTwoLines className="h-7 w-7" />}
              </button>
            </div>
          ) : isJourneyPage && !useMinimalReportHeader ? (
            <a
              href="/emagrecimento#tratamentos"
              className="rounded-full border border-emerald-200 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-800 shadow-sm md:hidden"
            >
              {isLandingPage ? 'Tratamentos' : 'Planos'}
            </a>
          ) : (
            <a
              href={resolvedPrimaryHref}
              onClick={primaryCtaOnClick}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition sm:px-6 md:hidden ${
                shouldUseScrolledStyle || isReportPage ? 'text-white' : 'bg-white text-emerald-700 shadow-lg'
              }`}
              style={
                shouldUseScrolledStyle || isReportPage ? { backgroundColor: MEDVI_GLP.sage } : undefined
              }
            >
              {resolvedPrimaryMobileLabel}
            </a>
          )}
        </div>
      </div>

      {medviShell && menuOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-14 z-[60] overflow-y-auto bg-white md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto flex max-w-[1100px] flex-col gap-0 px-6 py-5">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="border-b border-slate-100 py-[1.125rem] text-[16px] font-semibold text-slate-900"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={resolvedPrimaryHref}
              onClick={() => {
                primaryCtaOnClick?.();
                setMenuOpen(false);
              }}
              className="mt-5 flex h-12 items-center justify-center rounded-full text-[14px] font-bold text-white"
              style={{ backgroundColor: MEDVI_GLP.sage }}
            >
              {resolvedPrimaryLabel}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
