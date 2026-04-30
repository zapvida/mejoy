export function AnvisaComplianceSection() {
  const compliancePoints = [
    {
      title: 'Avaliação médica com endocrinologista',
      description: 'Todo tratamento começa com uma avaliação completa feita por um médico endocrinologista credenciado, que analisa seu histórico, exames e condições de saúde.',
      icon: '👨‍⚕️',
    },
    {
      title: 'Prescrição apenas quando indicada',
      description: 'Medicamentos são prescritos apenas quando há indicação médica adequada, seguindo critérios estabelecidos pelas diretrizes médicas e normas da ANVISA.',
      icon: '📋',
    },
    {
      title: 'Farmácias parceiras com retenção de receita',
      description: 'Trabalhamos apenas com farmácias credenciadas que seguem todas as normas de segurança, incluindo retenção de receita conforme exigido pela ANVISA.',
      icon: '💊',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            De acordo com as novas normas da ANVISA
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Segurança e responsabilidade em cada etapa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-10">
          {compliancePoints.map((point, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-green-200 hover:shadow-xl transition-all"
            >
              <div className="text-4xl sm:text-5xl mb-4 text-center">{point.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 text-center">
                {point.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 sm:p-8 max-w-4xl mx-auto mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center">
            ⚠️ Disclaimer importante
          </h3>
          <ul className="space-y-3 text-sm sm:text-base text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-yellow-600 mt-1">•</span>
              <span>
                <strong>Todo tratamento é indicado e acompanhado por médicos, conforme normas do CFM e ANVISA.</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-600 mt-1">•</span>
              <span>
                <strong>Este site não substitui consulta médica presencial quando necessária.</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-600 mt-1">•</span>
              <span>
                <strong>Resultados variam de pessoa para pessoa e não são garantidos.</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-600 mt-1">•</span>
              <span>
                <strong>Medicamentos para emagrecimento são controlados e exigem prescrição médica.</strong>
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 sm:p-8 max-w-4xl mx-auto">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">
            <strong className="text-blue-900">Nova regulamentação ANVISA:</strong> Desde 2024, a ANVISA estabeleceu novas regras para prescrição e dispensação de medicamentos para emagrecimento. Nossa plataforma está 100% alinhada com essas normas, garantindo segurança e legalidade em todo o processo.
          </p>
        </div>
      </div>
    </section>
  );
}

