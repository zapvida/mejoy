'use client';

import Image from 'next/image';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { cn } from '@/lib/utils';

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
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-8 md:p-10 backdrop-blur">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-emerald-300/40 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-emerald-200">
                Decisão com clareza
              </div>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                Em poucos minutos você já sabe o melhor próximo passo para o seu caso
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-200 sm:text-lg">
                Triagem rápida, avaliação médica e plano estruturado para reduzir tentativa e erro. Sem promessa mágica,
                com direção clínica e acompanhamento contínuo.
              </p>

              <ul className="mt-6 space-y-3 text-sm sm:text-base">
                {[
                  'Leva cerca de 5 minutos para concluir a triagem',
                  'Conduta definida em avaliação individual',
                  'Você entende exatamente o que está incluso antes de decidir',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-100">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-slate-950">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/triagem/emagrecimento"
                  onClick={handleCta}
                  className={cn(
                    'inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-bold text-white',
                    'bg-gradient-to-r from-emerald-500 to-emerald-700 shadow-[0_20px_45px_rgba(16,185,129,0.35)]',
                    'transition-all hover:scale-[1.03] hover:from-emerald-400 hover:to-emerald-600'
                  )}
                >
                  Fazer minha triagem agora
                </a>
                <span className="text-xs text-slate-300 sm:text-sm">
                  Prescrição somente quando indicada em consulta médica.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="relative mb-3 h-10 w-10 overflow-hidden rounded-lg bg-white">
                  <Image
                    src="/images/emagrecimento/medvi/guarantee.svg"
                    alt="Compromisso de qualidade no atendimento"
                    fill
                    className="object-contain p-1"
                    sizes="40px"
                  />
                </div>
                <h3 className="text-base font-bold text-white">Transparência total</h3>
                <p className="mt-1 text-sm text-slate-200">Você sabe o processo e os critérios antes de avançar.</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="relative mb-3 h-10 w-24 overflow-hidden">
                  <Image
                    src="/images/emagrecimento/medvi/social-proof-rating.webp"
                    alt="Prova social de avaliação"
                    fill
                    className="object-contain"
                    sizes="96px"
                  />
                </div>
                <h3 className="text-base font-bold text-white">Confiança construída</h3>
                <p className="mt-1 text-sm text-slate-200">Acompanhamento focado em constância, não em ansiedade.</p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 sm:col-span-2">
                <div className="relative aspect-[16/8] w-full">
                  <Image
                    src="/images/emagrecimento/medvi/reviews-07.webp"
                    alt="Paciente em processo de acompanhamento do programa"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
