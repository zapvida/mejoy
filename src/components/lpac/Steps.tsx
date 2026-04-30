'use client';

import { FiPlay, FiFileText, FiTarget, FiCheckCircle } from 'react-icons/fi';

import Section from './Section';

interface StepsProps {
  data: {
    title: string;
    subtitle?: string;
    items: { title: string; desc: string }[];
  };
}

export default function Steps({ data }: StepsProps) {
  const stepIcons = [FiPlay, FiFileText, FiTarget, FiCheckCircle];

  return (
    <Section id="steps">
      <div className="space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Como funciona</p>
          <h2 className="text-balance text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {data.title}
          </h2>
          {data.subtitle && (
          <p className="mx-auto max-w-prose text-sm text-gray-600 leading-relaxed sm:text-base">
              {data.subtitle}
          </p>
          )}
        </header>

        <ol className="space-y-8 lg:grid lg:grid-cols-2 xl:grid-cols-4 lg:gap-8 lg:space-y-0">
          {data.items.map((item, index) => {
            const Icon = stepIcons[index % stepIcons.length] as React.ComponentType<{ className?: string }>;
            return (
              <li
                key={item.title}
                className="rounded-2xl border-2 border-brand-500/20 bg-gradient-to-br from-white via-brand-50/10 to-white p-5 shadow-lg transition-all hover:shadow-xl hover:scale-105 lg:flex lg:flex-col lg:gap-5 card-modern glow-brand"
              >
                <div className="flex gap-4 lg:flex-col lg:gap-4">
                  <div className="relative flex flex-col items-center">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 font-semibold text-white shadow-lg glow-brand">
                      {index + 1}
                    </span>
                    {index !== data.items.length - 1 && (
                      <span className="mt-2 block h-full w-px bg-brand-500/20 lg:hidden" aria-hidden="true" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                      <Icon className="h-4 w-4" />
                      Passo {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">{item.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
