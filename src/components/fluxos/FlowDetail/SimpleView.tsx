'use client';

import FlowVisualDiagram from '../FlowVisualDiagram';
import type { FluxoEntry } from '@/lib/fluxos-mejoy/types';

interface SimpleViewProps {
  fluxo: FluxoEntry;
}

export default function SimpleView({ fluxo }: SimpleViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          {fluxo.simples.titulo}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{fluxo.simples.frase}</p>
      </div>

      <FlowVisualDiagram fluxo={fluxo} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Quem paga
          </h4>
          <p className="font-medium text-gray-900 dark:text-white">
            {fluxo.simples.quemPaga}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Receita
          </h4>
          <p className="font-medium text-gray-900 dark:text-white">
            {fluxo.simples.receita}
          </p>
        </div>
      </div>
    </div>
  );
}
