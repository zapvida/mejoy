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

type HeaderMode = 'home' | 'landing' | 'report' | 'default';

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
  mode?: HeaderMode;
  showPrimaryCta?: boolean;
  showSecondaryCta?: boolean;
  showDesktopLinks?: boolean;
  showMenuButton?: boolean;
}

const DEFAULT_LINKS: HeaderLink[] = [
  { label: 'Programa', href: '/emagrecimento' },
  { label: 'Como funciona', href: '/emagrecimento/como-funciona' },
  { label: 'Tratamentos', href: '/emagrecimento/tratamentos' },
  { label: 'Resultados', href: '/emagrecimento/resultados' },
  { label: 'Especialistas', href: '/emagrecimento/especialistas' },
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
  mode = 'default',
  showPrimaryCta,
  showSecondaryCta = false,
  showDesktopLinks = false,
  showMenuButton = true,
}: HeaderZapfarmProps = {}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isReportPage = router.pathname.includes('/relatorio');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const checkoutHref = productSlug ? getCheckoutUrl(productSlug, undefined, reportId) : '/triagem/emagrecimento';

  const resolvedPrimaryHref = primaryCtaHref ?? (isReportPage ? checkoutHref : triageHref);
  const resolvedPrimaryLabel = primaryCtaLabel ?? (isReportPage ? 'Ver programa sugerido' : 'Começar avaliação');
  const resolvedPrimaryMobileLabel =
    primaryCtaMobileLabel ?? (resolvedPrimaryLabel.length > 18 ? 'Começar' : resolvedPrimaryLabel);

  const effectiveMode: HeaderMode = mode === 'default' ? (isReportPage ? 'report' : 'landing') : mode;
  const effectiveSubtitle =
    brandSubtitle ?? (effectiveMode === 'home' ? undefined : 'Me cuido. Me amo!');
  const shouldShowPrimary = showPrimaryCta ?? effectiveMode !== 'home';
  const shouldShowSecondary = showSecondaryCta && effectiveMode !== 'home';

  const lightHeader = !transparentAtTop || scrolled || effectiveMode !== 'home';
  const headerSurface =
    effectiveMode === 'home'
      ? lightHeader
        ? 'bg-[#204b3d]/92 backdrop-blur-xl border-b border-white/10'
        : 'bg-transparent'
      : 'border-b border-slate-200/70 bg-[#f7f6f2]/92 backdrop-blur-xl';

  const menuPanelSurface =
    effectiveMode === 'home'
      ? 'border-white/10 bg-[#17392f]/96 text-white'
      : 'border-slate-200 bg-white text-slate-950';

  const buttonSurface =
    effectiveMode === 'home'
      ? 'bg-white text-[#204b3d] hover:bg-white/90'
      : 'bg-[#2f2925] text-white hover:bg-[#201b18]';

  const menuButtonTone =
    effectiveMode === 'home'
      ? 'text-white hover:bg-white/10'
      : 'text-[#2f2925] hover:bg-slate-100';
  const secondaryButtonSurface =
    mode === 'home'
      ? 'border-white/20 bg-white/10 text-white hover:bg-white/14'
      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50';
  const secondaryMenuButtonSurface =
    mode === 'home'
      ? 'border-white/20 bg-white/5 text-white'
      : 'border-slate-300 bg-white text-slate-700';

  return (
    <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', headerSurface)}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <a href={homeHref} className="flex min-w-0 items-center" aria-label="MeJoy — página inicial">
          <MeJoyBrand
            iconClassName={cn(
              'h-11 w-11 rounded-[1.3rem] shadow-[0_16px_38px_rgba(16,24,40,0.08)] ring-1',
              effectiveMode === 'home' ? 'ring-white/40' : 'ring-slate-200'
            )}
            titleClassName={cn(
              'text-[28px] font-black tracking-[-0.06em]',
              effectiveMode === 'home' ? 'text-white' : 'text-[#2f2925]'
            )}
            subtitle={effectiveSubtitle}
            subtitleClassName={cn(
              'mt-1 text-[10px] font-semibold uppercase tracking-[0.06em]',
              effectiveMode === 'home' ? 'text-emerald-100/88' : 'text-slate-500'
            )}
          />
        </a>

        {showDesktopLinks ? (
          <nav className="hidden flex-1 items-center justify-center gap-8 xl:flex">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-semibold transition-colors',
                  effectiveMode === 'home'
                    ? 'text-white/82 hover:text-white'
                    : 'text-slate-700 hover:text-slate-950'
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : (
          <div className="flex-1" />
        )}

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {shouldShowSecondary ? (
            <a
              href={secondaryCtaHref}
              className={cn(
                'hidden rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors md:inline-flex',
                secondaryButtonSurface
              )}
            >
              {secondaryCtaLabel}
            </a>
          ) : null}

          {shouldShowPrimary ? (
            <a
              href={resolvedPrimaryHref}
              className={cn(
                'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold shadow-sm transition-colors sm:px-8 sm:py-3.5 sm:text-base',
                buttonSurface
              )}
            >
              <span className="sm:hidden">{resolvedPrimaryMobileLabel}</span>
              <span className="hidden sm:inline">{resolvedPrimaryLabel}</span>
            </a>
          ) : null}

          {showMenuButton ? (
            <button
              type="button"
              onClick={() => setMenuOpen(open => !open)}
              className={cn('inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors', menuButtonTone)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <span className="flex flex-col gap-1.5">
                <span className={cn('h-0.5 w-7 rounded-full transition-transform', effectiveMode === 'home' ? 'bg-white' : 'bg-[#2f2925]', menuOpen ? 'translate-y-2 rotate-45' : '')} />
                <span className={cn('h-0.5 w-7 rounded-full transition-opacity', effectiveMode === 'home' ? 'bg-white' : 'bg-[#2f2925]', menuOpen ? 'opacity-0' : '')} />
                <span className={cn('h-0.5 w-7 rounded-full transition-transform', effectiveMode === 'home' ? 'bg-white' : 'bg-[#2f2925]', menuOpen ? '-translate-y-2 -rotate-45' : '')} />
              </span>
            </button>
          ) : null}
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-inherit px-4 pb-5 sm:px-6 lg:px-8">
          <div className={cn('mx-auto max-w-7xl rounded-[28px] border p-5 shadow-[0_20px_60px_rgba(15,23,42,0.12)]', menuPanelSurface)}>
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
              <nav className="grid gap-2">
                {links.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'rounded-2xl px-4 py-3 text-sm font-semibold transition-colors',
                      effectiveMode === 'home'
                        ? 'hover:bg-white/10'
                        : 'hover:bg-slate-50'
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="flex flex-col gap-3 md:min-w-[260px]">
                {shouldShowPrimary ? (
                  <a
                    href={resolvedPrimaryHref}
                    className={cn(
                      'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold',
                      buttonSurface
                    )}
                  >
                    {resolvedPrimaryLabel}
                  </a>
                ) : null}
                {shouldShowSecondary ? (
                  <a
                    href={secondaryCtaHref}
                    className={cn(
                      'inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold',
                      secondaryMenuButtonSurface
                    )}
                  >
                    {secondaryCtaLabel}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
