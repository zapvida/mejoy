'use client';

import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { MedviTrustMarquee } from '@/components/medvi/MedviTrustMarquee';
import { HeroProofPhoto } from '@/components/zapfarm/obesidade/HeroProofPhoto';
import { EMAGRECIMENTO_LP } from '@/lib/emagrecimento-lp-assets';
import { MEDVI_GLP } from '@/lib/medvi-parity-tokens';

const proofBullets = [
  'Triagem em poucos minutos para entender seu perfil antes de decidir.',
  'Avaliação médica com CRM quando houver indicação clínica.',
  'Plano com próximos passos claros, sem promessa automática de prescrição.',
  'Acompanhamento pelo app e WhatsApp oficial para manter consistência.',
  'Valores e etapas apresentados com transparência durante a jornada.',
] as const;

const heroPhotos = EMAGRECIMENTO_LP.hero;

const photoR = MEDVI_GLP.heroProofPhotoRadiusPx;
const photoMax = MEDVI_GLP.heroProofPhotoMaxPx;

/** Hero GLP — paridade glp.medvi.org: CTA, 3 retratos alinhados em retângulos com arco moderado, faixa ticker. */
export function HeroSectionObesidade({ variant = 'emagrecimento' }: { variant?: string }) {
  const page = useLandingPageKey();
  const isEmagrecimentoLp = variant === 'emagrecimento';

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
        className={
          isEmagrecimentoLp
            ? // padding-top alinhado a MEDVI_GLP.heroPaddingTop{Base,Sm,Lg}rem (header fixo sem faixa promo)
              'relative overflow-x-hidden overflow-y-visible pt-[4.75rem] sm:pt-[5rem] lg:pt-[5.25rem]'
            : 'relative overflow-x-hidden overflow-y-visible pt-[4.75rem] sm:pt-[5.25rem] lg:pt-[5.75rem]'
        }
        style={{ backgroundColor: MEDVI_GLP.pageBg }}
      >
        <div className="container relative mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8" data-testid="emagrecimento-hero">
          <div className="mx-auto max-w-xl pb-6 text-center sm:max-w-2xl md:pb-8">
            <p
              className="text-[14px] font-medium leading-5 sm:text-[15px] sm:leading-[22px]"
              style={{ color: MEDVI_GLP.subheadGray }}
            >
              Emagrecimento online com avaliação médica quando indicada
            </p>

            <h1
              className="mx-auto mt-4 max-w-[36rem] text-[1.625rem] font-bold leading-[1.18] tracking-[-0.02em] sm:mt-5 sm:text-[2.05rem] sm:leading-[1.14] md:text-[2.35rem] md:leading-[1.12]"
              style={{ color: MEDVI_GLP.charcoal }}
            >
              Emagreça com uma estratégia mais inteligente do que tentar de novo sozinho.
              <span style={{ color: MEDVI_GLP.sage }}> Comece entendendo seu caso.</span>
            </h1>

            <ul className="mx-auto mt-6 max-w-lg space-y-2.5 text-left sm:mt-8 sm:max-w-xl">
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
              Ver se sou elegível
            </a>
          </div>

          {/* Três retratos: gaps 8px / 12px (tokens heroProofRowGap*) — paridade glp.medvi.org */}
          <div className="mx-auto mt-2 flex w-full max-w-[min(26rem,calc(100%-0.5rem))] items-start justify-center gap-2 pb-6 sm:mt-1 sm:max-w-xl sm:gap-3 md:max-w-2xl md:pb-10">
            {heroPhotos.map((photo) => (
              <div key={photo.src} className="min-w-0 flex-1" style={{ maxWidth: photoMax }}>
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden shadow-md sm:shadow-lg"
                  style={{ borderRadius: photoR }}
                >
                  <HeroProofPhoto
                    src={photo.src}
                    alt={photo.alt}
                    sizes={`(max-width: 640px) 33vw, ${photoMax}px`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Sentinela para CTA móvel: evita cálculo por offsetTop (muda com fonte/imagem e oscila). */}
        <span
          data-sticky-hero-sentinel
          aria-hidden
          className="pointer-events-none absolute bottom-[1px] left-0 right-0 block h-px w-full opacity-0"
        />
      </section>
      <MedviTrustMarquee variant="bordered" />
    </>
  );
}
