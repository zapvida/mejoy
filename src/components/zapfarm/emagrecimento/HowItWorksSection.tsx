import { RefinedCard } from '@/components/ui/RefinedCard';
import { RefinedButton } from '@/components/ui/RefinedButton';
import { trackFunnelEvent } from '@/lib/funnel/events-client';

export function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Triagem inteligente (agora)',
      description: 'Você responde perguntas rápidas e nossa plataforma inteligente + equipe médica analisam seu caso.',
      icon: '📋',
    },
    {
      number: '2',
      title: 'Relatório clínico + plano sugerido',
      description: 'Você recebe um relatório completo com riscos, explicações e possíveis caminhos de tratamento.',
      icon: '📊',
    },
    {
      number: '3',
      title: 'Consulta online com médico',
      description: 'Um médico especialista revisa seu relatório, ajusta o plano e prescreve, quando indicado.',
      icon: '👨‍⚕️',
    },
    {
      number: '4',
      title: 'Acompanhamento contínuo',
      description: 'Você tem acompanhamento, ajustes e suporte recorrente, sem ficar perdido(a) entre uma consulta e outra.',
      icon: '🤝',
    },
  ];

  return (
    <section id="como-funciona" className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-zinc-50 to-emerald-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Como funciona na prática
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Como médico, vejo que o sucesso do tratamento vem de um processo bem estruturado. Um processo simples e guiado em 4 etapas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <RefinedCard
                hover
                padding="lg"
                rounded="xl"
                variant="default"
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xl sm:text-2xl font-bold mb-4 shadow-brand-sm">
                  {step.number}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </RefinedCard>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-brand-300 to-brand-400 transform translate-x-4" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center space-y-4">
          <RefinedButton
            variant="primary"
            size="lg"
            asChild
            onClick={() => {
              trackFunnelEvent('cta_start_triage', { source: 'how_it_works' });
            }}
          >
            <a href="/triagem/emagrecimento">
              Começar minha triagem online
            </a>
          </RefinedButton>
          <div className="mt-4">
            <a
              href="/emagrecimento/como-funciona"
              className="text-sm sm:text-base text-brand-600 hover:text-brand-700 font-medium underline transition-colors"
            >
              Quer ver o passo a passo detalhado? →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
