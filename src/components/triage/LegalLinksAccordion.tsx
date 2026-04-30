import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';

interface LegalLink {
  label: string;
  href: string;
}

interface LegalLinksAccordionProps {
  links: LegalLink[];
  brand?: 'zapfarm' | 'lpac';
  className?: string;
}

export default function LegalLinksAccordion({ links, brand = 'lpac', className }: LegalLinksAccordionProps) {
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

  const linkButtonBg = brand === 'zapfarm'
    ? 'border-purple-300 text-purple-700 bg-purple-50 hover:border-purple-400 hover:bg-purple-100'
    : 'border-green-300 text-green-700 bg-green-50 hover:border-green-400 hover:bg-green-100';

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
        aria-label="Leia os termos e políticas"
      >
        <span className="text-lg sm:text-xl flex-shrink-0 leading-none">📜</span>
        <span className="text-xs sm:text-sm font-medium flex-1 leading-tight">Leia os termos e políticas</span>
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
                "mt-2 rounded-lg border p-3 sm:p-3.5 shadow-sm",
                bgGradient,
                borderColor
              )}
              role="region"
              aria-live="polite"
            >
              <p className="text-xs sm:text-sm text-gray-700 mb-2.5 sm:mb-3 font-semibold">
                Documentos legais disponíveis:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200",
                      "border-2 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]",
                      linkButtonBg
                    )}
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="text-left leading-tight truncate">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

