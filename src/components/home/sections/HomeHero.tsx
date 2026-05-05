'use client';

import Image from 'next/image';

import { ChevronRightIcon } from '@heroicons/react/24/outline';

import { track } from '@/lib/analytics';
import { MEDVI_HOME } from '@/lib/medvi-parity-tokens';

const TREATMENT_ROWS = [
  {
    slug: 'emagrecimento',
    title: 'Emagrecimento & metabolismo',
    href: '/emagrecimento',
    image: '/images/emagrecimento/medvi/treatment-injetavel.webp',
  },
  {
    slug: 'sono',
    title: 'Sono & recuperação',
    href: '/triagem/sono',
    image: '/images/emagrecimento/medvi/metabolism-habits.avif',
  },
  {
    slug: 'articulacoes',
    title: 'Articulações & mobilidade',
    href: '/triagem/articulacoes',
    image: '/images/emagrecimento/medvi/journey-consulta.avif',
  },
  {
    slug: 'cabelo',
    title: 'Cabelo & couro cabeludo',
    href: '/triagem/cabelo',
    image: '/images/emagrecimento/medvi/treatment-comprimidos.avif',
  },
] as const;

/** Primeiro frame estilo home.medvi.org — verde full-bleed + cartão branco com linhas de serviço. */
export function HomeHero() {
  const handlePrimary = () => {
    track('cta_click', { page: 'home', position: 'hero', section: 'home_hero' });
  };

  const handleRow = (slug: string) => {
    track('cta_click', {
      page: 'home',
      position: 'treatment_row',
      section: 'home_hero_overlap',
      treatment: slug,
    });
  };

  return (
    <section
      className="relative pb-16 pt-[5.25rem] text-white sm:pb-[4.5rem] sm:pt-[5.75rem] md:pb-20 md:pt-24"
      style={{ backgroundColor: MEDVI_HOME.heroBg }}
      data-testid="home-hub-hero"
      data-home-section="hero"
    >
      <div className="container relative z-10 mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[34rem] text-center md:max-w-[40rem]">
          <p
            className="text-[14px] font-medium leading-5 sm:text-[15px] sm:leading-[22px]"
            style={{ color: MEDVI_HOME.heroTextMuted }}
          >
            Junte-se a milhares de pacientes Me Joy em telemedicina no Brasil
          </p>
          <h1 className="mt-5 text-[1.75rem] font-bold leading-[1.12] tracking-[-0.03em] sm:mt-6 sm:text-[2.125rem] sm:leading-[1.1] md:text-[2.75rem] md:leading-[1.08]">
            Cuide da sua saúde com telemedicina redefinida para a vida real.
          </h1>
          <p
            className="mx-auto mt-5 max-w-xl text-[15px] leading-6 sm:text-[16px] sm:leading-7"
            style={{ color: MEDVI_HOME.heroTextMuted }}
          >
            Atendimento médico online — simples, direto e conduzido por profissionais habilitados. Sem filas
            desnecessárias. Sem etapas em excesso. Só cuidado que funciona.
          </p>
          <a
            href="/triagem/emagrecimento"
            data-testid="home-primary-cta"
            onClick={handlePrimary}
            className="mt-7 inline-flex h-12 min-h-[48px] items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 text-[14px] font-semibold leading-none text-white backdrop-blur-sm transition hover:bg-white/20 sm:mt-8"
          >
            Começar minha triagem
          </a>
        </div>

        <div className="relative z-20 mx-auto max-w-[40rem] -translate-y-11 transform md:max-w-[48rem] md:-translate-y-12">
          <div
            className="rounded-t-[28px] bg-white px-1 pb-1.5 pt-1 sm:rounded-t-[36px] md:px-2"
            style={{ boxShadow: MEDVI_HOME.cardShadow }}
          >
            <div className="rounded-t-[24px] bg-white sm:rounded-t-[32px]">
              {TREATMENT_ROWS.map((row) => (
                <a
                  key={row.slug}
                  href={row.href}
                  onClick={() => handleRow(row.slug)}
                  className="flex min-h-[60px] items-center gap-3 border-b border-slate-100 px-3 py-3.5 last:border-b-0 sm:min-h-[68px] sm:gap-4 sm:px-5 sm:py-4"
                >
                  <div
                    className="relative shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:rounded-[16px]"
                    style={{ width: MEDVI_HOME.rowImage, height: MEDVI_HOME.rowImage }}
                  >
                    <Image src={row.image} alt={row.title} fill className="object-cover" sizes="72px" />
                  </div>
                  <span className="min-w-0 flex-1 text-left text-[15px] font-semibold leading-snug text-[#1f2937] sm:text-[16px]">
                    {row.title}
                  </span>
                  <ChevronRightIcon className="h-5 w-5 shrink-0 text-[#111827]" strokeWidth={2} aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent sm:h-28" />
    </section>
  );
}
