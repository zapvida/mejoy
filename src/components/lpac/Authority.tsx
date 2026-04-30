'use client';

import Section from './Section';

interface AuthorityProps {
  data: {
    title: string;
    desc: string;
  };
}

export default function Authority({ data }: AuthorityProps) {
  return (
    <Section id="authority">
      <div className="space-y-8">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Base científica</p>
          <h2 className="text-balance text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {data.title}
          </h2>
          <p className="mx-auto max-w-prose text-sm text-gray-600 leading-relaxed sm:text-base">
            {data.desc}
          </p>
        </header>
      </div>
    </Section>
  );
}
