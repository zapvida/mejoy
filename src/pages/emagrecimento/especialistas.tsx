import Head from 'next/head';
import Image from 'next/image';
import { EmagrecimentoLayout } from '@/components/zapfarm/emagrecimento/EmagrecimentoLayout';
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
        {/* Hero */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2 lg:px-0">
                  Um time clínico acompanhando seu emagrecimento com responsabilidade
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed px-2 lg:px-0 mb-6">
                  O sucesso vem de consistência e acompanhamento. Você conta com time multidisciplinar para decidir
                  melhor e manter o plano de forma sustentável.
                </p>
                <ul className="text-left max-w-xl mx-auto lg:mx-0 mb-8 space-y-3 text-sm sm:text-base text-slate-100">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-300 mt-1">✓</span>
                    <span>Endocrinologistas e médicos com registro ativo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-300 mt-1">✓</span>
                    <span>Suporte para hábitos, rotina e aderência ao plano</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-300 mt-1">✓</span>
                    <span>Canal contínuo para dúvidas operacionais e próximos passos</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <a
                    href="/triagem/emagrecimento"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).analytics) {
                        (window as any).analytics.track('triagem_emagrecimento_cta_especialistas');
                      }
                    }}
                    className="inline-block rounded-full bg-emerald-500 px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-slate-950 transition-all hover:scale-105 hover:shadow-2xl"
                  >
                    Quero ser acompanhado por esse time
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  '/images/emagrecimento/medvi/avatar-belinda.webp',
                  '/images/emagrecimento/medvi/avatar-chris.webp',
                  '/images/emagrecimento/medvi/avatar-melissa.webp',
                  '/images/emagrecimento/medvi/avatar-sandra.webp',
                ].map((src) => (
                  <div key={src} className="relative aspect-square overflow-hidden rounded-2xl border border-white/20 bg-white/5">
                    <Image src={src} alt="Especialista do time de acompanhamento" fill className="object-cover" sizes="20vw" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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
