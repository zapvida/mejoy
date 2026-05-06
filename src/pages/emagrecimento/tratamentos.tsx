import Head from 'next/head';
import Image from 'next/image';
import { EmagrecimentoLayout } from '@/components/zapfarm/emagrecimento/EmagrecimentoLayout';
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
        <title>Tratamentos de emagrecimento com GLP-1 e suporte médico | MeJoy</title>
        <meta
          name="description"
          content="Tratamentos modernos de emagrecimento com segurança: medicações GLP-1 quando indicadas, mudança de estilo de vida e acompanhamento médico contínuo. Conforme normas ANVISA."
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
                  Tratamentos com segurança, clareza e critério médico
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed px-2 lg:px-0 mb-6">
                  Na consulta, o médico avalia se alguma estratégia medicamentosa faz sentido para você, sempre com
                  base clínica e alinhada ao seu histórico.
                </p>
                <ul className="text-left max-w-xl mx-auto lg:mx-0 mb-8 space-y-3 text-sm sm:text-base text-slate-100">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-300 mt-1">✓</span>
                    <span>Mudança de estilo de vida como base do programa</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-300 mt-1">✓</span>
                    <span>Estratégias metabólicas quando houver indicação clínica</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-300 mt-1">✓</span>
                    <span>Acompanhamento para ajustar conduta com segurança</span>
                  </li>
                </ul>
                <a
                  href="/triagem/emagrecimento"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).analytics) {
                      (window as any).analytics.track('triagem_emagrecimento_cta_tratamentos');
                    }
                  }}
                  className="inline-block rounded-full bg-emerald-500 px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-slate-950 transition-all hover:scale-105 hover:shadow-2xl"
                >
                  Ver se algum tratamento é indicado pra mim
                </a>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  '/images/emagrecimento/medvi/treatment-injetavel.webp',
                  '/images/emagrecimento/medvi/treatment-comprimidos.avif',
                  '/images/emagrecimento/medvi/treatment-escolha.avif',
                ].map((src) => (
                  <div key={src} className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/15">
                    <Image src={src} alt="Opções de tratamento avaliadas clinicamente" fill className="object-cover" sizes="20vw" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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
