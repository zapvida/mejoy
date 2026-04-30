import { RefinedCard } from '@/components/ui/RefinedCard';

export function ComparisonSection() {
  const withZapfarm = [
    'Triagem inteligente com relatório inicial',
    'Relatório clínico detalhado com análise inteligente',
    'Consulta online com especialista em emagrecimento',
    'Acompanhamento contínuo por assinatura',
    'Medicamentos, quando indicados, dispensados por farmácias credenciadas',
    'Menos tempo perdido, tudo digital',
  ];

  const withoutZapfarm = [
    'Várias consultas presenciais com fila e deslocamento',
    'Dificuldade para encontrar endocrinologista focado em obesidade',
    'Falta de acompanhamento entre consultas',
    'Alto custo somado (consultas + exames + medicação)',
    'Mais chance de abandonar o tratamento no meio',
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Por que escolher a Me Joy?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare o caminho tradicional com nossa abordagem completa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Com Me Joy */}
            <RefinedCard
              padding="lg"
              rounded="xl"
              variant="default"
              className="bg-gradient-to-br from-green-50 to-emerald-50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                  <span className="text-white text-2xl font-bold">✓</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Com Me Joy</h3>
              </div>
              <ul className="space-y-4">
                {withZapfarm.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-600 text-xl flex-shrink-0 mt-0.5">✓</span>
                    <p className="text-sm sm:text-base text-foreground leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </RefinedCard>

            {/* Sem Me Joy */}
            <RefinedCard
              padding="lg"
              rounded="xl"
              variant="default"
              className="bg-gradient-to-br from-red-50 to-rose-50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                  <span className="text-white text-2xl font-bold">✗</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Caminho tradicional</h3>
              </div>
              <ul className="space-y-4">
                {withoutZapfarm.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-600 text-xl flex-shrink-0 mt-0.5">✗</span>
                    <p className="text-sm sm:text-base text-foreground leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </RefinedCard>
          </div>

          <RefinedCard
            padding="lg"
            rounded="xl"
            variant="subtle"
            className="mt-8 sm:mt-10 bg-gradient-to-br from-brand-50 to-zinc-50"
          >
            <p className="text-base sm:text-lg text-foreground leading-relaxed text-center">
              <strong>Na prática,</strong> o que você pagaria diluído e fragmentado em vários locais, você concentra em um plano contínuo, com time, tecnologia e estrutura pensados para obesidade.
            </p>
          </RefinedCard>
        </div>
      </div>
    </section>
  );
}
