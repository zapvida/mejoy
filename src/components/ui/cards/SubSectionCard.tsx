interface Props {
  titulo: string;
  conteudo: React.ReactNode; // aceita string ou JSX
}

export default function SubSectionCard({ titulo, conteudo }: Props) {
  return (
    <div
      className="w-full bg-black/50 backdrop-blur-md 
      border border-brand rounded-2xl 
      p-4 sm:p-5 md:p-6 hover:shadow-2xl hover:scale-[1.02] 
      transition-all"
    >
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-brand mb-3">
        {titulo}
      </h3>
      <div className="prose prose-invert text-sm sm:text-base md:text-lg leading-relaxed space-y-4">
        {conteudo}
      </div>
    </div>
  );
}