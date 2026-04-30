'use client';

import { LinhaDoTempoItem } from '@/types/relatorio';
import { Clock } from 'lucide-react';

interface LinhaDoTempoSectionProps {
  linhaDoTempo?: LinhaDoTempoItem[];
}

export const LinhaDoTempoSection = ({ linhaDoTempo }: LinhaDoTempoSectionProps) => {
  if (!linhaDoTempo || linhaDoTempo.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-brand-600 mb-6">🕒 Linha do Tempo da Saúde</h2>
      <div className="relative border-l-2 border-brand pl-6">
        {linhaDoTempo.map((item, index) => (
          <div key={index} className="mb-8 relative">
            <span className="absolute -left-[15px] top-1 w-3 h-3 rounded-full bg-brand-500 border-2 border-white" />
            <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground dark:text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{item.data || 'Data não informada'}</span>
            </div>
            <div className="text-base font-semibold text-foreground dark:text-muted-foreground">
              {item.evento}
            </div>
            {item.detalhe && (
              <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">{item.detalhe}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};