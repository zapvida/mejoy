'use client';

import { track } from '@/lib/analytics';

export function HomeCtaBanner() {
  const handleClick = () => {
    track('cta_click', { page: 'home', position: 'cta_banner', section: 'home_cta' });
  };

  return (
    <section className="bg-white py-14 sm:py-16 md:py-20" data-home-section="cta_banner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[36px] bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 text-center shadow-[0_30px_90px_rgba(5,150,105,0.25)] sm:p-12 md:p-14">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200 sm:text-sm">
            Comece quando quiser
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-3xl md:text-4xl">
            Triagem clara, em poucos minutos
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-emerald-50 sm:text-base">
            Organizamos seu contexto e o próximo passo possível — com avaliação médica quando fizer sentido.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/triagem/emagrecimento"
              onClick={handleClick}
              data-testid="home-cta-banner-primary"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-emerald-700 shadow-lg transition hover:bg-emerald-50 sm:w-auto"
            >
              Começar pela triagem
            </a>
            <a
              href="/emagrecimento"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
            >
              Ver jornada de emagrecimento
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
