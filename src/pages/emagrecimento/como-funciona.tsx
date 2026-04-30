import Head from 'next/head';
import Image from 'next/image';
import { EmagrecimentoLayout } from '@/components/zapfarm/emagrecimento/EmagrecimentoLayout';
import { HowItWorksSection } from '@/components/zapfarm/emagrecimento/HowItWorksSection';
import { TreatmentTimelineSection } from '@/components/zapfarm/emagrecimento/TreatmentTimelineSection';
import { ImpactStatsSection } from '@/components/zapfarm/emagrecimento/ImpactStatsSection';
import { AnvisaComplianceSection } from '@/components/zapfarm/emagrecimento/AnvisaComplianceSection';
import { FinalCtaSection } from '@/components/zapfarm/emagrecimento/FinalCtaSection';

export default function ComoFuncionaPage() {
  return (
    <>
      <Head>
        <title>Como funciona o tratamento de emagrecimento da Me Joy | Check-up online e GLP-1 com segurança</title>
        <meta
          name="description"
          content="Passo a passo completo do tratamento de emagrecimento: triagem online, avaliação médica, prescrição quando indicada e acompanhamento contínuo. 100% online com endocrinologista."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logosmejoy/faviconmejoy.png" />
      </Head>

      <EmagrecimentoLayout>
        {/* Hero */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2 lg:px-0">
                  Passo a passo do seu tratamento de emagrecimento
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed px-2 lg:px-0 mb-6">
                  Você entende cada etapa antes de decidir: triagem, avaliação médica e acompanhamento contínuo com
                  metas claras para construir resultado sustentável.
                </p>
                <ul className="text-left max-w-xl mx-auto lg:mx-0 mb-8 space-y-3 text-sm sm:text-base text-slate-100">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-300 mt-1">✓</span>
                    <span>Triagem em poucos minutos para organizar seu caso</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-300 mt-1">✓</span>
                    <span>Avaliação clínica individual antes de qualquer conduta</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-300 mt-1">✓</span>
                    <span>Plano com acompanhamento contínuo para manter adesão</span>
                  </li>
                </ul>
                <a
                  href="/triagem/emagrecimento"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).analytics) {
                      (window as any).analytics.track('triagem_emagrecimento_cta_como_funciona');
                    }
                  }}
                  className="inline-block rounded-full bg-emerald-500 px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-slate-950 transition-all hover:scale-105 hover:shadow-2xl"
                >
                  Começar meu passo a passo
                </a>
              </div>
              <div className="relative mx-auto w-full max-w-xl">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
                  <Image
                    src="/images/emagrecimento/medvi/journey-consulta.avif"
                    alt="Consulta e plano de emagrecimento com acompanhamento"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como funciona na prática */}
        <HowItWorksSection />

        {/* O que esperar em cada fase */}
        <TreatmentTimelineSection />

        {/* Os resultados falam por eles mesmos */}
        <ImpactStatsSection />

        {/* Tratamentos de acordo com ANVISA */}
        <AnvisaComplianceSection />

        {/* CTA final */}
        <FinalCtaSection ctaText="Começar meu passo a passo" analyticsEvent="triagem_emagrecimento_cta_como_funciona_final" />
      </EmagrecimentoLayout>
    </>
  );
}
