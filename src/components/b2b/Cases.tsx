'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import LpacCard from './LpacCard';

const cases = [
  {
    client: 'MeJoy',
    url: 'https://zapfarm.com.br',
    desc: 'White-label nutricional + triagem GI com CTAs e métricas.',
    metric: '+37%',
    metricLabel: 'conversão',
    metricIcon: TrendingUp,
    variant: 'emerald' as const,
  },
  {
    client: 'ZapVida',
    url: 'https://zapvida.com/partners/clinicas',
    desc: 'Aquecimento de leads e pós-consulta com automações.',
    metric: '24h',
    metricLabel: 'go-live',
    metricIcon: CheckCircle2,
    variant: 'blue' as const,
  },
];

export default function Cases() {
  return (
    <section id="cases" className="py-20 md:py-28 bg-surface/50 relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-4 leading-tight text-balance">
            Casos de sucesso
          </h2>
          <p className="text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Clínicas que já estão usando nossa plataforma em produção
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {cases.map((caseItem, index) => {
            const MetricIcon = caseItem.metricIcon;
            return (
              <motion.a
                key={caseItem.client}
                href={caseItem.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="block focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-600)] focus:ring-offset-2 rounded-2xl transition-transform hover:scale-[1.02]"
              >
                <LpacCard variant={caseItem.variant} size="panel">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="lpac-chip rounded-full px-3 py-1.5 inline-flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-medium">Em produção</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-sm">
                      {caseItem.client}
                    </h3>
                    <p className="text-white/90 mb-6 leading-relaxed">{caseItem.desc}</p>

                    <div className="lpac-chip rounded-full px-3 py-1.5 inline-flex items-center gap-2">
                      <MetricIcon className="w-4 h-4 text-white" />
                      <span className="font-bold text-white">{caseItem.metric}</span>
                      <span className="text-white/90">{caseItem.metricLabel}</span>
                    </div>
                  </div>
                </LpacCard>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
