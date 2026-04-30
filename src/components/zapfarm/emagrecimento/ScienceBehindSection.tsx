export function ScienceBehindSection() {
  const mechanisms = [
    {
      title: 'Sua fome sob controle',
      description: 'Medicamentos modernos atuam em receptores do intestino e cérebro, ajudando a regular os sinais de fome e saciedade. Isso permite que você sinta menos fome e se sinta satisfeito com porções menores.',
      icon: '🍽️',
    },
    {
      title: 'Desejos na medida certa',
      description: 'Ao regular os sinais de apetite, os tratamentos ajudam a reduzir os desejos por alimentos calóricos e processados, facilitando escolhas mais saudáveis.',
      icon: '🎯',
    },
    {
      title: 'Novo equilíbrio do corpo',
      description: 'Com o tempo, o corpo encontra um novo ponto de equilíbrio metabólico, onde é mais fácil manter o peso perdido quando combinado com mudanças de estilo de vida.',
      icon: '⚖️',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Por trás da ciência
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Na consulta, explico como funcionam os tratamentos modernos para obesidade. Esta é uma explicação simplificada para você entender melhor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {mechanisms.map((mechanism, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-emerald-50 to-orange-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-emerald-100 hover:shadow-xl transition-all"
            >
              <div className="text-4xl sm:text-5xl mb-4 text-center">{mechanism.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 text-center">
                {mechanism.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {mechanism.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 bg-gray-50 rounded-xl border border-gray-200 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-gray-600 text-center italic">
            <strong>Nota:</strong> Esta explicação é simplificada para fins educativos. O funcionamento completo dos medicamentos envolve mecanismos complexos que são avaliados pelo médico durante a consulta. Veja mais sobre nossos <a href="/emagrecimento/tratamentos" className="text-emerald-600 hover:text-emerald-700 underline">tratamentos disponíveis</a>.
          </p>
        </div>
      </div>
    </section>
  );
}

