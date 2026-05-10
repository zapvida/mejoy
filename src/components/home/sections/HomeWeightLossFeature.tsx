'use client';

import Image from 'next/image';

import { track } from '@/lib/analytics';
import { HOME_HUB_GLP } from '@/lib/home-hub-assets';
import { MEDVI_HOME } from '@/lib/medvi-parity-tokens';

/**
 * Bloco “Doctor-guided GLP-1” — espelho de home.medvi.org (duas colunas + mini-grid).
 */
export function HomeWeightLossFeature() {
  const r = MEDVI_HOME.glpImageRadiusPx;
  const mint = MEDVI_HOME.glpMintPanelBg;
  const blockR = MEDVI_HOME.glpBlockRadiusPx;

  const handleCta = () => {
    track('cta_click', { page: 'home', position: 'weight_loss_feature', section: 'home_glp_feature' });
  };

  return (
    <section
      className="bg-white py-14 sm:py-16 md:py-[4.5rem]"
      data-home-section="weight_loss_feature"
      aria-labelledby="home-glp-heading"
    >
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-16">
          <div className="relative mx-auto w-full max-w-[480px] md:max-w-none">
            <div
              className="relative overflow-hidden pt-6 pb-6 pl-4 pr-4 sm:pt-8 sm:pb-8"
              style={{
                borderRadius: blockR,
                backgroundColor: mint,
              }}
            >
              <div
                className="relative mx-auto aspect-square max-h-[420px] w-full max-w-[380px] sm:max-h-[460px]"
                style={{ borderRadius: r }}
              >
                <Image
                  src={HOME_HUB_GLP.mainImage}
                  alt="Tratamento com apoio médico"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800 sm:text-xs">
              Programa MeJoy de emagrecimento
            </p>
            <h2
              id="home-glp-heading"
              className="mt-3 text-[1.65rem] font-bold leading-[1.1] tracking-[-0.035em] text-slate-950 sm:text-4xl md:text-[2.35rem]"
            >
              Emagrecimento com mais{' '}
              <span style={{ color: MEDVI_HOME.headlineHighlightGreen }}>clareza, cuidado e continuidade</span>
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-[16px]">
              Você começa entendendo seu perfil, vê o que faz sentido para o seu caso e só então decide como avançar.
              Quando houver indicação, a avaliação médica entra com contexto e critério.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
              <div
                className="relative aspect-[4/5] w-full overflow-hidden"
                style={{ borderRadius: r }}
              >
                <Image
                  src={HOME_HUB_GLP.thumbA}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 45vw, 200px"
                />
              </div>
              <div
                className="relative aspect-[4/5] w-full overflow-hidden"
                style={{ borderRadius: r }}
              >
                <Image
                  src={HOME_HUB_GLP.thumbB}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 45vw, 200px"
                />
              </div>
            </div>
            <a
              href="/emagrecimento"
              onClick={handleCta}
              className="mt-6 inline-flex text-sm font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 transition hover:text-emerald-900"
            >
              Entender o programa completo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
