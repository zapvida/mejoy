'use client';

import Image from 'next/image';

import { ChevronRightIcon } from '@heroicons/react/24/outline';

import { MedviTrustMarquee } from '@/components/medvi/MedviTrustMarquee';
import { track } from '@/lib/analytics';
import { HOME_HUB_TREATMENT_ROWS } from '@/lib/home-hub-assets';
import { MEDVI_HOME } from '@/lib/medvi-parity-tokens';

/**
 * home.medvi.org — primeiro frame mobile:
 * - texto central com coluna estreita;
 * - stack de cards com padding mínimo (cartões quase colados ao branco do painel);
 * - overlap do painel com margin-top negativo (evita buraco de layout do transform);
 * - faixa de confiança como último filho da mesma section (primeiro frame contínuo).
 */
export function HomeHero() {
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
  const cardRadius = MEDVI_HOME.desktopCardRadiusPx;
  const desktopCardAspect = 'aspect-[4/3]';
  const desktopW = MEDVI_HOME.desktopCardWidthPx;
  const desktopGap = MEDVI_HOME.desktopCardGapPx;
  const rowGap = MEDVI_HOME.stackRowGapPx;

  return (
    <>
      <section
        className="relative overflow-x-hidden pb-0 pt-[5.25rem] text-white sm:pt-[5.75rem] md:pb-12 md:pt-24"
        style={{ background: MEDVI_HOME.heroGradient }}
        data-testid="home-hub-hero"
        data-home-section="hero"
      >
        <div className="relative z-10 mx-auto w-full max-w-[min(1100px,calc(100%-2rem))] px-4 sm:px-5 md:px-8">
          <div className="mx-auto max-w-[min(22.5rem,calc(100%-0.5rem))] text-center sm:max-w-xl md:mx-0 md:max-w-none">
            <div className="mx-auto pb-0.5 md:max-w-3xl md:pb-0" style={{ maxWidth: `${MEDVI_HOME.heroHeadlineMaxWidthPx}px` }}>
              <p
                className="mx-auto mb-0 text-[14px] font-medium leading-snug sm:mb-1 sm:text-[15px]"
                style={{ color: MEDVI_HOME.heroTextMuted }}
              >
                Cuidado digital com critério clínico
              </p>
              <h1
                data-testid="home-hub-hero-title"
                className="mt-3 text-[2rem] font-bold leading-[1.06] tracking-[-0.035em] sm:mt-4 sm:text-[2.125rem] sm:leading-[1.05] md:text-[2.5rem] md:leading-[1.08]"
              >
                <span className="block md:inline">Saúde online,</span>
                <span className="mt-1 block md:mt-0 md:inline">
                  <span style={{ color: MEDVI_HOME.mintAccent }}>feita para ser entendida</span> e continuar com você.
                </span>
              </h1>
              <p
                className="mx-auto mt-[1.15rem] max-w-[19.5rem] text-[16px] font-normal leading-[1.54] sm:mt-5 sm:max-w-xl sm:text-[17px] sm:leading-[1.55] md:max-w-xl md:text-[16px]"
                style={{ color: MEDVI_HOME.heroTextMuted }}
              >
                Triagem rápida, próximos passos claros e cuidado humano quando indicado. Menos ruído, menos improviso
                e mais confiança para começar.
              </p>
            </div>
          </div>

          <div
            className="relative z-20 mx-auto mt-10 hidden w-full max-w-[920px] md:mt-12 md:block"
            data-testid="home-hero-desktop-cards"
          >
            <div className="flex flex-wrap justify-center" style={{ gap: `${desktopGap}px` }}>
              {HOME_HUB_TREATMENT_ROWS.map((row) => (
                <a
                  key={row.slug}
                  href={row.href}
                  data-testid={
                    row.slug === 'emagrecimento'
                      ? 'home-primary-cta-desktop'
                      : `home-hero-card-${row.slug}`
                  }
                  onClick={() => handleRow(row.slug, 'desktop_card')}
                  className="shrink-0 overflow-hidden transition active:opacity-95"
                  style={{
                    width: desktopW,
                    borderRadius: cardRadius,
                    backgroundColor: MEDVI_HOME.stackCardBg,
                    boxShadow: MEDVI_HOME.desktopCardShadow,
                  }}
                >
                  <div className={`relative w-full ${desktopCardAspect} overflow-hidden ${row.pad}`}>
                    <Image
                      src={row.image}
                      alt={row.title}
                      fill
                      className="object-cover"
                      sizes={`${desktopW}px`}
                    />
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
          </div>
        </div>

        {/* Mobile: cards full-bleed — padding mínimo (sem “meia-lua” branca em volta dos cinzas); overlap com margin (não transform) para o fluxo colar na faixa */}
        <div
          className="relative left-1/2 z-20 mt-10 w-screen max-w-[100vw] -translate-x-1/2 md:hidden sm:mt-[2.65rem]"
          data-testid="home-hero-stack"
        >
          <div
            className="relative bg-white px-2 pt-2 pb-0 sm:px-2.5 sm:pt-2.5"
            style={{
              borderTopLeftRadius: MEDVI_HOME.stackOuterRadiusTop,
              borderTopRightRadius: MEDVI_HOME.stackOuterRadiusTop,
              boxShadow: MEDVI_HOME.cardShadow,
              marginTop: `-${MEDVI_HOME.stackPanelOverlapRem}rem`,
            }}
          >
            <div className="flex flex-col" style={{ gap: `${rowGap}px` }}>
              {HOME_HUB_TREATMENT_ROWS.map((row) => (
                <a
                  key={row.slug}
                  href={row.href}
                  data-testid={
                    row.slug === 'emagrecimento' ? 'home-primary-cta' : `home-hero-card-${row.slug}`
                  }
                  onClick={() => handleRow(row.slug, 'mobile_stack')}
                  className="flex items-center gap-2.5 py-2.5 transition active:opacity-90 sm:gap-3 sm:py-[0.85rem]"
                  style={{
                    borderRadius: MEDVI_HOME.stackRowRadius,
                    backgroundColor: MEDVI_HOME.stackCardBg,
                    minHeight: MEDVI_HOME.stackRowMinH,
                    paddingLeft: '0.625rem',
                    paddingRight: '0.625rem',
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
                  <span className="min-w-0 flex-1 text-left text-[16px] font-semibold leading-snug tracking-[-0.015em] text-[#111827] sm:text-[17px] md:text-[16px]">
                    {row.title}
                  </span>
                  <ChevronRightIcon
                    className="h-5 w-5 shrink-0 text-[#0a0a0a] sm:h-[1.35rem] sm:w-[1.35rem]"
                    strokeWidth={2}
                    aria-hidden
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Faixa no primeiro frame: último filho da section = colada aos cards (sem section verde entre stack e faixa) */}
        <MedviTrustMarquee variant="belowHero" className="max-md:-mt-px" />
      </section>
    </>
  );
}
