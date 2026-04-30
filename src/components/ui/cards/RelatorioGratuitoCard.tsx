type ConteudoType =
  | string
  | {
      hipoteses?: string;
      causas?: string;
      fisiopatologia?: string;
      elucidacao?: string;
      condutas?: string;
    };

type RelatorioGratuitoCardProps = {
  titulo: string;
  descricao: string;
  conteudo?: ConteudoType;
  data?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export default function RelatorioGratuitoCard({
  titulo,
  descricao,
  conteudo,
  data,
  onClick,
  children,
}: RelatorioGratuitoCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-gradient-to-br from-brand via-black to-background 
      border border-brand rounded-3xl shadow-xl 
      p-5 sm:p-6 flex flex-col gap-5 hover:scale-[1.02] transition"
    >
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-brand">{titulo}</h2>
          <p className="text-base sm:text-sm text-white/70">{descricao}</p>
        </div>
        {data && (
          <span className="text-xs text-white/60 self-start sm:self-center">
            {(() => {
              try {
                const d = new Date(data);
                return isNaN(d.getTime()) ? 'Data inválida' : d.toLocaleDateString('pt-BR');
              } catch {
                return 'Data inválida';
              }
            })()}
          </span>
        )}
      </div>

      {typeof conteudo === 'string' ? (
        conteudo ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-base sm:text-lg text-white/80 whitespace-pre-line">
              {conteudo}
            </p>
          </div>
        ) : (
          <p className="text-base text-white/60">⚠️ Nenhuma informação disponível.</p>
        )
      ) : (
        conteudo &&
        [
          { key: 'hipoteses', label: '🧠 Hipóteses' },
          { key: 'causas', label: '🔍 Causas Prováveis' },
          { key: 'fisiopatologia', label: '🔬 Fisiopatologia' },
          { key: 'elucidacao', label: '💡 Elucidação' },
          { key: 'condutas', label: '🎯 Condutas Básicas' },
        ].map(
          ({ key, label }) =>
            (conteudo as any)[key] && (
              <div
                key={key}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <details className="group border border-white/20 rounded-md shadow-md p-3">
                  <summary
                    className="cursor-pointer flex items-center justify-between text-base sm:text-lg font-semibold text-brand"
                    aria-label={`${label} - expandir ou recolher`}
                  >
                    {label}
                    <span className="transition-transform group-open:rotate-180">
                      <span className="block group-open:hidden">⌄</span>
                      <span className="hidden group-open:block">⌃</span>
                    </span>
                  </summary>
                  <p className="mt-2 text-base sm:text-lg text-white/80 whitespace-pre-line">
                    {(conteudo as any)[key]}
                  </p>
                </details>
              </div>
            )
        )
      )}

      {children && <div>{children}</div>}
    </div>
  );
}