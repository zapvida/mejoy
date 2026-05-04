'use client';

import Image from 'next/image';

import { track } from '@/lib/analytics';

export function HomeHero() {
  const handlePrimary = () => {
    track('cta_click', { page: 'home', position: 'hero', section: 'home_hero' });
  };

  return (
    <section
      className="bg-white pt-24 pb-12 sm:pt-28 md:pt-32 md:pb-16 lg:pb-20"
      data-testid="home-hub-hero"
      data-home-section="hero"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700 sm:text-sm">
              Telemedicina personalizada
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl md:text-6xl">
              Cuide da sua saúde com clareza médica e suporte contínuo
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
              Triagem online, avaliação médica quando indicada e acompanhamento pelo WhatsApp oficial. Tudo no mesmo
              fluxo, com privacidade e sem promessa automática de prescrição.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="/triagem/emagrecimento"
                data-testid="home-primary-cta"
                onClick={handlePrimary}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-emerald-600 px-7 text-sm font-bold text-white shadow-[0_18px_45px_rgba(5,150,105,0.28)] transition hover:bg-emerald-700 sm:w-auto"
              >
                Começar minha jornada
              </a>
              <a
                href="#como-funciona"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-emerald-200 bg-white px-7 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 sm:w-auto"
              >
                Como funciona
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600 sm:text-sm lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 shadow-sm">
                <Image src="/images/emagrecimento/medvi/stars.svg" alt="" width={70} height={12} />
                Excelente 4,8
              </span>
              <span className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 shadow-sm">
                Médicos com CRM
              </span>
              <span className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 shadow-sm">
                100% online
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-[1.05] max-w-[480px] overflow-hidden rounded-[36px] bg-emerald-50 shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
              <Image
                src="/images/emagrecimento/medvi/hero-main.webp"
                alt="Cuidado em saúde Me Joy"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <div className="pointer-events-none absolute -bottom-4 -left-4 hidden w-44 rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] lg:block">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">Avaliação médica</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Decisão com critério, sem fórmulas mágicas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
