interface PremiumButtonProps {
  onClick: () => void;
}

export default function PremiumButton({ onClick }: PremiumButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-brand hover:bg-brand px-6 py-3 rounded-lg text-white"
    >
      🔓 Desbloquear Relatório Premium
    </button>
  );
}