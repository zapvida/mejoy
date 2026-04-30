// src/components/zapfarm/report/ReportRedFlagsBanner.tsx
// Banner destacado para red flags e contraindicações

'use client';

import { motion } from 'framer-motion';

interface Props {
  redFlags: string[];
  classification?: 'contraindicado' | 'candidato_glp1' | 'nao_indicado';
}

export function ReportRedFlagsBanner({ redFlags, classification }: Props) {
  if (!redFlags || redFlags.length === 0) return null;

  const isCritical = classification === 'contraindicado' || redFlags.some(flag => 
    flag.toLowerCase().includes('urgente') || 
    flag.toLowerCase().includes('imediato') ||
    flag.toLowerCase().includes('emergência') ||
    flag.toLowerCase().includes('contraindicação')
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full ${
        isCritical 
          ? 'bg-gradient-to-r from-red-600 via-red-700 to-orange-600' 
          : 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500'
      } text-white py-4 sm:py-5 px-4 shadow-2xl`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 text-2xl sm:text-3xl animate-pulse">
            {isCritical ? '🚨' : '⚠️'}
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 flex items-center gap-2">
              {isCritical ? 'ATENÇÃO: Avaliação Médica Presencial Necessária' : 'Sinais de Alerta Identificados'}
            </h3>
            <p className="text-sm sm:text-base text-white/90 mb-3 leading-relaxed">
              {isCritical 
                ? 'Seu caso apresenta características que exigem avaliação médica presencial antes de qualquer tratamento. Por favor, consulte um médico endocrinologista o quanto antes.'
                : 'Identificamos alguns sinais que merecem atenção médica. Recomendamos consulta com especialista para avaliação completa.'}
            </p>
            <ul className="space-y-1.5 sm:space-y-2 mb-3">
              {redFlags.map((flag, index) => (
                <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-white/95">
                  <span className="mt-1">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
            {isCritical && (
              <div className="mt-4 p-3 bg-white/20 rounded-lg border border-white/30">
                <p className="text-sm font-semibold">
                  ⚕️ Este relatório não substitui consulta médica. Procure atendimento presencial.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

