interface Props {
  plano: 'starter' | 'whiteLabel' | 'scalePro';
}

export default function PlanBadge({ plano }: Props) {
  const cores = {
    starter: 'bg-muted',
    whiteLabel: 'bg-brand',
    scalePro: 'bg-brand',
  };

  const textos = {
    starter: 'Starter',
    whiteLabel: 'White Label',
    scalePro: 'Scale Pro',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-white text-xs ${cores[plano]}`}>
      {textos[plano]}
    </span>
  );
}