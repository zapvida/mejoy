'use client';

import Image from 'next/image';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { EMAGRECIMENTO_LP } from '@/lib/emagrecimento-lp-assets';

export function DecisionSectionObesidade() {
  const page = useLandingPageKey();

  const handleCta = () => {
    track('cta_click', {
      page,
      position: 'decision_fold',
      section: 'decision_section',
    });
  };

  return (
    <section
      className="bg-[#f7fbf8] py-12 sm:py-14 md:py-16"
      data-home-section="decision"
      data-testid="emagrecimento-decision"
      data-sticky-cta-stop
      aria-labelledby="decision-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[34px] border border-emerald-100 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8 md:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-800">
                Decisão com clareza
              </div>
              <h2
                id="decision-heading"
                className="mt-4 text-3xl font-bold leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl"
              >
                Em poucos minutos, você sabe se faz sentido avançar
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                A triagem mostra o caminho provável, organiza suas informações e evita que você comece uma jornada sem
                direção.
              </p>

              <ul className="mt-6 space-y-3 text-sm sm:text-base">
                {[
                  'Leva cerca de 5 minutos para concluir a triagem',
                  'A conduta é definida em avaliação individual',
                  'Você entende etapas e valores antes de decidir',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center" data-sticky-cta-stop>
                <a
                  href="/triagem/emagrecimento"
                  onClick={handleCta}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-800 px-8 py-3.5 text-base font-bold text-white shadow-[0_20px_45px_rgba(16,185,129,0.28)] transition-all hover:scale-[1.02]"
                >
                  Fazer minha triagem
                </a>
                <span className="text-xs text-slate-500 sm:text-sm">
                  Prescrição somente quando indicada em consulta médica.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-[#fbfefc] p-4">
                <div className="relative mb-3 h-10 w-10 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-emerald-100">
                  <Image
                    src="/images/emagrecimento/medvi/guarantee.svg"
                    alt="Compromisso de qualidade no atendimento"
                    fill
                    className="object-contain p-1"
                    sizes="40px"
                  />
                </div>
                <h3 className="text-base font-bold text-slate-950">Transparência total</h3>
                <p className="mt-1 text-sm text-slate-600">Você sabe o processo e os critérios antes de avançar.</p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-[#fbfefc] p-4">
                <div className="relative mb-3 h-10 w-24 overflow-hidden">
                  <Image
                    src={EMAGRECIMENTO_LP.ratingBadge}
                    alt="Prova social de avaliação"
                    fill
                    className="object-contain object-left"
                    sizes="96px"
                  />
                </div>
                <h3 className="text-base font-bold text-slate-950">Confiança construída</h3>
                <p className="mt-1 text-sm text-slate-600">Acompanhamento focado em constância, não em ansiedade.</p>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white sm:col-span-2">
                <div className="relative aspect-[16/8] w-full">
                  <Image
                    src={EMAGRECIMENTO_LP.storyWideA}
                    alt="Suporte oficial do programa MeJoy"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                <div className="grid gap-2 border-t border-emerald-100 bg-white p-4 sm:grid-cols-3">
                  {['Triagem em cerca de 5 min', 'Conduta definida em consulta', 'Canais oficiais da MeJoy'].map((item) => (
                    <div key={item} className="rounded-full bg-emerald-50 px-4 py-2 text-center text-xs font-semibold text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
