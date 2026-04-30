'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import type { NivelApresentacao } from '@/lib/fluxos-mejoy/types';

const NIVELS: { key: NivelApresentacao; label: string }[] = [
  { key: 'simples', label: 'Simples' },
  { key: 'moderado', label: 'Moderado' },
  { key: 'completo', label: 'Completo' },
];

interface ModeSelectorProps {
  currentNivel?: NivelApresentacao;
  basePath?: string;
  slug?: string;
}

export default function ModeSelector({
  basePath = '/fluxos',
  slug,
}: ModeSelectorProps) {
  const router = useRouter();
  const path = slug ? `${basePath}/${slug}` : basePath;

  return (
    <div className="flex flex-wrap gap-2">
      {NIVELS.map(({ key, label }) => {
        const href = `${path}?nivel=${key}`;
        const isActive =
          (router.query.nivel as string) === key ||
          (!router.query.nivel && key === 'simples');

        return (
          <Link
            key={key}
            href={href}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
