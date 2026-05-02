import Head from 'next/head';
import { EmagrecimentoLayout } from '@/components/zapfarm/emagrecimento/EmagrecimentoLayout';
import { EmagrecimentoEditorialHero } from '@/components/zapfarm/emagrecimento/EmagrecimentoEditorialHero';
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
        <EmagrecimentoEditorialHero
          eyebrow="Fluxo MeJoy"
          title="Passo a passo do seu tratamento de emagrecimento."
          description="Você entende a sequência inteira antes de decidir: triagem, avaliação médica, organização do programa e continuidade com metas claras."
          bullets={[
            'Triagem rápida para organizar o contexto inicial.',
            'Avaliação clínica individual antes de qualquer conduta.',
            'Acompanhamento contínuo para adesão e ajustes responsáveis.',
          ]}
          ctaText="Começar meu passo a passo"
          analyticsEvent="triagem_emagrecimento_cta_como_funciona"
          images={[
            '/images/emagrecimento/medvi/journey-consulta.avif',
            '/images/emagrecimento/medvi/reviews-01.webp',
            '/images/emagrecimento/medvi/reviews-03.avif',
          ]}
          imageAspect="portrait"
        />

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
