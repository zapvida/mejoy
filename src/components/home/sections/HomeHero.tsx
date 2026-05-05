'use client';

import Image from 'next/image';

import { ChevronRightIcon } from '@heroicons/react/24/outline';

import { MedviTrustMarquee } from '@/components/medvi/MedviTrustMarquee';
import { track } from '@/lib/analytics';
import { MEDVI_HOME } from '@/lib/medvi-parity-tokens';

const TREATMENT_ROWS = [
  {
    slug: 'emagrecimento',
    title: 'Emagrecimento',
    href: '/emagrecimento',
    image: '/images/emagrecimento/medvi/treatment-injetavel.webp',
    pad: 'bg-emerald-100/95',
  },
  {
    slug: 'sono',
    title: 'Sono & recuperação',
    href: '/triagem/sono',
    image: '/images/emagrecimento/medvi/metabolism-habits.avif',
    pad: 'bg-sky-100/90',
  },
  {
    slug: 'articulacoes',
    title: 'Articulações',
    href: '/triagem/articulacoes',
    image: '/images/emagrecimento/medvi/journey-consulta.avif',
    pad: 'bg-amber-100/85',
  },
  {
    slug: 'cabelo',
    title: 'Cabelo & pele',
    href: '/triagem/cabelo',
    image: '/images/emagrecimento/medvi/treatment-comprimidos.avif',
    pad: 'bg-violet-100/80',
  },
] as const;

/** Primeiro frame estilo home.medvi.org — gradiente verde, destaque mint, carrossel horizontal, faixa branca. */
export function HomeHero() {
  const handlePrimary = () => {
    track('cta_click', { page: 'home', position: 'hero', section: 'home_hero' });
  };

  const handleCard = (slug: string) => {
    track('cta_click', {
      page: 'home',
      position: 'treatment_card',
      section: 'home_hero_carousel',
      treatment: slug,
    });
  };

  return (
    <>
      <section
        className="relative overflow-x-hidden pb-8 pt-[5.25rem] text-white sm:pb-10 sm:pt-[5.75rem] md:pt-24"
        style={{ background: MEDVI_HOME.heroGradient }}
        data-testid="home-hub-hero"
        data-home-section="hero"
      >
        <div className="container relative z-10 mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[34rem] text-center md:max-w-[42rem]">
            <p
              className="text-[14px] font-medium leading-5 sm:text-[15px] sm:leading-[22px]"
              style={{ color: MEDVI_HOME.heroTextMuted }}
            >
              Junte-se a milhares de pacientes Me Joy em telemedicina no Brasil
            </p>
            <h1 className="mt-5 text-[1.75rem] font-bold leading-[1.12] tracking-[-0.03em] sm:mt-6 sm:text-[2.125rem] sm:leading-[1.1] md:text-[2.75rem] md:leading-[1.08]">
              Cuide da sua saúde com telemedicina{' '}
              <span style={{ color: MEDVI_HOME.mintAccent }}>redefinida</span> para a vida real.
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

          <div
            className="relative z-20 mx-auto mt-10 w-full max-w-[1000px] -translate-y-6 sm:mt-12 md:-translate-y-8"
            data-testid="home-hero-carousel"
          >
            <div className="flex w-full max-w-full gap-3 overflow-x-auto overflow-y-visible px-0 pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory md:mx-0 md:justify-center md:overflow-x-visible md:px-0 md:pb-6 [&::-webkit-scrollbar]:hidden">
              {TREATMENT_ROWS.map((row) => (
                <a
                  key={row.slug}
                  href={row.href}
                  onClick={() => handleCard(row.slug)}
                  className="flex w-[min(228px,calc(100vw-3rem))] shrink-0 snap-center flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_20px_55px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_64px_rgba(0,0,0,0.18)] sm:w-[228px]"
                  style={{ borderRadius: MEDVI_HOME.cardRadius, boxShadow: MEDVI_HOME.cardShadow }}
                >
                  <div
                    className={`flex h-[120px] items-center justify-center px-3 pt-3 ${row.pad}`}
                    style={{ minHeight: MEDVI_HOME.cardImageH }}
                  >
                    <div className="relative h-[96px] w-full max-w-[180px] overflow-hidden rounded-xl bg-white/40">
                      <Image
                        src={row.image}
                        alt={row.title}
                        fill
                        className="object-cover"
                        sizes="180px"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-4 py-3.5">
                    <span className="text-left text-[14px] font-semibold leading-snug text-[#111827] sm:text-[15px]">
                      {row.title}
                    </span>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-[#111827]" strokeWidth={2} aria-hidden />
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
