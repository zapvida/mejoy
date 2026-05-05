'use client';

import Image from 'next/image';

import { ChevronRightIcon } from '@heroicons/react/24/outline';

import { MedviTrustMarquee } from '@/components/medvi/MedviTrustMarquee';
import { track } from '@/lib/analytics';
import { MEDVI_HOME } from '@/lib/medvi-parity-tokens';

const TREATMENT_ROWS = [
  {
    slug: 'emagrecimento',
    title: 'Emagrecimento & metabolismo',
    href: '/emagrecimento',
    image: '/images/emagrecimento/medvi/treatment-injetavel.webp',
    pad: 'bg-emerald-100',
  },
  {
    slug: 'sono',
    title: 'Sono & recuperação',
    href: '/triagem/sono',
    image: '/images/emagrecimento/medvi/metabolism-habits.avif',
    pad: 'bg-sky-100',
  },
  {
    slug: 'articulacoes',
    title: 'Articulações & mobilidade',
    href: '/triagem/articulacoes',
    image: '/images/emagrecimento/medvi/journey-consulta.avif',
    pad: 'bg-amber-100',
  },
  {
    slug: 'cabelo',
    title: 'Cabelo & couro cabeludo',
    href: '/triagem/cabelo',
    image: '/images/emagrecimento/medvi/treatment-comprimidos.avif',
    pad: 'bg-violet-100',
  },
] as const;

/** home.medvi.org — hero verde, fila horizontal de cartões (imagem em cima, título + seta), faixa ticker. */
export function HomeHero() {
  const handlePrimary = () => {
    track('cta_click', { page: 'home', position: 'hero', section: 'home_hero' });
  };

  const handleRow = (slug: string) => {
    track('cta_click', {
      page: 'home',
      position: 'treatment_card',
      section: 'home_hero_cards',
      treatment: slug,
    });
  };

  const cardRadius = 22;
  const imageAspect = 'aspect-[4/3]';

  return (
    <>
      <section
        className="relative overflow-x-hidden pb-8 pt-[5.25rem] text-white sm:pb-10 sm:pt-[5.75rem] md:pb-12 md:pt-24"
        style={{ backgroundColor: MEDVI_HOME.heroBg }}
        data-testid="home-hub-hero"
        data-home-section="hero"
      >
        <div className="relative z-10 mx-auto w-full max-w-[min(1100px,calc(100%-2rem))] px-4 sm:px-5 md:px-8">
          <div className="mx-auto max-w-[520px] text-center md:max-w-3xl">
            <p
              className="text-[14px] font-medium leading-5 sm:text-[15px] sm:leading-[22px]"
              style={{ color: MEDVI_HOME.heroTextMuted }}
            >
              Saúde online com triagem inteligente e suporte oficial
            </p>
            <h1 className="mt-5 text-[1.75rem] font-bold leading-[1.12] tracking-[-0.03em] sm:mt-6 sm:text-[2rem] sm:leading-[1.1] md:text-[2.5rem] md:leading-[1.08]">
              O jeito mais simples de entender seu próximo passo em saúde.
            </h1>
            <p
              className="mx-auto mt-5 max-w-xl text-[15px] leading-6 sm:text-[16px] sm:leading-7"
              style={{ color: MEDVI_HOME.heroTextMuted }}
            >
              Comece por uma triagem rápida. A Me Joy organiza seu contexto, mostra caminhos possíveis e conecta você
              à avaliação médica quando fizer sentido.
            </p>
          </div>

          <div
            className="relative z-20 mx-auto mt-9 w-full max-w-[920px] md:mt-11"
            data-testid="home-hero-stack"
          >
            <div
              className={
                '-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pt-0.5 sm:-mx-0 sm:justify-center sm:overflow-visible sm:pb-0 sm:pt-0 ' +
                '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
              }
            >
              {TREATMENT_ROWS.map((row) => (
                <a
                  key={row.slug}
                  href={row.href}
                  onClick={() => handleRow(row.slug)}
                  className={
                    'snap-center shrink-0 overflow-hidden transition active:opacity-95 sm:snap-none ' +
                    'w-[148px] sm:w-[min(22.5%,168px)] md:w-[180px]'
                  }
                  style={{
                    borderRadius: cardRadius,
                    backgroundColor: MEDVI_HOME.stackCardBg,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
                  }}
                  data-testid={`home-hero-card-${row.slug}`}
                >
                  <div className={`relative w-full ${imageAspect} overflow-hidden ${row.pad}`}>
                    <Image src={row.image} alt={row.title} fill className="object-cover" sizes="180px" />
                  </div>
                  <div className="flex items-start gap-1.5 px-3 py-2.5 sm:px-3.5 sm:py-3">
                    <span className="min-w-0 flex-1 text-left text-[12px] font-semibold leading-snug tracking-[-0.01em] text-[#111827] sm:text-[13px] md:text-[14px]">
                      {row.title}
                    </span>
                    <ChevronRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#0a0a0a] sm:h-5 sm:w-5" strokeWidth={2} />
                  </div>
                </a>
              ))}
            </div>

            <a
              href="/triagem/emagrecimento"
              data-testid="home-primary-cta"
              onClick={handlePrimary}
              className="mx-auto mt-5 flex h-12 w-full max-w-md items-center justify-center rounded-[18px] border border-slate-200/80 bg-slate-50 text-[14px] font-semibold text-emerald-900 transition hover:bg-slate-100 sm:mt-6"
            >
              Fazer minha triagem agora
            </a>
          </div>
        </div>
      </section>
      <MedviTrustMarquee variant="bordered" />
    </>
  );
}
