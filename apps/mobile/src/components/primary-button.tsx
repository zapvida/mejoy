import { CTAButton } from '@/components/cta-button';
import { SecondaryButton } from '@/components/secondary-button';

export function PrimaryButton({
  label,
  onPress,
  disabled,
  tone = 'brand',
  detail,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'brand' | 'accent' | 'ghost';
  detail?: string;
}) {
  if (tone === 'ghost') {
    return <SecondaryButton label={label} onPress={onPress} tone="default" />;
  }

  return <CTAButton label={label} detail={detail} onPress={onPress} disabled={disabled} tone={tone === 'accent' ? 'accent' : 'brand'} />;
}
