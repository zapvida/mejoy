'use client';

import Image from 'next/image';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { getLpPriceHook } from '@/lib/emagrecimento/launchPricing';

const proofBullets = [
  'Triagem online para entender historico, rotina e objetivos.',
  'Avaliacao medica quando indicada, com conduta objetiva.',
  'Suporte oficial para seguir com mais clareza e constancia.',
  'Privacidade e fluxo adequados ao contexto brasileiro.',
] as const;

const quickProof = [
  { label: 'Avaliacao medica', value: 'Quando indicada' },
  { label: 'Suporte oficial', value: 'Mesmo fluxo' },
] as const;

const heroMosaic = [
  {
    src: '/images/emagrecimento/medvi/avatar-chris.webp',
    alt: 'Paciente em retrato editorial',
    className: 'aspect-[4/5] lg:row-span-2',
  },
  {
    src: '/images/emagrecimento/medvi/avatar-melissa.webp',
    alt: 'Paciente sorrindo em acompanhamento',
    className: 'aspect-[4/4]',
  },
  {
    src: '/images/emagrecimento/medvi/reviews-03.avif',
    alt: 'Paciente em programa de emagrecimento',
    className: 'aspect-[4/5] lg:row-span-2',
  },
  {
    src: '/images/emagrecimento/medvi/avatar-sandra.webp',
    alt: 'Paciente em retrato principal da jornada Me Joy',
    className: 'aspect-[4/4]',
  },
  {
    src: '/images/emagrecimento/medvi/avatar-terri.webp',
    alt: 'Paciente em etapa de acompanhamento',
    className: 'col-span-2 aspect-[16/8] lg:col-span-2',
  },
  {
    src: '/images/emagrecimento/medvi/reviews-06.webp',
    alt: 'Paciente celebrando resultado de acompanhamento',
    className: 'aspect-[4/4]',
  },
] as const;

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
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(219,247,233,0.86),_rgba(250,253,251,0.98)_42%,_#ffffff_78%)] pt-28 sm:pt-32 lg:pt-36"
    >
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[linear-gradient(180deg,rgba(4,120,87,0.04),rgba(255,255,255,0))]" />
      <div className="absolute left-[-8rem] top-24 h-52 w-52 rounded-full bg-emerald-100/65 blur-3xl sm:h-72 sm:w-72" />
      <div className="absolute right-[-7rem] top-16 h-56 w-56 rounded-full bg-lime-100/55 blur-3xl sm:h-72 sm:w-72" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8" data-testid="emagrecimento-hero">
        <div className="pb-12 lg:pb-16">
          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex rounded-full border border-emerald-200 bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800 shadow-sm sm:text-[11px] sm:tracking-[0.22em]">
                Programa 100% online com avaliacao medica
              </span>
              <span className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm sm:inline-flex">
                <span className="relative h-3 w-20 overflow-hidden">
                  <Image
                    src="/images/emagrecimento/medvi/social-proof-rating.webp"
                    alt="Avaliacoes positivas do programa"
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </span>
                Clareza, privacidade e suporte oficial.
              </span>
            </div>

            <p className="mt-6 hidden text-[13px] font-medium text-slate-700 sm:mt-7 sm:block sm:text-lg">
              Comece com uma triagem clara. A conduta vem depois, com criterio clinico.
            </p>

            <h1 className="mx-auto mt-7 max-w-4xl text-[2.15rem] font-black leading-[0.96] tracking-[-0.06em] text-slate-950 sm:mt-5 sm:text-5xl sm:leading-[0.94] lg:text-[4.35rem]">
              Emagrecimento com <span className="text-emerald-700">avaliacao medica</span>, mais clareza e menos tentativa no escuro.
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-[13px] leading-6 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
              Triagem online, avaliacao medica quando indicada e acompanhamento continuo para seguir com mais seguranca,
              contexto e constancia no Brasil.
            </p>

            <div className="mt-5 flex flex-col items-center gap-3 sm:hidden">
              <a
                href="/triagem/emagrecimento"
                onClick={handlePrimaryCta}
                data-testid="home-primary-cta"
                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 px-7 text-base font-bold text-white shadow-[0_22px_48px_rgba(5,150,105,0.26)] transition-all hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(5,150,105,0.3)]"
              >
                Fazer minha triagem
              </a>
              <p className="max-w-xl rounded-full border border-emerald-100 bg-white/92 px-5 py-3 text-center text-[11px] font-medium leading-relaxed text-emerald-950 shadow-sm">
                {getLpPriceHook()}
              </p>
            </div>

            <ul className="mx-auto mt-7 grid max-w-2xl gap-3 text-left sm:mt-8">
              {proofBullets.map((item, index) => (
                <li
                  key={item}
                  className={`items-start gap-3 rounded-full border border-emerald-100 bg-white/84 px-4 py-3 shadow-sm backdrop-blur sm:px-5 ${
                    index >= 2 ? 'hidden sm:flex' : 'flex'
                  }`}
                >
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d1ad69] text-[10px] font-black text-white">
                    ✓
                  </span>
                  <span className="text-sm leading-6 text-slate-700 sm:text-[15px]">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 hidden flex-col items-center gap-3 sm:mt-7 sm:flex">
              <a
                href="/triagem/emagrecimento"
                onClick={handlePrimaryCta}
                data-testid="home-primary-cta"
                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 px-7 text-base font-bold text-white shadow-[0_22px_48px_rgba(5,150,105,0.26)] transition-all hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(5,150,105,0.3)] sm:h-16 sm:px-8 sm:text-lg"
              >
                Fazer minha triagem
              </a>
              <p className="max-w-xl rounded-full border border-emerald-100 bg-white/92 px-5 py-3 text-center text-[11px] font-medium leading-relaxed text-emerald-950 shadow-sm sm:text-sm">
                {getLpPriceHook()}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2.5 sm:mt-6">
              {quickProof.map((item) => (
                <span
                  key={item.label}
                  className="rounded-full border border-emerald-100 bg-white/86 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700 shadow-sm sm:text-xs"
                >
                  <span className="text-emerald-700">{item.label}:</span> {item.value}
                </span>
              ))}
            </div>

            <p className="mx-auto mt-5 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm">
              Prescricao e escolha da trilha dependem de avaliacao medica individual, disponibilidade e criterio clinico.
            </p>
          </div>

          <div className="relative mx-auto mt-10 max-w-6xl lg:mt-12">
            <div className="absolute inset-x-8 top-16 h-72 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {heroMosaic.map((image) => (
                <div
                  key={image.src}
                  className={`relative overflow-hidden rounded-[28px] border border-white/90 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] ${image.className}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 22vw"
                    priority
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
