'use client';

import { motion } from 'framer-motion';
import {
  Palette,
  FileText,
  TrendingUp,
  BarChart3,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import LpacCard from './LpacCard';

const benefits = [
  {
    icon: Palette,
    title: 'Marca da sua clínica',
    desc: 'Logo, domínio e cores. CTAs diferentes por campanha.',
  },
  {
    icon: FileText,
    title: 'Relatórios com IA',
    desc: 'Conteúdo clínico acionável e baseado em evidências.',
  },
  {
    icon: TrendingUp,
    title: 'Aquecimento de leads',
    desc: 'Triagens que geram valor e aumentam conversão.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & métricas',
    desc: 'Volume, conclusão, origem e conversão por CTA.',
  },
  {
    icon: Bell,
    title: 'Notificações/automação',
    desc: 'WhatsApp/E-mail e integrações com CRM.',
  },
  {
    icon: CheckCircle2,
    title: 'Casos reais',
    desc: 'Me Joy e ZapVida operando em produção.',
  },
];

const variants: Array<'emerald' | 'blue' | 'violet' | 'rose' | 'amber' | 'indigo'> = [
  'emerald',
  'blue',
  'violet',
  'rose',
  'amber',
  'indigo',
];

export default function Benefits() {
  return (
    <section id="beneficios" className="py-12 md:py-16 bg-muted/30 relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-4 leading-tight text-balance">
            O que sua empresa ganha
          </h2>
          <p className="text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Recursos poderosos para transformar sua clínica em uma máquina de conversão
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <LpacCard variant={variants[index % variants.length]} size="tile" className="h-full">
                  <div className="flex items-start gap-4 w-full">
                    <div className="w-12 h-12 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:bg-white/40 transition-colors shadow-md border border-white/20">
                      <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white mb-2 drop-shadow-sm">
                        {benefit.title}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">{benefit.desc}</p>
                    </div>
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
