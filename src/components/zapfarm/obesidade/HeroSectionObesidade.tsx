'use client';

import Image from 'next/image';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { getLpPriceHook } from '@/lib/emagrecimento/launchPricing';
import { MEDVI_GLP } from '@/lib/medvi-parity-tokens';

const proofBullets = [
  'Evolução de composição corporal com acompanhamento médico contínuo.',
  'Garantia Me Joy no programa — suporte oficial no mesmo fluxo.',
  'Sem mensalidade escondida: o essencial incluso na jornada apresentada.',
  'Comece pela triagem: valores e conduta após avaliação individual no Brasil.',
  'Pagamento com opções transparentes (cartões nas etapas autorizadas).',
] as const;

const heroPhotos = [
  { src: '/images/emagrecimento/medvi/reviews-01.webp', alt: 'Paciente no programa de emagrecimento' },
  { src: '/images/emagrecimento/medvi/avatar-melissa.webp', alt: 'Paciente sorrindo em acompanhamento' },
  { src: '/images/emagrecimento/medvi/reviews-03.avif', alt: 'Paciente em jornada de saúde' },
] as const;

/** Primeiro frame estilo glp.medvi.org — baseline 14px / 20px, CTA sage, 3 retratos em escada. */
export function HeroSectionObesidade({ variant = 'emagrecimento' }: { variant?: string }) {
  const page = useLandingPageKey();

  const handlePrimaryCta = () => {
    track('cta_click', {
      page,
      position: 'hero_primary',
      section: 'hero_section',
      variant,
    });
  };

  return (
    <section
      id="programa"
      data-home-section="hero"
      data-testid="home-medvi-hero"
      className="relative overflow-hidden pt-[7rem] sm:pt-[7.75rem] lg:pt-[8.25rem]"
      style={{ backgroundColor: MEDVI_GLP.pageBg }}
    >
      <div className="container relative mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8" data-testid="emagrecimento-hero">
        <div className="mx-auto max-w-xl pb-9 text-center sm:max-w-2xl md:pb-11">
          <p
            className="text-[14px] font-medium leading-5 sm:text-[15px] sm:leading-[22px]"
            style={{ color: MEDVI_GLP.subheadGray }}
          >
            Junte-se a milhares de pacientes Me Joy em telemedicina
          </p>

          <h1
            className="mx-auto mt-5 max-w-[36rem] text-[1.625rem] font-bold leading-[1.18] tracking-[-0.02em] sm:mt-5 sm:text-[2.125rem] sm:leading-[1.14] md:text-[2.375rem] md:leading-[1.12]"
            style={{ color: MEDVI_GLP.charcoal }}
          >
            Sério com emagrecimento? Nós também. Perda de gordura{' '}
            <span style={{ color: MEDVI_GLP.sage }}>com mais clareza</span> com cuidado personalizado e critério médico.
          </h1>

          <ul className="mx-auto mt-8 max-w-lg space-y-3 text-left sm:mt-9 sm:max-w-xl">
            {proofBullets.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="mt-0.5 inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: MEDVI_GLP.checkGold }}
                >
                  ✓
                </span>
                <span
                  className="text-[14px] font-normal leading-5 sm:text-[15px] sm:leading-[22px]"
                  style={{ color: MEDVI_GLP.charcoalSoft }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <a
            href="/triagem/emagrecimento"
            onClick={handlePrimaryCta}
            data-testid="home-primary-cta"
            className="mt-9 flex w-full items-center justify-center rounded-full text-center text-[13px] font-bold uppercase tracking-[0.045em] text-white shadow-lg transition hover:opacity-95 sm:mt-10 sm:text-sm"
            style={{
              backgroundColor: MEDVI_GLP.sage,
              minHeight: MEDVI_GLP.ctaHeightPx,
              boxShadow: '0 14px 36px rgba(109,132,114,0.35)',
            }}
          >
            Sou elegível?
          </a>

          <p
            className="mx-auto mt-4 max-w-lg text-[12px] font-normal leading-5 sm:text-[13px] sm:leading-[1.5]"
            style={{ color: MEDVI_GLP.subheadGray }}
          >
            {getLpPriceHook()}
          </p>
        </div>

        <div className="relative mx-auto flex max-w-lg items-end justify-center gap-2 pb-6 sm:max-w-[34rem] sm:gap-3 md:pb-10">
          <div className="relative w-[30%] max-w-[138px] -translate-y-2 sm:-translate-y-3">
            <div
              className="relative aspect-[3/4] overflow-hidden shadow-lg sm:shadow-xl"
              style={{ borderRadius: MEDVI_GLP.photoRadiusPx }}
            >
              <Image
                src={heroPhotos[0].src}
                alt={heroPhotos[0].alt}
                fill
                className="object-cover"
                sizes="140px"
                priority
              />
            </div>
          </div>
          <div className="relative z-10 w-[32%] max-w-[148px] translate-y-3 sm:translate-y-4">
            <div
              className="relative aspect-[3/4] overflow-hidden shadow-xl"
              style={{ borderRadius: MEDVI_GLP.photoRadiusPx }}
            >
              <Image
                src={heroPhotos[1].src}
                alt={heroPhotos[1].alt}
                fill
                className="object-cover"
                sizes="148px"
                priority
              />
            </div>
          </div>
          <div className="relative w-[30%] max-w-[138px] -translate-y-7 sm:-translate-y-9">
            <div
              className="relative aspect-[3/4] overflow-hidden shadow-lg sm:shadow-xl"
              style={{ borderRadius: MEDVI_GLP.photoRadiusPx }}
            >
              <Image
                src={heroPhotos[2].src}
                alt={heroPhotos[2].alt}
                fill
                className="object-cover"
                sizes="140px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
