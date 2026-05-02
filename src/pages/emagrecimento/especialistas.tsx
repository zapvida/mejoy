import Head from 'next/head';
import { EmagrecimentoLayout } from '@/components/zapfarm/emagrecimento/EmagrecimentoLayout';
import { EmagrecimentoEditorialHero } from '@/components/zapfarm/emagrecimento/EmagrecimentoEditorialHero';
import { SpecialistsSection } from '@/components/zapfarm/emagrecimento/SpecialistsSection';
import { MedicalCouncilSection } from '@/components/zapfarm/emagrecimento/MedicalCouncilSection';
import { DailySupportSection } from '@/components/zapfarm/emagrecimento/DailySupportSection';
import { FinalCtaSection } from '@/components/zapfarm/emagrecimento/FinalCtaSection';

export default function EspecialistasPage() {
  return (
    <>
      <Head>
        <title>Time de especialistas em emagrecimento | Endocrinologistas e nutricionistas | Me Joy</title>
        <meta
          name="description"
          content="Time completo de especialistas em emagrecimento: endocrinologistas credenciados, nutricionistas, farmacêuticos e enfermeiros. Suporte diário via WhatsApp. ⭐ 4,9/5 em avaliações."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logosmejoy/faviconmejoy.png" />
      </Head>

      <EmagrecimentoLayout>
        <EmagrecimentoEditorialHero
          eyebrow="Time clínico MeJoy"
          title="Um time clínico acompanhando seu emagrecimento com responsabilidade."
          description="O resultado sustentável vem de consistência e acompanhamento. Você conta com um time multidisciplinar para decidir melhor e manter aderência ao plano."
          bullets={[
            'Endocrinologistas e médicos com registro ativo.',
            'Suporte para hábitos, rotina e continuidade.',
            'Canal oficial para dúvidas operacionais e próximos passos.',
          ]}
          ctaText="Quero ser acompanhado por esse time"
          analyticsEvent="triagem_emagrecimento_cta_especialistas"
          images={[
            '/images/emagrecimento/medvi/avatar-belinda.webp',
            '/images/emagrecimento/medvi/avatar-chris.webp',
            '/images/emagrecimento/medvi/avatar-melissa.webp',
            '/images/emagrecimento/medvi/avatar-sandra.webp',
          ]}
          imageAspect="square"
        />

        {/* Conheça nossos especialistas */}
        <SpecialistsSection />

        {/* Conselho Médico */}
        <MedicalCouncilSection />

        {/* Como o time te acompanha no dia a dia */}
        <DailySupportSection />

        {/* Rating */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-emerald-50 to-amber-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-10 border-2 border-emerald-200 shadow-lg">
                <div className="text-4xl sm:text-5xl mb-4">★★★★★</div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">4,9/5</p>
                <p className="text-base sm:text-lg text-gray-700 mb-4">
                  é a média de satisfação dos nossos atendimentos em emagrecimento
                </p>
                <p className="text-xs sm:text-sm text-gray-500 italic">
                  *Dados de avaliações internas, atualizados periodicamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <FinalCtaSection ctaText="Quero ser acompanhado por esse time" analyticsEvent="triagem_emagrecimento_cta_especialistas_final" />
      </EmagrecimentoLayout>
    </>
  );
}
