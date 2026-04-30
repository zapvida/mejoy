type AlertCardProps = {
  title?: string;
  message?: string;
  className?: string;
};

export default function AlertCard({
  title = '⚠️ Atenção!',
  message = 'Algo inesperado aconteceu.',
  className = '',
}: AlertCardProps) {
  return (
    <div
      className={`w-full max-w-xl mx-auto bg-bg/10 border border-fg rounded-3xl px-5 py-4 md:px-6 md:py-5 shadow-xl backdrop-blur-sm ${className}`}
      role="alert"
    >
        <h2 className="text-lg md:text-2xl font-semibold text-fg mb-2 md:mb-3">
        {title}
      </h2>
      <p className="text-sm md:text-base text-white whitespace-pre-wrap leading-relaxed">
        {message}
      </p>
    </div>
  );
}