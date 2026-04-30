import ProgressDonut from '@/components/ui/inputs/ProgressDonut';

type ScoreAtualCardProps = {
  score: number;
  label: string;
  className?: string;
};

export default function ScoreAtualCard({ score, label, className = '' }: ScoreAtualCardProps) {
  return (
    <div
      className={`w-full max-w-xs sm:max-w-sm md:max-w-md
        bg-gradient-to-b from-brand/40 to-black/60
        border border-brand rounded-2xl shadow-xl
        p-5 flex flex-col items-center gap-4
        hover:scale-[1.02] transition-transform ${className}`}
    >
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-300 text-center">
        {label}
      </h2>

      <ProgressDonut percentage={score} label="" />
    </div>
  );
}