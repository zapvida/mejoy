import { cn } from '@/lib/utils';
import type { ZapfarmProductConfig } from '@/config/zapfarm/products';

interface StickyCTAProps {
  href: string;
  text: string;
  productSlug?: string;
  colors?: ZapfarmProductConfig['colors'];
}

export function StickyCTA({ href, text, colors }: StickyCTAProps) {
  const gradient = colors?.gradientCTA || 'from-purple-400 to-orange-400';
  const textColor = colors?.primary === 'purple' ? 'text-purple-700' : 
                    colors?.primary === 'indigo' ? 'text-indigo-700' :
                    colors?.primary === 'blue' ? 'text-blue-700' :
                    colors?.primary === 'green' ? 'text-green-700' :
                    colors?.primary === 'emerald' ? 'text-emerald-700' :
                    colors?.primary === 'amber' ? 'text-amber-700' :
                    colors?.primary === 'red' ? 'text-red-700' :
                    colors?.primary === 'pink' ? 'text-pink-700' :
                    colors?.primary === 'slate' ? 'text-slate-700' :
                    colors?.primary === 'cyan' ? 'text-cyan-700' :
                    'text-purple-700';
  
  const hoverBg = colors?.primary === 'purple' ? 'hover:bg-purple-50' : 
                  colors?.primary === 'indigo' ? 'hover:bg-indigo-50' :
                  colors?.primary === 'blue' ? 'hover:bg-blue-50' :
                  colors?.primary === 'green' ? 'hover:bg-green-50' :
                  colors?.primary === 'emerald' ? 'hover:bg-emerald-50' :
                  colors?.primary === 'amber' ? 'hover:bg-amber-50' :
                  colors?.primary === 'red' ? 'hover:bg-red-50' :
                  colors?.primary === 'pink' ? 'hover:bg-pink-50' :
                  colors?.primary === 'slate' ? 'hover:bg-slate-50' :
                  colors?.primary === 'cyan' ? 'hover:bg-cyan-50' :
                  'hover:bg-purple-50';

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r p-3.5 sm:p-4 shadow-2xl md:hidden",
      gradient
    )}>
      <a
        href={href}
        className={cn(
          "inline-flex items-center justify-center w-full rounded-full bg-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 transition-colors text-sm sm:text-base",
          textColor,
          hoverBg
        )}
      >
        {text} →
      </a>
    </div>
  );
}

