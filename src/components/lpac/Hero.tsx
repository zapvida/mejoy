'use client';

import React from 'react';
import { FiActivity, FiShield, FiClock, FiCheckCircle, FiChevronRight } from 'react-icons/fi';

import Section from './Section';

type HeroData = {
  badge?: string;
  title: string;
  subtitle: string;
  bullets: string[];
  cta: string;
  cta_microcopy: string;
  trustline: string;
  metrics?: Array<{ label: string; value: string }>;
};

export default function Hero({ data, onCta }: { data: HeroData; onCta: () => void }) {
  const bulletIcons = [FiCheckCircle, FiShield, FiClock];
  const metrics = data.metrics || [
    { label: 'Pessoas atendidas', value: '5K+' },
    { label: 'Satisfação', value: '98%' },
    { label: 'Tempo médio', value: '3 min' },
  ];

  return (
    <Section
      sectionClassName="relative overflow-hidden bg-transparent text-gray-900"
      className="relative overflow-hidden rounded-[2.5rem] border-intense bg-gradient-to-br from-white via-brand-50/30 to-white py-12 sm:py-16 lg:py-20 glow-brand"
    >
      {/* Enhanced background effects - lighter and more pleasant */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-brand-500/08 blur-3xl pulse-subtle" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-400/06 blur-3xl pulse-subtle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-brand-300/04 blur-2xl pulse-subtle" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] lg:items-start">
        <div className="space-y-6">
          <div className="space-y-4">
            {data.badge && (
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-brand-500/20 bg-gradient-to-r from-brand-500/05 to-brand-400/05 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-600 sm:text-sm">
                {data.badge}
              </div>
            )}
            <h1 className="text-balance text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              <span className="block max-w-[18ch]">
                <span className="text-black">{data.title}</span>
              </span>
            </h1>
            <p className="max-w-prose text-base leading-relaxed text-gray-600 sm:text-lg">{data.subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {data.bullets.map((bullet, index) => {
              const Icon = bulletIcons[index % bulletIcons.length] as React.ComponentType<{ className?: string }>;
              const visibility = index > 1 ? 'hidden sm:inline-flex' : 'inline-flex';
              return (
                <span
                  key={bullet}
                  className={`${visibility} items-center gap-3 rounded-2xl border-2 border-brand-500/20 bg-gradient-to-r from-brand-500/05 to-brand-400/05 px-5 py-3 text-sm text-gray-700 card-modern`}
                >
                  <Icon className="h-4 w-4 text-brand-500" />
                  <span className="leading-relaxed font-medium">{bullet}</span>
                </span>
              );
            })}
          </div>

          <div className="space-y-4">
            <button
              onClick={onCta}
              className="group inline-flex w-full max-w-sm items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 px-7 py-4 font-semibold text-white shadow-[0_8px_32px_rgba(0,200,83,0.25)] transition-all hover:shadow-[0_12px_40px_rgba(0,200,83,0.35)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white glow-brand"
              aria-label={data.cta}
            >
              <FiActivity className="h-5 w-5" />
              {data.cta}
              <FiChevronRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
            </button>
            <p className="text-sm font-medium leading-relaxed text-gray-500">{data.cta_microcopy}</p>
          </div>

          <div className="text-xs uppercase tracking-[0.12em] text-brand-600 sm:text-sm">{data.trustline}</div>
        </div>

        <div className="space-y-6 rounded-3xl border-intense bg-gradient-to-br from-white via-brand-50/10 to-white p-6 backdrop-blur-sm glow-brand card-modern">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-600">O que você recebe</p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Protocolos completos com produtos selecionados e orientações claras de uso.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {metrics.map((metric, index) => (
              <div key={index} className="rounded-2xl border-2 border-brand-500/15 bg-gradient-to-br from-brand-500/03 to-brand-400/03 px-4 py-3 text-center card-modern">
                <div className="text-lg font-semibold text-brand-500">{metric.label}</div>
                <div className="text-xs leading-relaxed text-gray-500 font-medium">{metric.value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border-2 border-brand-500/20 bg-gradient-to-r from-brand-500/05 to-brand-400/05 px-4 py-5 text-sm leading-relaxed text-brand-600 card-modern">
            💡 Protocolos pensados para resolver problemas reais, com segurança e orientação médica.
          </div>
        </div>
      </div>
    </Section>
  );
}
