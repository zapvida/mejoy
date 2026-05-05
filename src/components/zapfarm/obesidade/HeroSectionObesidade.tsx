'use client';

import Image from 'next/image';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { MedviTrustMarquee } from '@/components/medvi/MedviTrustMarquee';
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

/** Hero GLP — checks simples (sem círculo), CTA, 3 fotos calibradas, faixa branca tipo MedVi. */
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
    <>
      <section
        id="programa"
        data-home-section="hero"
        data-testid="home-medvi-hero"
        className="relative overflow-hidden pt-[4.75rem] sm:pt-[5.25rem] lg:pt-[5.75rem]"
        style={{ backgroundColor: MEDVI_GLP.pageBg }}
      >
        <div className="container relative mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8" data-testid="emagrecimento-hero">
          <div className="mx-auto max-w-xl pb-7 text-center sm:max-w-2xl md:pb-9">
            <p
              className="text-[14px] font-medium leading-5 sm:text-[15px] sm:leading-[22px]"
              style={{ color: MEDVI_GLP.subheadGray }}
            >
              Junte-se a milhares de pacientes Me Joy em telemedicina
            </p>

            <h1
              className="mx-auto mt-5 max-w-[36rem] text-[1.625rem] font-bold leading-[1.18] tracking-[-0.02em] sm:mt-5 sm:text-[2.05rem] sm:leading-[1.14] md:text-[2.35rem] md:leading-[1.12]"
              style={{ color: MEDVI_GLP.charcoal }}
            >
              Sério com emagrecimento? Nós também. Perda de gordura{' '}
              <span style={{ color: MEDVI_GLP.sage }}>com mais clareza</span> com cuidado personalizado e critério médico.
            </h1>

            <ul className="mx-auto mt-7 max-w-lg space-y-2.5 text-left sm:mt-8 sm:max-w-xl">
              {proofBullets.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    className="mt-0.5 shrink-0 text-[15px] font-bold leading-none"
                    style={{ color: MEDVI_GLP.checkGold }}
                    aria-hidden
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
              className="mt-8 flex w-full items-center justify-center rounded-full text-center text-[13px] font-bold uppercase tracking-[0.045em] text-white shadow-lg transition hover:opacity-95 sm:mt-9 sm:text-sm"
              style={{
                backgroundColor: MEDVI_GLP.sage,
                minHeight: MEDVI_GLP.ctaHeightPx,
                boxShadow: '0 14px 36px rgba(112,136,105,0.38)',
              }}
            >
              Sou elegível?
            </a>
          </div>

          <div className="relative mx-auto flex max-w-[min(100%,22rem)] items-end justify-center gap-1.5 pb-5 sm:max-w-[21.5rem] sm:gap-2 md:pb-8">
            <div className="relative w-[30%] max-w-[100px] -translate-y-1.5 sm:max-w-[106px] sm:-translate-y-2">
              <div
                className="relative aspect-[3/4] overflow-hidden shadow-md sm:shadow-lg"
                style={{ borderRadius: MEDVI_GLP.photoRadiusPx }}
              >
                <Image
                  src={heroPhotos[0].src}
                  alt={heroPhotos[0].alt}
                  fill
                  className="object-cover"
                  sizes="106px"
                  priority
                />
              </div>
            </div>
            <div className="relative z-10 w-[34%] max-w-[112px] translate-y-2 sm:max-w-[118px] sm:translate-y-3">
              <div
                className="relative aspect-[3/4] overflow-hidden shadow-lg"
                style={{ borderRadius: MEDVI_GLP.photoRadiusPx }}
              >
                <Image
                  src={heroPhotos[1].src}
                  alt={heroPhotos[1].alt}
                  fill
                  className="object-cover"
                  sizes="118px"
                  priority
                />
              </div>
            </div>
            <div className="relative w-[30%] max-w-[100px] -translate-y-6 sm:max-w-[106px] sm:-translate-y-8">
              <div
                className="relative aspect-[3/4] overflow-hidden shadow-md sm:shadow-lg"
                style={{ borderRadius: MEDVI_GLP.photoRadiusPx }}
              >
                <Image
                  src={heroPhotos[2].src}
                  alt={heroPhotos[2].alt}
                  fill
                  className="object-cover"
                  sizes="106px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <MedviTrustMarquee variant="bordered" />
    </>
  );
}
