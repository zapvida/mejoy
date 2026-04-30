'use client';

import { motion } from 'framer-motion';
import { FiMessageCircle, FiClock } from 'react-icons/fi';

interface ZapVidaCTAProps {
  score?: number;
  sintomas?: string[];
  className?: string;
}

export default function ZapVidaCTA({ score, sintomas, className = '' }: ZapVidaCTAProps) {
  const handleClick = () => {
    // Deep link com parâmetros específicos conforme plano
    const params = new URLSearchParams({
      source: 'alloe',
      utm_source: 'alloehealth',
      utm_campaign: 'relatorio',
      utm_content: 'consult_now',
      utm_medium: 'cta_button'
    });

    // Adicionar contexto médico se disponível
    if (score !== undefined) {
      params.append('score', score.toString());
    }
    
    if (sintomas && sintomas.length > 0) {
      params.append('sintomas', sintomas.join(','));
    }

    const deepLink = `https://zapvida.com/plantao?${params.toString()}`;
    
    // Abrir em nova aba
    window.open(deepLink, '_blank');
    
    // Tracking do evento
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'consult_click', {
        event_category: 'engagement',
        event_label: 'zapvida_cta',
        value: score || 0
      });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full bg-gradient-to-r from-brand to-brand 
        hover:from-brand hover:to-brand 
        text-white font-semibold py-4 px-6 rounded-xl 
        transition-all duration-300 shadow-lg hover:shadow-green-500/25
        flex items-center justify-center gap-3
        ${className}
      `}
    >
      <FiMessageCircle size={20} />
      <div className="text-left">
        <div className="font-bold">Falar com médico agora</div>
        <div className="text-sm font-normal opacity-90 flex items-center gap-1">
          <FiClock size={14} />
          Atendimento em até 20 minutos
        </div>
      </div>
    </motion.button>
  );
}
