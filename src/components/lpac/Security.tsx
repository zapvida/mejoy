'use client';

import { FiLock } from 'react-icons/fi';

import Section from './Section';

interface SecurityProps {
  data: {
    title: string;
    lead: string;
  };
}

export default function Security({ data }: SecurityProps) {
  return (
    <Section id="security">
      <div className="rounded-3xl border-intense bg-gradient-to-br from-white via-brand-50/10 to-white px-6 py-10 shadow-lg sm:px-10 sm:py-12 glow-brand card-modern">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-500/20 to-brand-400/20 text-brand-600 glow-brand">
              <FiLock className="h-6 w-6" />
            </span>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">{data.title}</h2>
              <p className="max-w-prose text-sm text-gray-700 leading-relaxed">{data.lead}</p>
            </div>
          </div>

          <div className="text-xs uppercase tracking-[0.18em] text-brand-600">
            Criptografia ponta a ponta • LGPD
          </div>
        </div>
      </div>
    </Section>
  );
}
