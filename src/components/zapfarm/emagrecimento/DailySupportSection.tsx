export function DailySupportSection() {
  const supportTypes = [
    {
      title: 'Ajuste de medicação',
      description: 'Monitoramento contínuo da resposta ao tratamento e ajustes de dosagem quando necessário, sempre com supervisão médica.',
      icon: '💊',
    },
    {
      title: 'Dúvidas rápidas',
      description: 'Canal de comunicação direto com a equipe para esclarecer dúvidas sobre o tratamento, efeitos colaterais ou qualquer preocupação.',
      icon: '💬',
    },
    {
      title: 'Revisão de exames',
      description: 'Acompanhamento de exames laboratoriais e avaliação de progresso, garantindo que tudo está dentro do esperado.',
      icon: '📊',
    },
    {
      title: 'Apoio emocional e adesão',
      description: 'Suporte para manter a motivação, lidar com desafios e garantir que você siga o tratamento da melhor forma possível.',
      icon: '🤝',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Como o time te acompanha no dia a dia
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Suporte contínuo em todas as etapas do tratamento
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {supportTypes.map((support, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-emerald-50 to-orange-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-emerald-100 hover:shadow-xl transition-all"
            >
              <div className="text-4xl sm:text-5xl mb-4 text-center">{support.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 text-center">
                {support.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {support.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 bg-emerald-50 rounded-xl border border-emerald-200 max-w-2xl mx-auto">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">
            <strong className="text-emerald-900">Importante:</strong> O suporte contínuo é fundamental para o sucesso do tratamento. Você não está sozinho(a) nessa jornada.
          </p>
        </div>
      </div>
    </section>
  );
}

