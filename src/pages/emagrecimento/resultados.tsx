import Head from 'next/head';
import Image from 'next/image';
import { EmagrecimentoLayout } from '@/components/zapfarm/emagrecimento/EmagrecimentoLayout';
import { ImpactStatsSection } from '@/components/zapfarm/emagrecimento/ImpactStatsSection';
import { ResultsTimelineSection } from '@/components/zapfarm/emagrecimento/ResultsTimelineSection';
import { ResultsSection } from '@/components/zapfarm/emagrecimento/ResultsSection';
import { BeyondScaleSection } from '@/components/zapfarm/emagrecimento/BeyondScaleSection';
import { FinalCtaSection } from '@/components/zapfarm/emagrecimento/FinalCtaSection';
import { EMAGRECIMENTO_PAGE_ASSETS } from '@/lib/emagrecimento-lp-assets';

export default function ResultadosPage() {
  return (
    <>
      <Head>
        <title>Resultados reais de emagrecimento | Depoimentos e estatísticas | MeJoy</title>
        <meta
          name="description"
          content="Pessoas reais, evolução real e mais clareza sobre o que esperar da jornada. Depoimentos com identidade preservada, marcos clínicos e acompanhamento responsável."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>

      <EmagrecimentoLayout>
        {/* Hero */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2 lg:px-0">
                  Pessoas reais, evolução real, com segurança
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed px-2 lg:px-0 mb-6">
                  Cada organismo responde de um jeito. Por isso o acompanhamento contínuo é essencial para manter
                  progresso e ajustar estratégia com responsabilidade.
                </p>
                <ul className="text-left max-w-xl mx-auto lg:mx-0 mb-8 space-y-3 text-sm sm:text-base text-slate-100">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-300 mt-1">✓</span>
                    <span>Depoimentos de pacientes com identidade preservada</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-300 mt-1">✓</span>
                    <span>Estatísticas construídas com dados de acompanhamento</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-300 mt-1">✓</span>
                    <span>Sem promessa de resultado garantido</span>
                  </li>
                </ul>
                <a
                  href="/triagem/emagrecimento"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).analytics) {
                      (window as any).analytics.track('triagem_emagrecimento_cta_resultados');
                    }
                  }}
                  className="inline-block rounded-full bg-emerald-500 px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-slate-950 transition-all hover:scale-105 hover:shadow-2xl"
                >
                  Quero saber o que é possível no meu caso
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {EMAGRECIMENTO_PAGE_ASSETS.resultadosHeroGrid.map((src) => (
                  <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 bg-white/5">
                    <Image src={src} alt="Resultados e acompanhamento de pacientes" fill className="object-cover" sizes="24vw" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Impacto em números */}
        <ImpactStatsSection />

        {/* Timeline de progresso */}
        <ResultsTimelineSection />

        {/* Depoimentos reais */}
        <ResultsSection />

        {/* Mais que balança */}
        <BeyondScaleSection />

        {/* Por que os resultados são sustentáveis */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Por que os resultados são sustentáveis
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl p-6 border-2 border-emerald-100">
                  <div className="text-4xl mb-4 text-center">🔄</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Manutenção</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Acompanhamento contínuo ajuda a manter o peso perdido e prevenir reganho.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl p-6 border-2 border-emerald-100">
                  <div className="text-4xl mb-4 text-center">🌱</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Mudança de hábitos</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    O tratamento foca em mudanças duradouras de estilo de vida, não apenas na medicação.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl p-6 border-2 border-emerald-100">
                  <div className="text-4xl mb-4 text-center">🤝</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Acompanhamento contínuo</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Suporte recorrente garante que você não fique sozinho(a) na jornada de manutenção.
                  </p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 text-center italic">
                  <strong>Importante:</strong> Resultados sustentáveis dependem de múltiplos fatores, incluindo adesão ao tratamento, mudanças de hábitos e acompanhamento médico regular.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <FinalCtaSection ctaText="Quero saber o que é possível no meu caso" analyticsEvent="triagem_emagrecimento_cta_resultados_final" />
      </EmagrecimentoLayout>
    </>
  );
}
