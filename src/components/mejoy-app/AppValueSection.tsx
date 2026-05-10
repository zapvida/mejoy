'use client';

import { useEffect } from 'react';

import type { ProductAppValue } from '@mejoy/api-contracts/mobile';
import { track } from '@/lib/analytics';

export function AppValueSection({
  value,
  surface,
  title = 'Ganhe acesso ao App MeJoy Premium',
  compact = false,
  limit,
}: {
  value: ProductAppValue;
  surface: 'pdp' | 'checkout' | 'protocols' | 'report';
  title?: string;
  compact?: boolean;
  limit?: number;
}) {
  useEffect(() => {
    track('app_value_block_viewed', {
      surface,
      tier: value.appTier,
      features: value.featureMatrix.length,
    });
  }, [surface, value.appTier, value.featureMatrix.length]);

  const featureLimit = limit ?? (compact ? 4 : value.featureMatrix.length);
  const features = value.featureMatrix.slice(0, featureLimit);

  return (
    <section className="rounded-[32px] border border-[#d7e3da] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
            App MeJoy Premium incluso
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {value.summary}
          </p>
        </div>
        <div className="rounded-[26px] border border-emerald-100 bg-[#f6fbf7] px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Ecossistema liberado
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">
            {value.appIncluded ? `${value.featureMatrix.length} frentes entre app e continuidade` : 'Sem app incluso'}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Todo comprador entra no ecossistema nativo; os planos maiores aprofundam suporte, prevencao e leitura longitudinal.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.id}
            className={`rounded-[28px] border p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] ${
              feature.featured
                ? 'border-emerald-200 bg-[#f6fbf7]'
                : 'border-zinc-200 bg-[#fcfcfb]'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {feature.featured ? 'Feature premium' : 'Camada de continuidade'}
              </p>
              <span className="rounded-full border border-white/80 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 shadow-sm">
                Incluso
              </span>
            </div>
            <h3 className="mt-4 text-xl font-bold tracking-[-0.03em] text-slate-950">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              <strong className="font-semibold text-slate-950">No web:</strong> {feature.webValue}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              <strong className="font-semibold text-slate-950">No app:</strong> {feature.appValue}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
