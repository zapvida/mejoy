'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const resources = [
  'Logo, domínio e cores da sua marca',
  'CTAs distintos por campanha',
  'Relatórios exportáveis',
  'Dashboards e tracking UTM',
  'Integração WhatsApp/CRM',
  'Sandbox para demonstração',
];

export default function Resources() {
  return (
    <section id="recursos" className="py-16 md:py-20 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-ink mb-10 md:mb-12 leading-tight text-balance"
        >
          Recursos
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {resources.map((resource, index) => (
            <motion.div
              key={resource}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="card-ghost p-4 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 flex items-center justify-between"
            >
              <span className="text-ink font-medium">{resource}</span>
              <ExternalLink className="w-4 h-4 text-[color:var(--brand-600)] opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
