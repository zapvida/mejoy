'use client';

import { motion } from 'framer-motion';
import {
  Package,
  Stethoscope,
  Brain,
  FileText,
  MessageCircle,
  Shield,
} from 'lucide-react';
import LpacCard from '@/components/b2b/LpacCard';

const benefits = [
  {
    icon: Package,
    title: 'Protocolos completos',
    desc: 'Produtos combinados por objetivo. Não compras soltas.',
  },
  {
    icon: Stethoscope,
    title: 'Curadoria médica',
    desc: 'Criados e revisados por médico. Boas práticas e segurança.',
  },
  {
    icon: Brain,
    title: 'Triagem inteligente',
    desc: 'Perguntas rápidas indicam o melhor caminho. Sem compromisso.',
  },
  {
    icon: FileText,
    title: 'Orientação clara',
    desc: 'Instruções de uso, duração e cuidados em cada protocolo.',
  },
  {
    icon: MessageCircle,
    title: 'Suporte humano',
    desc: 'WhatsApp e e-mail para dúvidas sobre os produtos.',
  },
  {
    icon: Shield,
    title: 'Segurança e transparência',
    desc: 'Checkout protegido, LGPD. Sem promessas milagrosas.',
  },
];

const variants: Array<'amber' | 'blue' | 'violet' | 'rose' | 'emerald' | 'indigo'> = [
  'amber', /* brand laranja - primeiro card destaque */
  'blue',
  'violet',
  'rose',
  'emerald',
  'indigo',
];

export default function BenefitsB2C() {
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
            Por que a Me Joy
          </h2>
          <p className="text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Curadoria médica. Segurança. Resultados reais.
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

