export function BeyondScaleSection() {
  const benefits = [
    {
      title: 'Melhor sono',
      description: 'Perda de peso pode melhorar a qualidade do sono, reduzindo ronco e apneia do sono em muitos casos.',
      icon: '😴',
    },
    {
      title: 'Mais energia',
      description: 'Com menos peso para carregar e melhor saúde metabólica, você pode sentir mais disposição no dia a dia.',
      icon: '⚡',
    },
    {
      title: 'Menos dor articular',
      description: 'Redução de peso pode aliviar dores nas articulações, especialmente nos joelhos, quadris e coluna.',
      icon: '🦴',
    },
    {
      title: 'Melhora da autoestima',
      description: 'Sentir-se melhor com o próprio corpo e ter mais controle sobre a saúde pode aumentar significativamente a autoestima.',
      icon: '✨',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-emerald-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Mais que balança
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Os benefícios do tratamento vão muito além do número na balança
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-emerald-100 hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <div className="text-4xl sm:text-5xl mb-4 text-center">{benefit.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 text-center">
                {benefit.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 bg-gray-50 rounded-xl border border-gray-200 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-gray-600 text-center italic">
            <strong>Nota:</strong> Estes benefícios podem variar de pessoa para pessoa e dependem de diversos fatores individuais.
          </p>
        </div>
      </div>
    </section>
  );
}

