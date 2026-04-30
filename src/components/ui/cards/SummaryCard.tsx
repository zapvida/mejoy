interface SummaryCardProps {
  urgency: string;
  value: number;
}

export default function SummaryCard({ urgency, value }: SummaryCardProps) {
  return (
    <div
      className="w-full rounded-2xl border border-white/10 
      bg-black/40 backdrop-blur-md 
      p-4 sm:p-5 md:p-6 shadow-xl 
      hover:scale-[1.02] hover:shadow-2xl 
      transition-all"
    >
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-brand mb-4">
        📋 Resumo da Triagem
      </h3>

      <div className="flex flex-col gap-3 text-sm sm:text-base md:text-lg text-white">
        <div className="flex justify-between">
          <span className="font-medium">Nível de urgência:</span>
          <span className="text-brand font-semibold">{urgency}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Valor:</span>
          <span className="text-brand font-bold">
            R$ {value},00
          </span>
        </div>
      </div>
    </div>
  );
}