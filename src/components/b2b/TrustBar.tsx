'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, TrendingUp } from 'lucide-react';
import LpacCard from './LpacCard';

const trustItems = [
  { icon: Zap, value: '4 min', label: 'Ativação', variant: 'indigo' as const },
  { icon: Shield, value: '100+', label: 'Clínicas', variant: 'cyan' as const },
  { icon: TrendingUp, value: '+37%', label: 'Conversão', variant: 'amber' as const },
];

export default function TrustBar() {
  return (
    <section className="py-12 md:py-16 bg-muted/40 border-y border-[color:var(--border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <LpacCard variant={item.variant} size="tile" className="justify-center">
                  <div className="text-center w-full">
                    <div className="w-12 h-12 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 group-hover:bg-white/40 transition-colors shadow-md border border-white/20">
                      <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-sm">
                      {item.value}
                    </div>
                    <div className="text-xs sm:text-sm text-white/90 font-medium">{item.label}</div>
                  </div>
                </LpacCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
