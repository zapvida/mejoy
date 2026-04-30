'use client';

import Section from './Section';

interface SocialProofProps {
  data: {
    title: string;
    subtitle: string;
    quotes: string[];
  };
}

export default function SocialProof({ data }: SocialProofProps) {
  return (
    <Section id="social-proof" sectionClassName="bg-gray-50">
      <div className="space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Resultados reais</p>
          <h2 className="text-balance text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{data.title}</h2>
          <p className="mx-auto max-w-prose text-sm text-gray-600 leading-relaxed sm:text-base">{data.subtitle}</p>
        </header>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.quotes.map((quote, index) => (
            <blockquote key={index} className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{quote}&rdquo;</p>
            </blockquote>
          ))}
        </div>
      </div>
    </Section>
  );
}