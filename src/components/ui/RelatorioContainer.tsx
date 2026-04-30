type RelatorioContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function RelatorioContainer({
  children,
  className = '',
}: RelatorioContainerProps) {
  return (
    <div
      className={`bg-gradient-to-br from-[#000000] via-[#000000] to-[#000000] text-white min-h-screen w-full flex flex-col items-center px-4 md:px-8 py-6 ${className}`}
    >
      <div className="w-full max-w-5xl">{children}</div>
    </div>
  );
}