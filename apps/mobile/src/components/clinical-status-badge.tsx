import { StatusBadge } from '@/components/status-badge';

type BadgeTone = 'low' | 'attention' | 'high' | 'good' | 'warning' | 'critical';

export function ClinicalStatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: BadgeTone;
}) {
  const mappedTone =
    tone === 'good'
      ? 'success'
      : tone === 'attention' || tone === 'warning'
        ? 'warning'
        : tone === 'high' || tone === 'critical'
          ? 'danger'
          : 'brand';

  return <StatusBadge label={label} tone={mappedTone} />;
}
