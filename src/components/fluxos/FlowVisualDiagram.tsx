'use client';

import { ArrowDown } from 'lucide-react';
import type { FluxoEntry } from '@/lib/fluxos-mejoy/types';

interface FlowVisualDiagramProps {
  fluxo: FluxoEntry;
}

export default function FlowVisualDiagram({ fluxo }: FlowVisualDiagramProps) {
  const resultadoFinal =
    fluxo.tipo === 'produto' ? 'Produto entregue' : 'Triagem concluída';

  return (
    <div className="mx-auto max-w-md">
      <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
        Jornada do usuário — passo a passo
      </h3>
      <div className="flex flex-col items-center gap-2">
        {fluxo.simples.passos.map((passo, i) => (
          <div key={i} className="flex w-full flex-col items-center">
            <div
              className="flex w-full items-center gap-3 rounded-lg border p-4 shadow-sm"
              style={{
                borderColor: `${fluxo.cor}40`,
                backgroundColor: `${fluxo.cor}08`,
              }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: fluxo.cor }}
              >
                {i + 1}
              </span>
              <span className="text-gray-800 dark:text-gray-200">{passo}</span>
            </div>
            {i < fluxo.simples.passos.length - 1 && (
              <ArrowDown className="my-1 h-5 w-5 text-gray-400" aria-hidden />
            )}
          </div>
        ))}
        <div
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border-2 p-4 font-semibold"
          style={{
            borderColor: fluxo.cor,
            backgroundColor: `${fluxo.cor}15`,
            color: fluxo.cor,
          }}
        >
          {resultadoFinal}
        </div>
      </div>
    </div>
  );
}
