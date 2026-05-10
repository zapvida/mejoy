export function ImpactStatsSection() {
  const stats = [
    {
      number: '5–10%',
      title: 'Marco clínico inicial',
      description: 'Perder 5% a 10% do peso corporal já costuma melhorar a leitura metabólica em muitos perfis acompanhados.',
      note: 'Resultados individuais variam. A conduta final depende de avaliação clínica.',
    },
    {
      number: '10–15%',
      title: 'Faixa observada em trilhas mais potentes',
      description: 'Em perfis elegíveis e bem acompanhados, algumas estratégias podem alcançar faixas mais robustas de resposta ao longo do tempo.',
      note: 'Faixas médias de estudo, nunca promessa individual.',
    },
    {
      number: '3 frentes',
      title: 'O que sustenta resultado',
      description: 'Triagem organizada, decisão médica e acompanhamento contínuo costumam fazer mais diferença do que medicação isolada.',
      note: 'Rotina, adesão e contexto clínico pesam tanto quanto a escolha terapêutica.',
    },
    {
      number: '1 fluxo',
      title: 'Menos atrito para decidir',
      description: 'Landing, triagem, relatório, pagamento e suporte seguem na mesma narrativa para reduzir abandono e ruído.',
      note: 'Experiência desenhada para clareza, não para pressão comercial.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Impacto em números
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            A jornada fica mais clara quando traduzimos expectativa clínica, acompanhamento e próximos passos em linguagem simples.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-emerald-50 to-orange-50 rounded-2xl p-6 sm:p-8 border-2 border-emerald-100 hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <div className="text-center mb-4">
                <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-orange-600 mb-2">
                  {stat.number}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {stat.title}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                {stat.description}
              </p>
              {stat.note && (
                <p className="text-xs text-gray-600 italic border-t border-emerald-200 pt-3">
                  {stat.note}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-gray-600 text-center italic">
            <strong>Disclaimer:</strong> Estes números resumem marcos clínicos e faixas de estudo. Resultados individuais variam e nunca são garantidos.
          </p>
        </div>
      </div>
    </section>
  );
}
