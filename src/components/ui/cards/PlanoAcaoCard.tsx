interface PlanoAcaoProps {
  planoAcao: {
    sono?: string;
    nutricao?: string;
    saudeMental?: string;
    atividadeFisica?: string;
    suplementacao?: string;
    checkups?: string;
  };
}

export default function PlanoAcaoCard({ planoAcao }: PlanoAcaoProps) {
  const itens = [
    { titulo: '🛌 Sono', conteudo: planoAcao.sono },
    { titulo: '🍽️ Nutrição', conteudo: planoAcao.nutricao },
    { titulo: '🧠 Saúde Mental', conteudo: planoAcao.saudeMental },
    { titulo: '🏃‍♂️ Atividade Física', conteudo: planoAcao.atividadeFisica },
    { titulo: '💊 Suplementação', conteudo: planoAcao.suplementacao },
    { titulo: '🩺 Check-ups', conteudo: planoAcao.checkups },
  ];

  return (
    <div className="w-full bg-black/50 backdrop-blur-md border border-brand rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
      <h2 className="text-2xl sm:text-3xl font-bold text-brand">
        🚀 Plano de Ação Personalizado
      </h2>

      {itens.map(
        (item) =>
          item.conteudo && (
            <div key={item.titulo} className="flex flex-col gap-1">
              <h3 className="text-base sm:text-lg font-semibold text-brand-300">
                {item.titulo}
              </h3>
              <p className="text-sm sm:text-base text-white whitespace-pre-line leading-relaxed">
                {item.conteudo.replace(/^[-–]\s?/gm, '')}
              </p>
            </div>
          )
      )}
    </div>
  );
}