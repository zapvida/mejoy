import { ReactNode } from 'react';

type RelatorioContainerProps = {
  children: ReactNode;
  titulo: string;
};

export default function RelatorioContainer({ children, titulo }: RelatorioContainerProps) {
  return (
    <div className="w-full bg-black/50 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl p-5 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand mb-6">
        {titulo}
      </h2>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}