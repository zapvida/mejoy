'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

import Section from './Section';

interface FAQProps {
  data: { q: string; a: string }[];
}

export default function FAQ({ data }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <Section id="faq" sectionClassName="bg-gray-50">
      <div className="space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">FAQ</p>
          <h2 className="text-balance text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Perguntas frequentes
          </h2>
          <p className="mx-auto max-w-prose text-sm text-gray-600 leading-relaxed sm:text-base">
            As dúvidas mais comuns sobre o relatório e como usamos suas informações.
          </p>
        </header>

        <div className="divide-y divide-brand-500/15 rounded-3xl border-intense bg-gradient-to-br from-white via-brand-50/10 to-white shadow-lg glow-brand card-modern">
          {data.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.q}>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-brand-50/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                >
                  <span className="text-base font-medium leading-snug text-gray-900 sm:text-lg">{item.q}</span>
                  <FiChevronDown
                    className={`h-5 w-5 text-brand-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-live="polite"
                  className={`px-6 pb-5 text-sm leading-relaxed text-gray-700 transition-all ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
                  }`}
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
