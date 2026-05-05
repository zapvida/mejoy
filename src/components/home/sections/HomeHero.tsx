'use client';

import Image from 'next/image';

import { ChevronRightIcon } from '@heroicons/react/24/outline';

import { MedviTrustMarquee } from '@/components/medvi/MedviTrustMarquee';
import { track } from '@/lib/analytics';
import { HOME_HUB_TREATMENT_ROWS } from '@/lib/home-hub-assets';
import { MEDVI_HOME } from '@/lib/medvi-parity-tokens';

/**
 * home.medvi.org — paridade responsiva:
 * - mobile: painel branco com cantos superiores arredondados sobre o hero + filas verticais (thumb à esquerda).
 * - desktop (md+): cartões horizontais (imagem em cima, título + seta).
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
        className="relative overflow-x-hidden pb-2 pt-[5.25rem] text-white sm:pt-[5.75rem] md:pb-12 md:pt-24"
        style={{ background: MEDVI_HOME.heroGradient }}
        data-testid="home-hub-hero"
        data-home-section="hero"
      >
        <div className="relative z-10 mx-auto w-full max-w-[min(1100px,calc(100%-2rem))] px-4 sm:px-5 md:px-8">
          <div className="mx-auto max-w-[520px] text-center md:max-w-none">
            <div
              className="mx-auto md:max-w-3xl"
              style={{ maxWidth: `${MEDVI_HOME.heroHeadlineMaxWidthPx}px` }}
            >
              <p
                className="mx-auto mb-1 text-[13px] font-medium sm:mb-2 sm:text-[14px]"
                style={{ color: MEDVI_HOME.heroTextMuted }}
              >
                Milhares de pacientes já confiaram na Me Joy
              </p>
              <h1
                data-testid="home-hub-hero-title"
                className="mt-3 text-[1.75rem] font-bold leading-[1.12] tracking-[-0.03em] sm:mt-4 sm:text-[2rem] sm:leading-[1.1] md:text-[2.5rem] md:leading-[1.08]"
              >
                Saúde online,{' '}
                <span style={{ color: MEDVI_HOME.mintAccent }}>repensada</span>
                <br className="hidden sm:block" /> para a vida real.
              </h1>
              <p
                className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.55] sm:mt-5 sm:text-[16px] sm:leading-relaxed"
                style={{ color: MEDVI_HOME.heroTextMuted }}
              >
                Atendimento médico à distância — simples, direto e com profissionais habilitados. Sem sala de espera.
                Sem passos desnecessários. Só cuidado que funciona.
              </p>
            </div>
          </div>

          {/* Mobile: painel branco + lista vertical */}
          <div
            className="relative z-20 mx-auto mt-7 w-full max-w-[520px] md:hidden"
            data-testid="home-hero-stack"
          >
            <div
              className="relative bg-white px-2 pb-2.5 pt-2 sm:px-2.5 sm:pb-3 sm:pt-2.5"
              style={{
                borderTopLeftRadius: MEDVI_HOME.stackOuterRadiusTop,
                borderTopRightRadius: MEDVI_HOME.stackOuterRadiusTop,
                boxShadow: MEDVI_HOME.cardShadow,
                transform: `translateY(-${MEDVI_HOME.stackPanelOverlapRem}rem)`,
              }}
            >
              <div
                className="flex flex-col"
                style={{ gap: `${rowGap}px` }}
              >
                {HOME_HUB_TREATMENT_ROWS.map((row) => (
                  <a
                    key={row.slug}
                    href={row.href}
                    data-testid={
                      row.slug === 'emagrecimento' ? 'home-primary-cta' : `home-hero-card-${row.slug}`
                    }
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
                    <ChevronRightIcon
                      className="h-5 w-5 shrink-0 text-[#0a0a0a]"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </a>
                ))}
              </div>
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
      </section>
      <MedviTrustMarquee variant="bordered" />
    </>
  );
}
