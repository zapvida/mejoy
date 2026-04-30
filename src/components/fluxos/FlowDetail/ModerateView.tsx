'use client';

import Link from 'next/link';
import SimpleView from './SimpleView';
import type { FluxoEntry } from '@/lib/fluxos-mejoy/types';

interface ModerateViewProps {
  fluxo: FluxoEntry;
}

export default function ModerateView({ fluxo }: ModerateViewProps) {
  return (
    <div className="space-y-8">
      <SimpleView fluxo={fluxo} />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          URLs e Integrações
        </h3>
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            URLs principais
          </h4>
          <ul className="space-y-1 text-sm">
            {fluxo.moderado.urls.map((url, i) => (
              <li key={i}>
                <Link
                  href={url}
                  className="text-brand-600 hover:underline dark:text-brand-400"
                >
                  {url}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Integrações
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {fluxo.moderado.integracoes.join(', ')}
          </p>
        </div>
        <Link
          href={
            fluxo.tipo === 'produto'
              ? `/${fluxo.slug}`
              : `/triagem/${fluxo.slug}`
          }
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
        >
          {fluxo.moderado.cta}
        </Link>
      </div>
    </div>
  );
}
