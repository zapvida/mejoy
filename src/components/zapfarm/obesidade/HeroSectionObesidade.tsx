'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { getLpPriceHook } from '@/lib/emagrecimento/launchPricing';

const COPY = {
  default: {
    h1: 'Comece sua jornada de bem-estar hoje',
    sub: 'Plano personalizado com avaliação clínica e acompanhamento contínuo.',
  },
  emagrecimento: {
    h1: 'Emagreça com estratégia clínica individual e suporte contínuo',
    sub:
      'Triagem inteligente, avaliação com médico e acompanhamento diário para transformar consistência em resultado sustentável.',
  },
} as const;

type HeroVariant = keyof typeof COPY;

export function HeroSectionObesidade({ variant = 'default' }: { variant?: HeroVariant }) {
  const page = useLandingPageKey();
  const { h1, sub } = COPY[variant];

  const emagrecimentoHeadline = (
    <>
      Emagrecimento com
      <span className="text-emerald-700"> avaliação médica</span>,
      <span className="text-emerald-700"> plano personalizado</span> e
      <span className="text-emerald-700"> suporte contínuo.</span>
    </>
  );

  const handlePrimaryCta = () => {
    track('hero_primary_cta_click', {
      page,
      position: 'hero',
      section: 'hero',
    });
  };

  const handleSecondaryCta = () => {
    track('hero_secondary_cta_click', {
      page,
      position: 'hero',
      section: 'hero_secondary',
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-white pt-20 sm:pt-24">
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 text-center lg:text-left space-y-6 sm:space-y-8 w-full lg:w-auto">
            {variant === 'emagrecimento' && (
              <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-emerald-800">
                Programa 100% online com avaliação médica
              </div>
            )}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight px-2">
                {variant === 'emagrecimento' ? emagrecimentoHeadline : h1}
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2">
                {sub}
              </p>

              {variant === 'emagrecimento' && (
                <ul className="mx-auto max-w-2xl space-y-2 px-2 text-left lg:mx-0">
                  {[
                    'Triagem guiada para mapear histórico, rotina e objetivos',
                    'Decisão clínica individualizada, sem promessa milagrosa',
                    'Acompanhamento com metas práticas para manter aderência',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm sm:text-base text-slate-700">
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {variant === 'emagrecimento' && (
                <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto lg:mx-0 px-3 py-3 rounded-xl border border-emerald-100 bg-emerald-50/60">
                  {getLpPriceHook()}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start px-2">
              <div className="relative inline-flex w-full sm:w-auto">
                <a
                  href="/triagem/emagrecimento"
                  onClick={handlePrimaryCta}
                  className={cn(
                    'relative inline-flex items-center justify-center z-10',
                    'h-14 sm:h-16 px-8 sm:px-10 md:px-12',
                    'text-base sm:text-lg md:text-xl font-bold text-white',
                    'rounded-full transition-all duration-300',
                    'bg-emerald-600 hover:bg-emerald-700 shadow-[0_20px_50px_rgba(5,150,105,0.28)]',
                    'hover:scale-105 active:scale-100',
                    'w-full sm:w-auto'
                  )}
                >
                  <span className="relative z-10 drop-shadow-md">Fazer triagem de elegibilidade</span>
                </a>
              </div>

              {variant === 'emagrecimento' && (
                <a
                  href="#como-funciona"
                  onClick={handleSecondaryCta}
                  className={cn(
                    'inline-flex items-center justify-center',
                    'h-14 sm:h-16 px-8 sm:px-10',
                    'text-base sm:text-lg font-bold text-emerald-800',
                    'rounded-full border-2 border-emerald-200 bg-white',
                    'hover:bg-emerald-50 transition-colors',
                    'w-full sm:w-auto'
                  )}
                >
                  Entender como funciona
                </a>
              )}
            </div>

            {variant === 'emagrecimento' && (
              <p className="px-2 text-xs sm:text-sm text-slate-500">
                Prescrição somente quando indicada em consulta médica. Dados tratados com boas práticas de privacidade.
              </p>
            )}
          </div>

          <div className="flex-1 relative w-full max-w-lg mx-auto lg:mx-0 flex items-center justify-center">
            <div className="relative w-full max-w-xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(15,23,42,0.16)] ring-1 ring-emerald-100">
                <Image
                  src="/images/emagrecimento/medvi/hero-main.webp"
                  alt="Paciente em consulta para programa de emagrecimento com acompanhamento profissional"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={88}
                />
              </div>

              <div className="absolute -bottom-5 -left-3 w-40 sm:w-52 md:w-56 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-2xl">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/images/emagrecimento/medvi/hero-secondary.webp"
                    alt="Acompanhamento contínuo para manutenção de resultados"
                    fill
                    className="object-cover"
                    sizes="220px"
                    quality={85}
                  />
                </div>
              </div>

              <div className="absolute -top-4 right-2 sm:right-0 rounded-2xl border border-emerald-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-emerald-700">
                  Fluxo completo
                </p>
                <p className="text-sm font-semibold text-slate-900">Triagem → Consulta → Acompanhamento</p>
              </div>

              <div className="absolute bottom-3 right-2 sm:right-0 rounded-full border border-white/70 bg-white/95 px-4 py-2 shadow-xl">
                <p className="text-xs font-bold text-slate-900">Suporte oficial no WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
