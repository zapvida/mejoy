import { ReactNode } from 'react';

type TooltipProps = {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
};

export default function Tooltip({
  content,
  children,
  position = 'top',
}: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div className="relative group cursor-pointer">
      {children}
      <div
        className={`absolute hidden group-hover:flex 
          ${positionClasses[position]} 
          bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg 
          shadow-lg border border-white/10 backdrop-blur-md
          transition-all duration-200 z-50 whitespace-nowrap`}
      >
        {content}
      </div>
    </div>
  );
}