'use client';

import Image from 'next/image';

import { ChevronRightIcon } from '@heroicons/react/24/outline';

import { MedviTrustMarquee } from '@/components/medvi/MedviTrustMarquee';
import { track } from '@/lib/analytics';
import { MEDVI_HOME } from '@/lib/medvi-parity-tokens';

const TREATMENT_ROWS = [
  {
    slug: 'emagrecimento',
    title: 'Emagrecimento & metabolismo',
    href: '/emagrecimento',
    image: '/images/emagrecimento/medvi/treatment-injetavel.webp',
    pad: 'bg-emerald-100',
  },
  {
    slug: 'sono',
    title: 'Sono & recuperação',
    href: '/triagem/sono',
    image: '/images/emagrecimento/medvi/metabolism-habits.avif',
    pad: 'bg-sky-100',
  },
  {
    slug: 'articulacoes',
    title: 'Articulações & mobilidade',
    href: '/triagem/articulacoes',
    image: '/images/emagrecimento/medvi/journey-consulta.avif',
    pad: 'bg-amber-100',
  },
  {
    slug: 'cabelo',
    title: 'Cabelo & couro cabeludo',
    href: '/triagem/cabelo',
    image: '/images/emagrecimento/medvi/treatment-comprimidos.avif',
    pad: 'bg-violet-100',
  },
] as const;

/**
 * home.medvi.org — paridade responsiva:
 * - mobile: painel branco com cantos superiores arredondados sobre o hero + filas verticais (thumb à esquerda).
 * - desktop (md+): cartões horizontais (imagem em cima, título + seta).
 */
export function HomeHero() {
  const handlePrimary = () => {
    track('cta_click', { page: 'home', position: 'hero', section: 'home_hero' });
  };

  const handleRow = (slug: string, layout: 'mobile_stack' | 'desktop_card') => {
    track('cta_click', {
      page: 'home',
      position: layout === 'mobile_stack' ? 'treatment_row' : 'treatment_card',
      section: layout === 'mobile_stack' ? 'home_hero_stack' : 'home_hero_cards',
      treatment: slug,
    });
  };

  const thumbPx = MEDVI_HOME.stackThumbPx;
  const rowR = MEDVI_HOME.stackRowRadius;
  const cardRadius = 22;
  const desktopCardAspect = 'aspect-[4/3]';

  return (
    <>
      <section
        className="relative overflow-x-hidden pb-2 pt-[5.25rem] text-white sm:pt-[5.75rem] md:pb-12 md:pt-24"
        style={{ backgroundColor: MEDVI_HOME.heroBg }}
        data-testid="home-hub-hero"
        data-home-section="hero"
      >
        <div className="relative z-10 mx-auto w-full max-w-[min(1100px,calc(100%-2rem))] px-4 sm:px-5 md:px-8">
          <div className="mx-auto max-w-[520px] text-center md:max-w-3xl">
            <p
              className="mx-auto mb-1 inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] sm:mb-2 sm:text-[12px] sm:tracking-[0.12em]"
              style={{ color: MEDVI_HOME.heroTextMuted }}
            >
              Saúde online · triagem inteligente
            </p>
            <h1 className="mt-4 text-[1.75rem] font-bold leading-[1.12] tracking-[-0.03em] sm:mt-5 sm:text-[2rem] sm:leading-[1.1] md:text-[2.5rem] md:leading-[1.08]">
              O jeito mais simples de entender seu próximo passo em saúde.
            </h1>
            <p
              className="mx-auto mt-5 max-w-xl text-[15px] leading-6 sm:text-[16px] sm:leading-7"
              style={{ color: MEDVI_HOME.heroTextMuted }}
            >
              Comece por uma triagem rápida. A Me Joy organiza seu contexto, mostra caminhos possíveis e conecta você
              à avaliação médica quando fizer sentido.
            </p>
          </div>

          {/* Mobile: painel branco + lista vertical — espelha home.medvi.org em viewport estreita */}
          <div
            className="relative z-20 mx-auto mt-7 w-full max-w-[520px] md:hidden"
            data-testid="home-hero-stack"
          >
            <div
              className="relative -translate-y-4 rounded-t-[28px] bg-white px-2 pb-2.5 pt-2 sm:-translate-y-5 sm:rounded-t-[32px] sm:px-2.5 sm:pb-3 sm:pt-2.5"
              style={{
                borderTopLeftRadius: MEDVI_HOME.stackOuterRadiusTop,
                borderTopRightRadius: MEDVI_HOME.stackOuterRadiusTop,
                boxShadow: MEDVI_HOME.cardShadow,
              }}
            >
              <div className="flex flex-col gap-2.5 sm:gap-3">
                {TREATMENT_ROWS.map((row) => (
                  <a
                    key={row.slug}
                    href={row.href}
                    onClick={() => handleRow(row.slug, 'mobile_stack')}
                    className="flex min-h-[76px] items-center gap-3 px-2.5 py-2 transition active:opacity-90 sm:min-h-[80px] sm:gap-4 sm:px-3 sm:py-2.5"
                    style={{
                      borderRadius: MEDVI_HOME.stackRowRadius,
                      backgroundColor: MEDVI_HOME.stackCardBg,
                      minHeight: MEDVI_HOME.stackRowMinH,
                    }}
                  >
                    <div
                      className={`relative shrink-0 overflow-hidden ${row.pad}`}
                      style={{
                        width: thumbPx,
                        height: thumbPx,
                        borderTopLeftRadius: rowR,
                        borderBottomLeftRadius: rowR,
                        borderTopRightRadius: MEDVI_HOME.stackThumbInnerRadius,
                        borderBottomRightRadius: MEDVI_HOME.stackThumbInnerRadius,
                      }}
                    >
                      <Image src={row.image} alt="" fill className="object-cover" sizes={`${thumbPx}px`} />
                    </div>
                    <span className="min-w-0 flex-1 text-left text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[#111827] sm:text-[16px]">
                      {row.title}
                    </span>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-[#0a0a0a]" strokeWidth={2} aria-hidden />
                  </a>
                ))}
              </div>
              <div className="mt-3 sm:mt-3.5">
                <a
                  href="/triagem/emagrecimento"
                  data-testid="home-primary-cta"
                  onClick={handlePrimary}
                  className="flex h-12 w-full items-center justify-center rounded-[18px] border border-slate-200/80 bg-slate-50 text-[14px] font-semibold text-emerald-900 transition hover:bg-slate-100"
                >
                  Fazer minha triagem agora
                </a>
              </div>
            </div>
          </div>

          {/* Desktop (md+): cartões horizontais */}
          <div
            className="relative z-20 mx-auto mt-10 hidden w-full max-w-[920px] md:mt-12 md:block"
            data-testid="home-hero-desktop-cards"
          >
            <div className="flex flex-wrap justify-center gap-4 lg:gap-5">
              {TREATMENT_ROWS.map((row) => (
                <a
                  key={row.slug}
                  href={row.href}
                  onClick={() => handleRow(row.slug, 'desktop_card')}
                  className="w-[148px] shrink-0 overflow-hidden transition active:opacity-95 md:w-[180px]"
                  style={{
                    borderRadius: cardRadius,
                    backgroundColor: MEDVI_HOME.stackCardBg,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
                  }}
                  data-testid={`home-hero-card-${row.slug}`}
                >
                  <div className={`relative w-full ${desktopCardAspect} overflow-hidden ${row.pad}`}>
                    <Image src={row.image} alt={row.title} fill className="object-cover" sizes="180px" />
                  </div>
                  <div className="flex items-start gap-1.5 px-3 py-2.5 sm:px-3.5 sm:py-3">
                    <span className="min-w-0 flex-1 text-left text-[13px] font-semibold leading-snug tracking-[-0.01em] text-[#111827] md:text-[14px]">
                      {row.title}
                    </span>
                    <ChevronRightIcon
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#0a0a0a] md:h-5 md:w-5"
                      strokeWidth={2}
                    />
                  </div>
                </a>
              ))}
            </div>
            <div className="mx-auto mt-6 max-w-md">
              <a
                href="/triagem/emagrecimento"
                data-testid="home-primary-cta-desktop"
                onClick={handlePrimary}
                className="flex h-12 w-full items-center justify-center rounded-[18px] border border-slate-200/80 bg-slate-50 text-[14px] font-semibold text-emerald-900 transition hover:bg-slate-100"
              >
                Fazer minha triagem agora
              </a>
            </div>
          </div>
        </div>
      </section>
      <MedviTrustMarquee variant="bordered" />
    </>
  );
}
