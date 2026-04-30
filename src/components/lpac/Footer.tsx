'use client';

import { motion } from 'framer-motion';

interface FooterProps {
  data: {
    value: string;
    disclaimer: string;
  };
}

export default function Footer({ data }: FooterProps) {
  return (
    <footer className="py-12 md:py-16 lg:py-24 bg-gray-900 border-t border-gray-800 relative overflow-hidden" id="footer">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 bg-brand-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[72rem] px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-12"
        >
          {/* Value Proposition */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-brand-400">
              {data.value}
            </h3>
            <div className="p-4 bg-brand-500/5 border border-brand-500/20 rounded-xl max-w-md mx-auto">
              <p className="text-sm text-brand-400 font-medium">
                Conhecimento científico para todos, em linguagem simples.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-gray-700">
              <p className="text-sm text-gray-400 leading-relaxed">
                {data.disclaimer}
              </p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <a 
              href="/privacy" 
              className="text-gray-500 hover:text-brand-400 transition-colors duration-200 font-medium"
            >
              Política de Privacidade
            </a>
            <a 
              href="/terms" 
              className="text-gray-500 hover:text-brand-400 transition-colors duration-200 font-medium"
            >
              Termos de Uso
            </a>
            <a 
              href="/contact" 
              className="text-gray-500 hover:text-brand-400 transition-colors duration-200 font-medium"
            >
              Contato
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-600">
              © 2024 Me Joy. Todos os direitos reservados.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}