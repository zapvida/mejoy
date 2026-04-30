'use client';

import { FiCheckCircle, FiTrendingUp, FiClock } from 'react-icons/fi';

import Section from './Section';

interface SuccessCase {
  title: string;
  badge: string;
  desc: string;
  metric: string;
}

interface SuccessCasesProps {
  data: {
    title: string;
    subtitle: string;
    cases: SuccessCase[];
  };
}

export default function SuccessCases({ data }: SuccessCasesProps) {
  return (
    <Section id="success-cases" sectionClassName="bg-gray-50">
      <div className="space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Casos reais</p>
          <h2 className="text-balance text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {data.title}
          </h2>
          <p className="mx-auto max-w-prose text-sm text-gray-600 leading-relaxed sm:text-base">
            {data.subtitle}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {data.cases.map((caseItem, index) => {
            const colors = [
              { bg: 'from-green-500 to-green-600', badge: 'bg-green-100 text-green-700', metric: 'text-green-600' },
              { bg: 'from-blue-500 to-blue-600', badge: 'bg-blue-100 text-blue-700', metric: 'text-blue-600' },
            ];
            const color = colors[index % colors.length];
            
            return (
              <div
                key={caseItem.title}
                className={`group rounded-2xl border-2 border-brand-500/20 bg-gradient-to-br ${color.bg} p-6 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 card-modern glow-brand`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${color.badge} bg-white/90`}>
                        <FiCheckCircle className="h-3 w-3" />
                        {caseItem.badge}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white">{caseItem.title}</h3>
                  
                  <p className="text-sm text-white/90 leading-relaxed">{caseItem.desc}</p>
                  
                  <div className="flex items-center gap-2 pt-2">
                    {caseItem.metric.includes('%') ? (
                      <FiTrendingUp className={`h-5 w-5 ${color.metric} bg-white/20 rounded p-1`} />
                    ) : (
                      <FiClock className={`h-5 w-5 ${color.metric} bg-white/20 rounded p-1`} />
                    )}
                    <span className="text-sm font-semibold text-white">{caseItem.metric}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

