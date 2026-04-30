'use client';

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: string;
};

export default function EmptyState({
  title = 'Nenhum dado encontrado',
  description = 'Parece que não há informações disponíveis aqui.',
  actionLabel = 'Voltar',
  actionHref = '/',
  icon = '📄',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 sm:py-20">
      <div className="text-6xl mb-4">{icon}</div>

      <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white drop-shadow">
        {title}
      </h2>

      <p className="text-white/70 mb-6 max-w-sm sm:max-w-md">
        {description}
      </p>

      <a
        href={actionHref}
        className="px-6 py-2 rounded-full 
        bg-brand hover:bg-brand 
        text-white font-semibold transition shadow-md"
      >
        {actionLabel}
      </a>
    </div>
  );
}