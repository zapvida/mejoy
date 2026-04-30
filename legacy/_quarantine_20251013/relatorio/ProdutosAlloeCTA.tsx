'use client';

import { motion } from 'framer-motion';
import { FiShoppingBag, FiStar } from 'react-icons/fi';

interface ProdutosAlloeCTAProps {
  score?: number;
  sintomas?: string[];
  className?: string;
}

export default function ProdutosAlloeCTA({ score, sintomas, className = '' }: ProdutosAlloeCTAProps) {
  const getKitRecommendation = () => {
    if (!sintomas || sintomas.length === 0) return 'kit_geral';
    
    const sintomasStr = sintomas.join(' ').toLowerCase();
    
    if (sintomasStr.includes('constipação') || sintomasStr.includes('prisão')) {
      return 'kit_constipacao';
    }
    if (sintomasStr.includes('refluxo') || sintomasStr.includes('azia')) {
      return 'kit_refluxo';
    }
    if (sintomasStr.includes('diarréia') || sintomasStr.includes('diarreia')) {
      return 'kit_diarreia';
    }
    if (sintomasStr.includes('gases') || sintomasStr.includes('inchaço')) {
      return 'kit_gases';
    }
    
    return 'kit_geral';
  };

  const handleClick = () => {
    const kit = getKitRecommendation();
    
    // UTM específicos conforme plano
    const params = new URLSearchParams({
      utm_source: 'alloehealth',
      utm_medium: 'report',
      utm_campaign: 'recommendations',
      utm_content: kit,
      utm_term: 'produtos_recomendados'
    });

    // Adicionar contexto do score se disponível
    if (score !== undefined) {
      params.append('score_context', score.toString());
    }

    const url = `https://alloeoficial.com.br?${params.toString()}`;
    
    // Abrir em nova aba
    window.open(url, '_blank');
    
    // Tracking do evento
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'product_click', {
        event_category: 'engagement',
        event_label: 'produtos_alloe_cta',
        custom_parameter_1: kit,
        value: score || 0
      });
    }
  };

  const getRecommendationText = () => {
    const kit = getKitRecommendation();
    const recommendations = {
      kit_constipacao: 'Kit para Constipação',
      kit_refluxo: 'Kit para Refluxo',
      kit_diarreia: 'Kit para Diarreia',
      kit_gases: 'Kit para Gases',
      kit_geral: 'Kit Digestivo Geral'
    };
    
    return recommendations[kit] || 'Produtos Recomendados';
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full bg-brand text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300
        flex items-center justify-between gap-4 border border-brand/20
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <FiShoppingBag size={20} />
        <div className="text-left">
          <div className="font-bold">Conhecer produtos Alloe</div>
          <div className="text-sm font-normal opacity-90 flex items-center gap-1">
            <FiStar size={14} />
            {getRecommendationText()}
          </div>
        </div>
      </div>
    </motion.button>
  );
}