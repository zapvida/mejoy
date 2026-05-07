import { Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@mejoy/design-tokens';

type BadgeTone = 'low' | 'attention' | 'high' | 'good' | 'warning' | 'critical';

const toneStyles: Record<BadgeTone, { backgroundColor: string; color: string }> = {
  low: { backgroundColor: colors.brandSoft, color: colors.brandStrong },
  attention: { backgroundColor: colors.warningSoft, color: colors.warning },
  high: { backgroundColor: colors.dangerSoft, color: colors.danger },
  good: { backgroundColor: colors.successSoft, color: colors.success },
  warning: { backgroundColor: colors.warningSoft, color: colors.warning },
  critical: { backgroundColor: colors.dangerSoft, color: colors.danger },
};

export function ClinicalStatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: BadgeTone;
}) {
  const style = toneStyles[tone];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        borderRadius: radii.pill,
        borderCurve: 'continuous',
        backgroundColor: style.backgroundColor,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
      }}
    >
      <Text
        selectable
        style={{
          color: style.color,
          fontSize: typography.micro,
          fontWeight: '700',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
