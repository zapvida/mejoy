'use client';

import { FiEye, FiClock, FiShield } from 'react-icons/fi';

import Section from './Section';

interface BenefitsProps {
  data: {
    title: string;
    subtitle?: string;
    cards: { title: string; desc: string }[];
  };
}

export default function Benefits({ data }: BenefitsProps) {
  const benefitIcons = [FiEye, FiClock, FiShield, FiEye, FiClock, FiShield];

  return (
    <Section id="benefits" sectionClassName="bg-gray-50">
      <div className="space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Benefícios</p>
          <h2 className="text-balance text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {data.title}
          </h2>
          {data.subtitle && (
          <p className="mx-auto max-w-prose text-sm text-gray-600 leading-relaxed sm:text-base">
              {data.subtitle}
          </p>
          )}
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.cards.map((card, index) => {
            const Icon = benefitIcons[index % benefitIcons.length] as React.ComponentType<{ className?: string }>;
            return (
              <div
                key={card.title}
                className="group space-y-3 rounded-2xl border-2 border-brand-500/20 bg-gradient-to-br from-white via-brand-50/10 to-white p-6 text-left shadow-lg transition-all hover:shadow-xl hover:scale-105 card-modern glow-brand"
              >
                <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-brand-600">
                  <Icon className="h-4 w-4" />
                  {card.title}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
