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
    h1: 'Emagrecimento com avaliação médica, plano claro e acompanhamento contínuo.',
    sub:
      'Triagem online, avaliação médica quando indicada e acompanhamento contínuo para seguir com mais clareza, segurança e constância.',
  },
} as const;

const HERO_BULLETS = [
  'Triagem rápida para entender histórico, rotina e objetivos.',
  'Conduta individual com próximos passos objetivos.',
  'Suporte oficial no WhatsApp para manter aderência e clareza.',
  'A decisão clínica só acontece quando o caso pede avaliação médica.',
] as const;

const HERO_MOSAIC = [
  {
    src: '/images/emagrecimento/medvi/reviews-06.webp',
    alt: 'Paciente sorrindo durante acompanhamento',
    className: 'md:col-span-2 md:row-span-2 md:aspect-[0.68] aspect-[4/5]',
  },
  {
    src: '/images/emagrecimento/medvi/hero-main.webp',
    alt: 'Paciente em retrato editorial do programa',
    className: 'md:col-span-2 md:aspect-[4/5] aspect-[4/3]',
  },
  {
    src: '/images/emagrecimento/medvi/hero-secondary.webp',
    alt: 'Paciente em acompanhamento de rotina',
    className: 'md:col-span-2 md:aspect-[4/5] aspect-[4/3]',
  },
  {
    src: '/images/emagrecimento/medvi/reviews-07.webp',
    alt: 'Paciente sorrindo em retrato editorial',
    className: 'md:col-span-2 md:row-span-2 md:aspect-[0.68] aspect-[4/5]',
  },
  {
    src: '/images/emagrecimento/medvi/reviews-04.avif',
    alt: 'Paciente em jornada de transformação',
    className: 'col-span-2 md:col-span-4 md:aspect-[1.55] aspect-[16/10]',
  },
] as const;

type HeroVariant = keyof typeof COPY;

export function HeroSectionObesidade({ variant = 'default' }: { variant?: HeroVariant }) {
  const page = useLandingPageKey();
  const { h1, sub } = COPY[variant];

  const emagrecimentoHeadline = (
    <>
      Emagrecimento com
      <span className="text-emerald-700"> avaliação médica</span>,
      <br className="sm:hidden" />
      <span className="text-emerald-700"> plano claro</span> e suporte contínuo.
    </>
  );
  const emagrecimentoSubMobile = 'Triagem rápida e orientação segura para entender o próximo passo com clareza.';

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

  if (variant !== 'emagrecimento') {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-white pt-20 sm:pt-24">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">{h1}</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-700 sm:text-xl">{sub}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="programa"
      data-home-section="hero"
      data-testid="home-medvi-hero"
      className="relative overflow-hidden bg-gradient-to-b from-[#f4fbf7] via-white to-white pt-28 sm:pt-40"
    >
      <div
        className="relative mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20"
        data-testid="emagrecimento-hero"
      >
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex rounded-full border border-emerald-200 bg-[#eff8f2] px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-emerald-900 sm:px-5 sm:py-2 sm:text-xs sm:uppercase sm:tracking-[0.2em]">
            <span className="sm:hidden">100% online com avaliação médica</span>
            <span className="hidden sm:inline">Programa 100% online com avaliação médica</span>
          </div>

          <div className="mt-4 sm:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Clareza, privacidade e acompanhamento oficial.
            </p>
          </div>

          <div className="mt-6 hidden items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-sm ring-1 ring-emerald-100 sm:inline-flex">
            <Image
              src="/images/emagrecimento/medvi/social-proof-rating.webp"
              alt="Faixa de prova social do programa"
              width={82}
              height={10}
              className="h-3 w-auto"
            />
            <span className="text-xs font-semibold text-slate-600 sm:text-sm">
              <span className="sm:hidden">Clareza, privacidade e acompanhamento oficial.</span>
              <span className="hidden sm:inline">Conduta organizada com clareza, privacidade e acompanhamento oficial.</span>
            </span>
          </div>

          <h1 className="mt-5 px-1 text-[2.2rem] font-bold leading-[0.92] tracking-[-0.055em] text-slate-950 sm:mt-8 sm:px-2 sm:text-6xl sm:leading-[0.95] sm:tracking-[-0.05em] md:text-7xl lg:text-[5.25rem]">
            {emagrecimentoHeadline}
          </h1>

          <div className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:hidden">
            <a
              href="/triagem/emagrecimento"
              onClick={handlePrimaryCta}
              className="inline-flex w-full max-w-md items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_24px_60px_rgba(5,150,105,0.26)] transition-all duration-300"
            >
              Começar minha triagem
            </a>

            <p className="w-full max-w-md rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-2.5 text-[11px] font-medium leading-relaxed text-emerald-950 shadow-sm">
              Consulte a faixa do programa após a triagem e a avaliação médica.
            </p>
          </div>

          <p className="mx-auto mt-4 max-w-3xl px-2 text-sm leading-relaxed text-slate-600 sm:hidden">
            {emagrecimentoSubMobile}
          </p>

          <p className="mx-auto mt-5 hidden max-w-3xl px-2 text-base leading-relaxed text-slate-600 sm:mt-6 sm:block sm:text-xl md:text-[1.45rem]">
            {sub}
          </p>

          <ul className="mx-auto mt-5 grid max-w-4xl gap-2.5 text-left sm:mt-8 sm:gap-4 sm:grid-cols-2">
            {HERO_BULLETS.map((item, index) => (
              <li
                key={item}
                className={cn(
                  'items-start gap-3 rounded-2xl border border-emerald-100 bg-white/88 px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:py-4',
                  index > 1 ? 'hidden sm:flex' : 'flex'
                )}
              >
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white">
                  ✓
                </span>
                <span className="text-sm font-medium leading-relaxed text-slate-700">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 hidden flex-col items-center justify-center gap-3 sm:mt-8 sm:flex sm:gap-4">
            <a
              href="/triagem/emagrecimento"
              onClick={handlePrimaryCta}
              data-testid="home-primary-cta"
              className={cn(
                'inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-bold text-white shadow-[0_24px_60px_rgba(5,150,105,0.26)] transition-all duration-300 sm:px-14 sm:py-5 sm:text-lg',
                'bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:scale-[1.02] hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900'
              )}
            >
              Começar minha triagem
            </a>

            <a
              href="#como-funciona"
              onClick={handleSecondaryCta}
              className="hidden text-sm font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-900 sm:inline"
            >
              Entender como funciona
            </a>
          </div>

          <p className="mx-auto mt-5 hidden max-w-3xl rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-xs font-medium leading-relaxed text-emerald-950 shadow-sm sm:block sm:text-base">
            {getLpPriceHook()}
          </p>

          <p className="mx-auto mt-4 hidden max-w-3xl px-2 text-xs leading-relaxed text-slate-500 sm:block sm:text-sm">
            Prescrição somente quando indicada em consulta médica. Dados de saúde tratados com boas práticas de
            privacidade e fluxo adequado ao contexto brasileiro.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 md:mt-12 md:grid-cols-8 md:gap-5" data-testid="emagrecimento-hero-mosaic">
          {HERO_MOSAIC.map((image) => (
            <div
              key={image.src}
              className={cn(
                'relative overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] ring-1 ring-emerald-100/60',
                image.className
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 20vw"
                quality={88}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
