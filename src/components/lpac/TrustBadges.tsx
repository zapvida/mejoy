'use client';

import { motion } from 'framer-motion';
import { FiHeart, FiShield, FiZap } from 'react-icons/fi';

interface TrustBadgesProps {
  className?: string;
}

export default function TrustBadges({ className = '' }: TrustBadgesProps) {
  const badges = [
    {
      icon: FiHeart,
      text: '100% Gratuito',
      subtext: 'Sem pegadinhas'
    },
    {
      icon: FiShield,
      text: 'LGPD Compliant',
      subtext: 'Dados seguros'
    },
    {
      icon: FiZap,
      text: 'Resultado Imediato',
      subtext: '3-6 minutos'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`flex flex-wrap justify-center gap-4 ${className}`}
    >
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20"
          >
            <Icon className="w-4 h-4 text-emerald-400" />
            <div className="text-center">
              <div className="text-xs font-semibold text-emerald-400">{badge.text}</div>
              <div className="text-xs text-zinc-500">{badge.subtext}</div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
