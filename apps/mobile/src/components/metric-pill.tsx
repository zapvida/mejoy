import { Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@mejoy/design-tokens';

type MetricTone = 'default' | 'brand' | 'accent' | 'warning';

const toneStyles: Record<MetricTone, { backgroundColor: string; borderColor: string; valueColor: string }> = {
  default: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    valueColor: colors.textStrong,
  },
  brand: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brandSoft,
    valueColor: colors.brandStrong,
  },
  accent: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentSoft,
    valueColor: colors.ink,
  },
  warning: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warningSoft,
    valueColor: colors.warning,
  },
};

export function MetricPill({
  label,
  value,
  caption,
  tone = 'default',
}: {
  label: string;
  value: string;
  caption?: string;
  tone?: MetricTone;
}) {
  const style = toneStyles[tone];

  return (
    <View
      style={{
        flexBasis: '47%',
        flexGrow: 1,
        gap: spacing.xs,
        borderRadius: radii.md,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor,
        padding: spacing.lg,
      }}
    >
      <Text
        selectable
        style={{
          color: colors.textMuted,
          fontSize: typography.micro,
          fontWeight: '700',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <Text
        selectable
        style={{
          color: style.valueColor,
          fontSize: typography.section,
          fontWeight: '700',
          fontVariant: ['tabular-nums'],
        }}
      >
        {value}
      </Text>
      {caption ? (
        <Text selectable style={{ color: colors.textSoft, fontSize: typography.caption, lineHeight: 18 }}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}
