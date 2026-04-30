'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getCheckoutUrl, getProductConfig, productExists } from '@/lib/zapfarm/product-loader';

export function HeaderZapfarm() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const isReportPage = router.pathname.includes('/relatorio');
  const asPath = router.asPath?.split('?')[0] || '';
  const useMedviMark =
    router.pathname.startsWith('/emagrecimento') ||
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
  const isEmagrecimentoFlow =
    router.pathname.startsWith('/emagrecimento') || asPath.startsWith('/triagem/emagrecimento');

  // Na página de relatório, sempre usar estilo scrolled (fundo branco)
  const shouldUseScrolledStyle = isReportPage ? true : scrolled;
  const textColor = shouldUseScrolledStyle ? 'text-slate-700' : 'text-white';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldUseScrolledStyle
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 sm:h-16 md:h-20">
          {/* Marca compacta e neutra para manter o funil limpo sem copiar o benchmark. */}
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

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <a
              href="/emagrecimento"
              className={`text-sm font-medium transition-colors hover:opacity-80 ${textColor}`}
            >
              Programa
            </a>
            <a
              href="/emagrecimento#como-funciona"
              className={`text-sm font-medium transition-colors hover:opacity-80 ${textColor}`}
            >
              Como funciona
            </a>
            <a
              href="/emagrecimento#planos"
              className={`text-sm font-medium transition-colors hover:opacity-80 ${textColor}`}
            >
              Planos
            </a>
            <a
              href="/emagrecimento#faq"
              className={`text-sm font-medium transition-colors hover:opacity-80 ${textColor}`}
            >
              FAQ
            </a>
          </nav>

          {/* CTA Button - Desktop */}
          <a
            href={checkoutHref}
            className={`hidden md:inline-block rounded-full px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-bold transition-all hover:scale-105 ${
              shouldUseScrolledStyle || isReportPage
                ? 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-700'
                : 'bg-white text-emerald-700 shadow-xl'
            }`}
          >
            {isReportPage ? 'Ver programa sugerido →' : 'Fazer minha triagem'}
          </a>

          {/* Mobile Menu Button */}
          <a
            href={isReportPage ? checkoutHref : triageHref}
            className={`md:hidden rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-bold transition-all shadow-lg hover:shadow-xl whitespace-nowrap ${
              shouldUseScrolledStyle || isReportPage
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-white text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {isReportPage ? 'Continuar' : 'Iniciar'}
          </a>
        </div>
      </div>
    </header>
  );
}
