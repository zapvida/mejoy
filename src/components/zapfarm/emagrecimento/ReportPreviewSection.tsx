import Image from 'next/image';
import { RefinedCard } from '@/components/ui/RefinedCard';
import { trackFunnelEvent } from '@/lib/funnel/events-client';

export function ReportPreviewSection() {
  const features = [
    {
      title: 'Seu quadro hoje',
      description: 'Explicamos seu quadro de forma clara, com linguagem simples, mostrando seus riscos e prioridades.',
      icon: '📊',
    },
    {
      title: 'O que está por trás do seu peso',
      description: 'Possíveis causas e mecanismos envolvidos no seu caso (hormônios, estilo de vida, sono, estresse), explicados em linguagem acessível.',
      icon: '🔬',
    },
    {
      title: 'Caminhos possíveis',
      description: 'Opções de condutas não medicamentosas, possíveis medicações, exames sugeridos — tudo alinhado com o médico.',
      icon: '🗺️',
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Você não recebe só uma consulta: recebe um relatório clínico inteligente
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Nosso diferencial: tecnologia avançada + análise médica especializada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
            {features.map((feature, index) => (
              <RefinedCard
                key={index}
                padding="lg"
                rounded="xl"
                variant="default"
                className="bg-gradient-to-br from-zinc-50 to-brand-50/30"
                hover
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                  {feature.description}
                </p>
              </RefinedCard>
            ))}
          </div>

          <RefinedCard
            padding="lg"
            rounded="xl"
            variant="default"
            className="bg-gradient-to-br from-brand-50 to-zinc-50 border-brand-200"
          >
            <div className="mb-6 overflow-hidden rounded-xl border border-brand-200/60 bg-white shadow-sm">
              <div className="relative aspect-video">
                <Image
                  src="/images/mock-relatorio.png"
                  alt="Prévia do relatório inteligente de emagrecimento do MeJoy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 960px"
                  priority={false}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 sm:p-5">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Prévia real do relatório: classificação clínica, ação recomendada e próximos passos.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-base sm:text-lg text-foreground text-center leading-relaxed font-semibold">
              É como ter um médico, uma tecnologia treinada em evidências e um plano prático sempre com você.
            </p>
            <div className="mt-6 text-center">
              <a
                href="/triagem/emagrecimento"
                onClick={() => trackFunnelEvent('cta_start_triage', { source: 'report_preview' })}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-95 sm:text-base"
              >
                Receber meu relatório →
              </a>
            </div>
          </RefinedCard>
        </div>
      </div>
    </section>
  );
}
