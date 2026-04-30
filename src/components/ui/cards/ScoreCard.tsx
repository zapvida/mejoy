import { cn } from '@/lib/utils';

interface ScoreCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  onClick?: () => void;
  currency?: boolean;
  className?: string;
}

export default function ScoreCard({
  title,
  value,
  icon,
  onClick,
  className,
}: ScoreCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        `cursor-pointer rounded-2xl border border-brand-500 bg-gradient-to-br 
        from-brand-500 to-brand-600 p-4 shadow-md hover:scale-[1.02] 
        active:scale-[0.98] transition-transform duration-300 ease-in-out 
        hover:shadow-xl`,
        className
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-white">{icon}</div>
        <div className="text-sm md:text-base text-white font-medium">{title}</div>
      </div>
      <div className="text-3xl md:text-4xl font-bold text-white truncate">
        {value}
      </div>
    </div>
  );
}