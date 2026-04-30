'use client';

import { motion } from 'framer-motion';
import React from 'react';

type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div
      className="w-full h-4 sm:h-5 bg-muted/20 rounded-full relative overflow-hidden mb-6 shadow-inner"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
    >
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 rounded-full transition-all duration-500 shadow-lg ring ring-brand-300/30 hover:shadow-xl"
        style={{ width: `${percentage}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5 }}
      >
        {/* bolinha na ponta da barra */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full shadow-md border border-brand-500" />
      </motion.div>
    </div>
  );
}