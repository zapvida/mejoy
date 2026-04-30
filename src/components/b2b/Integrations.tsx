'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Database, Link2, BarChart3, Mail, GitBranch } from 'lucide-react';
import LpacCard from './LpacCard';

const integrations = [
  { icon: MessageCircle, name: 'WhatsApp', desc: 'Notificações automáticas' },
  { icon: Database, name: 'CRM', desc: 'Integração via webhook' },
  { icon: Link2, name: 'UTM', desc: 'Tracking de origem' },
  { icon: BarChart3, name: 'Analytics', desc: 'Métricas em tempo real' },
  { icon: Mail, name: 'E-mail', desc: 'Automações de follow-up' },
  { icon: GitBranch, name: 'Webhooks', desc: 'Conecte com qualquer sistema' },
];

const variants: Array<'emerald' | 'blue' | 'orange' | 'violet' | 'cyan' | 'rose'> = ['emerald', 'blue', 'orange', 'violet', 'cyan', 'rose'];

export default function Integrations() {
  return (
    <section id="integracoes" className="py-16 md:py-20 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4 leading-tight text-balance">
            Integrações
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Conecte com as ferramentas que você já usa
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="h-full"
              >
                <LpacCard variant={variants[index % variants.length]} size="tile" className="justify-center h-full">
                  <div className="text-center w-full">
                    <div className="w-14 h-14 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-white/40 transition-colors shadow-md border border-white/20">
                      <Icon className="w-7 h-7 text-white drop-shadow-sm" />
                    </div>
                    <div className="text-sm font-bold text-white mb-1 drop-shadow-sm">
                      {integration.name}
                    </div>
                    <div className="text-xs text-white/90 leading-relaxed">{integration.desc}</div>
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
