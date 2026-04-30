export function TreatmentTimelineSection() {
  const phases = [
    {
      phase: 'Fase 1',
      period: '1º–3º mês',
      title: 'Primeiros sinais',
      description: 'O que esperar',
      items: [
        'Redução gradual da fome e dos desejos',
        'Primeiros quilos perdidos (varia por pessoa)',
        'Ajuste de dosagem com o médico',
        'Estabelecimento de rotinas alimentares',
      ],
    },
    {
      phase: 'Fase 2',
      period: '3º–6º mês',
      title: 'Ajustes',
      description: 'Consolidação do tratamento',
      items: [
        'Perda de peso mais consistente',
        'Melhora em exames (glicemia, pressão, etc.)',
        'Ajustes de medicação quando necessário',
        'Reforço de hábitos saudáveis',
      ],
    },
    {
      phase: 'Fase 3',
      period: 'A partir do 6º mês',
      title: 'Manutenção',
      description: 'Sustentabilidade',
      items: [
        'Manutenção do peso perdido',
        'Acompanhamento contínuo',
        'Prevenção de reganho',
        'Suporte para mudanças de vida',
      ],
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-emerald-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            O que esperar em cada fase
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Timeline de progresso do tratamento
          </p>
        </div>

        {/* Mobile: Timeline vertical */}
        <div className="lg:hidden space-y-8">
          {phases.map((phase, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-orange-600 text-white text-lg font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">{phase.phase}</p>
                    <p className="text-lg font-bold text-gray-900">{phase.title}</p>
                    <p className="text-sm text-gray-600">{phase.period}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 italic">{phase.description}</p>
                <ul className="space-y-2">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {index < phases.length - 1 && (
                <div className="flex justify-center my-4">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-400 to-orange-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop: Timeline horizontal */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 relative">
          {phases.map((phase, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all h-full">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-600 to-orange-600 text-white text-xl font-bold mb-3">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-500 font-semibold mb-1">{phase.phase}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{phase.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{phase.period}</p>
                  <p className="text-sm text-gray-600 italic">{phase.description}</p>
                </div>
                <ul className="space-y-3">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-base text-gray-700">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {index < phases.length - 1 && (
                <div className="absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-emerald-400 to-orange-400 transform translate-x-4" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-gray-600 text-center italic">
            <strong>Importante:</strong> Cada pessoa responde de forma diferente ao tratamento. Os resultados variam e dependem de diversos fatores individuais.
          </p>
        </div>
      </div>
    </section>
  );
}

