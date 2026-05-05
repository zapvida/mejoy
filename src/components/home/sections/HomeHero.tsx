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

/** home.medvi.org — hero verde sólido, stack vertical num painel branco, thumbs 80×80, faixa ticker. */
export function HomeHero() {
  const handlePrimary = () => {
    track('cta_click', { page: 'home', position: 'hero', section: 'home_hero' });
  };

  const handleRow = (slug: string) => {
    track('cta_click', {
      page: 'home',
      position: 'treatment_row',
      section: 'home_hero_stack',
      treatment: slug,
    });
  };

  const thumbPx = MEDVI_HOME.stackThumbPx;
  const rowR = MEDVI_HOME.stackRowRadius;

  return (
    <>
      <section
        className="relative overflow-x-hidden pb-10 pt-[5.25rem] text-white sm:pb-12 sm:pt-[5.75rem] md:pb-14 md:pt-24"
        style={{ backgroundColor: MEDVI_HOME.heroBg }}
        data-testid="home-hub-hero"
        data-home-section="hero"
      >
        <div className="container relative z-10 mx-auto w-full max-w-[430px] px-4 sm:max-w-[480px] sm:px-5 md:max-w-[520px] md:px-6">
          <div className="mx-auto text-center">
            <p
              className="text-[14px] font-medium leading-5 sm:text-[15px] sm:leading-[22px]"
              style={{ color: MEDVI_HOME.heroTextMuted }}
            >
              Junte-se a milhares de pacientes Me Joy em telemedicina no Brasil
            </p>
            <h1 className="mt-5 text-[1.75rem] font-bold leading-[1.12] tracking-[-0.03em] sm:mt-6 sm:text-[2rem] sm:leading-[1.1] md:text-[2.5rem] md:leading-[1.08]">
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
          </div>

          <div
            className="relative z-20 mx-auto mt-9 w-full -translate-y-5 sm:mt-10 sm:-translate-y-6 md:mt-11 md:-translate-y-7"
            data-testid="home-hero-stack"
          >
            <div
              className="rounded-t-[28px] bg-white px-2 pb-2.5 pt-2 sm:rounded-t-[32px] sm:px-2.5 sm:pb-3 sm:pt-2.5"
              style={{
                borderTopLeftRadius: MEDVI_HOME.stackOuterRadiusTop,
                borderTopRightRadius: MEDVI_HOME.stackOuterRadiusTop,
                boxShadow: MEDVI_HOME.cardShadow,
              }}
            >
              <div className="flex flex-col gap-2.5 sm:gap-3">
                {TREATMENT_ROWS.map((row) => (
                  <a
                    key={row.slug}
                    href={row.href}
                    onClick={() => handleRow(row.slug)}
                    className="flex min-h-[76px] items-center gap-3 px-2.5 py-2 transition active:opacity-90 sm:min-h-[80px] sm:gap-4 sm:px-3 sm:py-2.5"
                    style={{
                      borderRadius: MEDVI_HOME.stackRowRadius,
                      backgroundColor: MEDVI_HOME.stackCardBg,
                      minHeight: MEDVI_HOME.stackRowMinH,
                    }}
                  >
                    <div
                      className={`relative shrink-0 overflow-hidden ${row.pad}`}
                      style={{
                        width: thumbPx,
                        height: thumbPx,
                        borderTopLeftRadius: rowR,
                        borderBottomLeftRadius: rowR,
                        borderTopRightRadius: MEDVI_HOME.stackThumbInnerRadius,
                        borderBottomRightRadius: MEDVI_HOME.stackThumbInnerRadius,
                      }}
                    >
                      <Image
                        src={row.image}
                        alt={row.title}
                        fill
                        className="object-cover"
                        sizes={`${thumbPx}px`}
                      />
                    </div>
                    <span className="min-w-0 flex-1 text-left text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[#111827] sm:text-[16px]">
                      {row.title}
                    </span>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-[#0a0a0a]" strokeWidth={2} aria-hidden />
                  </a>
                ))}
              </div>

              <a
                href="/triagem/emagrecimento"
                data-testid="home-primary-cta"
                onClick={handlePrimary}
                className="mt-3 flex h-12 w-full items-center justify-center rounded-[18px] border border-slate-200/80 bg-slate-50 text-[14px] font-semibold text-emerald-900 transition hover:bg-slate-100 sm:mt-3.5"
              >
                Começar minha triagem
              </a>
            </div>
          </div>
        </div>
      </section>
      <MedviTrustMarquee variant="bordered" />
    </>
  );
}
