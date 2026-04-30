'use client';

interface Evento {
  data: string | Date;
  descricao: string;
}

interface HealthTimelineProps {
  eventos: Evento[];
}

const formatDate = (data: string | Date) => {
  if (typeof data === 'string') return data;
  if (data instanceof Date) return data.toLocaleDateString('pt-BR');
  return 'Data não disponível';
};

const statusIcon = (index: number) => {
  const icons = ['✔️', '📄', '🔓'];
  return icons[index] || '📌';
};

const statusLabel = (index: number) => {
  const labels = ['Triagem completa', 'Relatório gerado', 'Premium desbloqueado'];
  return labels[index] || 'Evento registrado';
};

export default function HealthTimeline({ eventos }: HealthTimelineProps) {
  if (!eventos || eventos.length === 0) {
    return (
        <div className="bg-bg border border-border px-4 sm:px-6 lg:px-8 py-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-brand mb-2 text-center">
          🗓️ Linha do Tempo da Saúde
        </h2>
            <p className="text-sm text-fg/70 text-center">
          Nenhum evento registrado.
        </p>
      </div>
    );
  }

  return (
        <div className="bg-bg border border-border px-4 sm:px-6 lg:px-8 py-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-brand mb-6 text-center">
        🗓️ Linha do Tempo da Saúde
      </h2>
      <div className="flex flex-col gap-4 overflow-x-auto">
        {eventos.map((evento, index) => (
          <div
            key={index}
                className="flex items-start gap-4 bg-bg/50 p-4 rounded-xl border border-border
            hover:bg-black/70 transition w-full min-w-[280px] sm:min-w-[360px]"
          >
                <div className="flex-shrink-0 w-10 h-10 bg-brand text-white rounded-full
            flex items-center justify-center shadow-md text-lg">
              {statusIcon(index)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs bg-brand/20 text-brand px-2 py-0.5 rounded-full">
                  {statusLabel(index)}
                </span>
                <span className="text-xs text-fg/70">
                  {formatDate(evento.data)}
                </span>
              </div>
              <p className="text-sm md:text-base text-white leading-relaxed">
                {evento.descricao}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}