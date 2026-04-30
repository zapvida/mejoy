'use client';

import { FiCheckCircle } from 'react-icons/fi';

import Section from './Section';

interface ResourcesProps {
  data: {
    title: string;
    items: string[];
  };
}

export default function Resources({ data }: ResourcesProps) {
  return (
    <Section id="resources" sectionClassName="bg-white">
      <div className="space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Recursos</p>
          <h2 className="text-balance text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {data.title}
          </h2>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border-2 border-brand-500/20 bg-gradient-to-r from-brand-500/05 to-brand-400/05 p-4 card-modern"
            >
              <FiCheckCircle className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

