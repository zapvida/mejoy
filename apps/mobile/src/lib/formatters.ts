export function formatDateLabel(value: string | null | undefined) {
  if (!value) return 'sem data';
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

export function formatDateTimeLabel(value: string | null | undefined) {
  if (!value) return 'sem registro';
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPeriodLabel(period: 'morning' | 'afternoon' | 'evening' | 'first-available') {
  switch (period) {
    case 'morning':
      return 'Manhã';
    case 'afternoon':
      return 'Tarde';
    case 'evening':
      return 'Noite';
    default:
      return 'Primeira vaga';
  }
}

export function formatAdherence(value: number | null | undefined) {
  return value != null ? `${value}%` : 'N/A';
}

export function formatWeight(value: number | null | undefined) {
  return value != null ? `${value} kg` : 'N/A';
}

export function formatTrend(value: 'down' | 'stable' | 'up' | 'unknown') {
  switch (value) {
    case 'down':
      return 'Descendo';
    case 'stable':
      return 'Estável';
    case 'up':
      return 'Subindo';
    default:
      return 'Sem leitura';
  }
}

export function formatCampaignLabel(value: string) {
  switch (value) {
    case 'clinical':
      return 'Clínico';
    case 'sleep':
      return 'Sono';
    case 'ritual':
      return 'Ritual';
    case 'commerce':
      return 'Refill';
    case 'engagement':
      return 'Engajamento';
    case 'lifestyle':
      return 'Lifestyle';
    default:
      return value;
  }
}
