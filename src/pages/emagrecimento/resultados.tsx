import Head from 'next/head';
import { EmagrecimentoLayout } from '@/components/zapfarm/emagrecimento/EmagrecimentoLayout';
import { EmagrecimentoEditorialHero } from '@/components/zapfarm/emagrecimento/EmagrecimentoEditorialHero';
import { ImpactStatsSection } from '@/components/zapfarm/emagrecimento/ImpactStatsSection';
import { ResultsTimelineSection } from '@/components/zapfarm/emagrecimento/ResultsTimelineSection';
import { ResultsSection } from '@/components/zapfarm/emagrecimento/ResultsSection';
import { BeyondScaleSection } from '@/components/zapfarm/emagrecimento/BeyondScaleSection';
import { FinalCtaSection } from '@/components/zapfarm/emagrecimento/FinalCtaSection';

export default function ResultadosPage() {
  return (
    <>
      <Head>
        <title>Resultados reais de emagrecimento | Depoimentos e estatísticas | Me Joy</title>
        <meta
          name="description"
          content="Pessoas reais, resultados reais – com segurança. Centenas de pessoas já transformaram sua saúde com o programa de emagrecimento. Depoimentos verificados e estatísticas baseadas em dados."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logosmejoy/faviconmejoy.png" />
      </Head>

      <EmagrecimentoLayout>
        <EmagrecimentoEditorialHero
          eyebrow="Resultados MeJoy"
          title="Pessoas reais, evolução real e acompanhamento responsável."
          description="Cada organismo responde de um jeito. Por isso a leitura clínica e o acompanhamento contínuo continuam centrais mesmo depois da primeira perda de peso."
          bullets={[
            'Depoimentos com identidade preservada e foco em contexto clínico.',
            'Estatísticas organizadas com base em acompanhamento real.',
            'Sem promessa automática de resultado ou prescrição.',
          ]}
          ctaText="Quero saber o que é possível no meu caso"
          analyticsEvent="triagem_emagrecimento_cta_resultados"
          images={[
            '/images/emagrecimento/medvi/reviews-01.webp',
            '/images/emagrecimento/medvi/reviews-03.avif',
            '/images/emagrecimento/medvi/reviews-04.avif',
            '/images/emagrecimento/medvi/reviews-07.webp',
          ]}
        />

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
