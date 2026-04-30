'use client';

import { motion } from 'framer-motion';
import { FiActivity, FiArrowRight } from 'react-icons/fi';

interface FinalCTAProps {
  data: {
    title: string;
    subtitle: string;
    cta: string;
  };
  onCtaClick: () => void;
}

export default function FinalCTA({ data, onCtaClick }: FinalCTAProps) {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden" id="final-cta">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[72rem] px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
              {data.title}
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              {data.subtitle}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-500 to-brand-600 mx-auto rounded-full"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <button
              onClick={onCtaClick}
              className="group inline-flex h-16 items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 px-10 font-semibold text-xl text-white shadow-[0_12px_40px_rgba(0,200,83,0.3)] transition-all hover:shadow-[0_16px_50px_rgba(0,200,83,0.4)] hover:scale-105 active:scale-95 glow-brand"
              aria-label={data.cta}
            >
              <FiActivity className="w-6 h-6" />
              {data.cta}
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <div className="p-5 bg-gradient-to-r from-brand-500/05 to-brand-400/05 border-2 border-brand-500/20 rounded-xl max-w-md mx-auto glow-brand card-modern">
              <p className="text-sm text-brand-500 font-medium leading-relaxed">
                Protocolos pensados para resolver problemas reais, com segurança e orientação médica.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}