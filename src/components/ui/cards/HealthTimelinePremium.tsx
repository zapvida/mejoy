import React from 'react';

interface Evento {
  data: string | Date;
  descricao: string;
}

interface HealthTimelinePremiumProps {
  eventos: Evento[];
}

const formatDate = (data: string | Date) => {
  if (typeof data === 'string') return data;
  if (data instanceof Date) return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  return 'Data não disponível';
};

const statusIcon = (index: number) => {
  const icons = ['✅', '📊', '🔓'];
  return icons[index] || '📌';
};

const statusLabel = (index: number) => {
  const labels = ['Triagem completa', 'Relatório gerado', 'Premium desbloqueado'];
  return labels[index] || 'Evento registrado';
};

export default function HealthTimelinePremium({ eventos }: HealthTimelinePremiumProps) {
  if (!eventos || eventos.length === 0) {
    return (
      <div className="bg-gradient-to-r from-brand to-brand px-4 sm:px-6 lg:px-8 py-6 rounded-xl border border-brand shadow-xl">
        <h2 className="text-2xl font-bold text-brand mb-2 text-center">
          🗓️ Linha do Tempo da Saúde Premium
        </h2>
        <p className="text-sm text-brand-200 text-center">Nenhum evento registrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-brand to-brand px-4 sm:px-6 lg:px-8 py-6 rounded-xl border border-brand shadow-xl">
      <h2 className="text-2xl font-bold text-brand mb-6 text-center">
        🗓️ Linha do Tempo da Saúde Premium
      </h2>
      <div className="flex flex-col gap-4 overflow-x-auto">
        {eventos.map((evento, index) => (
          <div
            key={index}
            className="flex items-start gap-4 bg-black/50 p-4 rounded-lg border border-brand hover:bg-black/70 transition w-full min-w-[280px] sm:min-w-[350px]"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center shadow-md text-xl">
              {statusIcon(index)}
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs bg-brand text-white px-2 py-0.5 rounded-full">
                  {statusLabel(index)}
                </span>
                <span className="text-sm text-brand">
                  {formatDate(evento.data)}
                </span>
              </div>
              <p className="text-base text-brand-200 leading-relaxed">
                {evento.descricao}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}