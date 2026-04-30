export function MedicalEvaluationSection() {
  const evaluations = [
    {
      title: 'Genética',
      description: 'Histórico familiar e predisposição genética são avaliados para entender melhor seu perfil metabólico.',
      icon: '🧬',
    },
    {
      title: 'Metabolismo',
      description: 'Avaliação de como seu corpo processa energia, incluindo taxa metabólica e resposta a diferentes alimentos.',
      icon: '⚡',
    },
    {
      title: 'Hormônios',
      description: 'Análise de hormônios que influenciam peso, como insulina, cortisol, tireoide e hormônios sexuais.',
      icon: '🔬',
    },
    {
      title: 'Fatores emocionais e comportamentais',
      description: 'Avaliação de padrões alimentares, relação com comida, estresse e fatores psicológicos que podem influenciar o peso.',
      icon: '🧠',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 text-white">
            Avaliação médica: quando o médico pode prescrever
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto px-2">
            Como médico, avaliamos múltiplos fatores para indicar o melhor tratamento para você. Sempre após avaliação individual e seguindo as normas da ANVISA.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {evaluations.map((evaluation, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="text-4xl sm:text-5xl mb-4 text-center">{evaluation.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white text-center">
                {evaluation.title}
              </h3>
              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
                {evaluation.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border-2 border-white/20 max-w-4xl mx-auto">
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed text-center">
            <strong className="text-white">Importante:</strong> A avaliação médica é completa e considera todos esses fatores. Não é apenas sobre o número na balança, mas sobre sua saúde como um todo. Veja mais detalhes sobre nossos <a href="/emagrecimento/tratamentos" className="underline hover:text-white transition-colors">tratamentos disponíveis</a>.
          </p>
        </div>
      </div>
    </section>
  );
}

