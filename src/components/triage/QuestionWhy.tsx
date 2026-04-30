import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';

interface QuestionWhyProps {
  text: string;
  className?: string;
  brand?: 'zapfarm' | 'lpac';
}

export default function QuestionWhy({ text, className, brand = 'lpac' }: QuestionWhyProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const textColor = brand === 'zapfarm' 
    ? 'text-purple-600 hover:text-purple-700' 
    : 'text-green-600 hover:text-green-700';
  
  const bgGradient = brand === 'zapfarm'
    ? 'bg-gradient-to-r from-purple-50 to-orange-50'
    : 'bg-gradient-to-r from-green-50 to-emerald-50';
  
  const borderColor = brand === 'zapfarm'
    ? 'border-purple-200'
    : 'border-green-200';

  return (
    <div className={cn("mt-2 sm:mt-3", className)}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center gap-2.5 w-full text-left transition-all duration-200",
          "px-2.5 py-2 rounded-lg",
          brand === 'zapfarm' 
            ? 'hover:bg-purple-50/50 active:bg-purple-50' 
            : 'hover:bg-green-50/50 active:bg-green-50',
          textColor
        )}
        aria-expanded={isExpanded}
        aria-label="Por que perguntamos?"
      >
        <span className="text-lg sm:text-xl flex-shrink-0 leading-none">💡</span>
        <span className="text-xs sm:text-sm font-medium flex-1 leading-tight">Por que perguntamos?</span>
        <span className={cn(
          "text-[10px] sm:text-xs transition-transform duration-200 flex-shrink-0",
          isExpanded ? "rotate-180" : "rotate-0"
        )}>
          ▼
        </span>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div 
              className={cn(
                "mt-2 rounded-lg border p-3 sm:p-3.5 text-xs sm:text-sm text-gray-700 shadow-sm leading-relaxed",
                bgGradient,
                borderColor
              )}
              role="region"
              aria-live="polite"
            >
              {text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
