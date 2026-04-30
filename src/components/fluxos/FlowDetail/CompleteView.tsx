'use client';

import ModerateView from './ModerateView';
import type { FluxoEntry } from '@/lib/fluxos-mejoy/types';

interface CompleteViewProps {
  fluxo: FluxoEntry;
}

export default function CompleteView({ fluxo }: CompleteViewProps) {
  return (
    <div className="space-y-8">
      <ModerateView fluxo={fluxo} />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Detalhes técnicos e operacionais
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              APIs
            </h4>
            <ul className="list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
              {fluxo.completo.apis.map((api, i) => (
                <li key={i}>{api}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Métricas
            </h4>
            <ul className="list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
              {fluxo.completo.metricas.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Escala
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {fluxo.completo.escala}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Riscos
          </h4>
          <ul className="list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
            {fluxo.completo.riscos.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
