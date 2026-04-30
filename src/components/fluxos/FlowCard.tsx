'use client';

import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import type { FluxoEntry } from '@/lib/fluxos-mejoy/types';

interface FlowCardProps {
  fluxo: FluxoEntry;
}

export default function FlowCard({ fluxo }: FlowCardProps) {
  const Icon = fluxo.icone;
  const isProduto = fluxo.tipo === 'produto';

  return (
    <div className="group flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-brand-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <Link
        href={`/fluxos/${fluxo.slug}`}
        className="flex flex-1 flex-col p-5"
      >
        <div
          className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${fluxo.cor}20` }}
        >
          <Icon className="h-5 w-5" style={{ color: fluxo.cor }} />
        </div>
        <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
          {fluxo.nome}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {fluxo.simples.frase}
        </p>
        {isProduto && (
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
            {fluxo.monetizacao.valores}
          </p>
        )}
        <span className="mt-auto flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:underline dark:text-brand-400">
          Ver fluxo
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
      {isProduto && (
        <div className="border-t border-gray-100 px-5 py-3 dark:border-gray-700">
          <a
            href={
              fluxo.slug === 'assinatura-6m'
                ? '/pricing'
                : `/${fluxo.slug}`
            }
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {fluxo.slug === 'assinatura-6m'
              ? 'Ver assinatura'
              : 'Ir para o produto'}
          </a>
        </div>
      )}
    </div>
  );
}
