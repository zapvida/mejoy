import Head from 'next/head';
import { EmagrecimentoLayout } from '@/components/zapfarm/emagrecimento/EmagrecimentoLayout';
import { EmagrecimentoEditorialHero } from '@/components/zapfarm/emagrecimento/EmagrecimentoEditorialHero';
import { TreatmentsSection } from '@/components/zapfarm/emagrecimento/TreatmentsSection';
import { MedicalEvaluationSection } from '@/components/zapfarm/emagrecimento/MedicalEvaluationSection';
import { ScienceBehindSection } from '@/components/zapfarm/emagrecimento/ScienceBehindSection';
import { AnvisaComplianceSection } from '@/components/zapfarm/emagrecimento/AnvisaComplianceSection';
import { FaqSection } from '@/components/zapfarm/emagrecimento/FaqSection';
import { FinalCtaSection } from '@/components/zapfarm/emagrecimento/FinalCtaSection';

export default function TratamentosPage() {
  return (
    <>
      <Head>
        <title>Tratamentos de emagrecimento com GLP-1 e suporte médico | Me Joy</title>
        <meta
          name="description"
          content="Tratamentos modernos de emagrecimento com segurança: medicações GLP-1 quando indicadas, mudança de estilo de vida e acompanhamento médico contínuo. Conforme normas ANVISA."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logosmejoy/faviconmejoy.png" />
      </Head>

      <EmagrecimentoLayout>
        <EmagrecimentoEditorialHero
          eyebrow="Tratamentos MeJoy"
          title="Tratamentos com clareza, segurança e critério médico."
          description="Na consulta, o médico decide se alguma estratégia medicamentosa faz sentido para você, sempre com base clínica, histórico individual e acompanhamento contínuo."
          bullets={[
            'Mudança de estilo de vida como base do programa.',
            'Estratégias metabólicas quando houver indicação clínica.',
            'Acompanhamento para ajustar conduta com segurança.',
          ]}
          ctaText="Ver se algum tratamento é indicado pra mim"
          analyticsEvent="triagem_emagrecimento_cta_tratamentos"
          images={[
            '/images/emagrecimento/medvi/treatment-injetavel.webp',
            '/images/emagrecimento/medvi/treatment-comprimidos.avif',
            '/images/emagrecimento/medvi/treatment-escolha.avif',
          ]}
          imageAspect="portrait"
        />

        {/* Tratamentos disponíveis */}
        <TreatmentsSection />

        {/* Avaliação médica */}
        <MedicalEvaluationSection />

        {/* Por trás da ciência */}
        <ScienceBehindSection />

        {/* De acordo com as novas normas da ANVISA */}
        <AnvisaComplianceSection />

        {/* FAQ de tratamentos */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Perguntas frequentes sobre tratamentos
              </h2>
            </div>
            <FaqSection />
          </div>
        </section>

        {/* CTA final */}
        <FinalCtaSection ctaText="Ver se algum tratamento é indicado pra mim" analyticsEvent="triagem_emagrecimento_cta_tratamentos_final" />
      </EmagrecimentoLayout>
    </>
  );
}
