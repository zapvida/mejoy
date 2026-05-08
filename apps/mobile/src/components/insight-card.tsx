import { Pressable, Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';

type InsightTone = 'performance' | 'clinical' | 'celebration' | 'warning';

const toneStyles: Record<InsightTone, { stripe: string; backgroundColor: string }> = {
  performance: { stripe: colors.brand, backgroundColor: colors.card },
  clinical: { stripe: colors.ink, backgroundColor: colors.surfaceElevated },
  celebration: { stripe: colors.success, backgroundColor: colors.surfaceElevated },
  warning: { stripe: colors.accent, backgroundColor: colors.surfaceWarm },
};

export function InsightCard({
  tone,
  title,
  body,
  metricLabel,
  metricValue,
  supportingCopy,
  ctaLabel,
  onPress,
}: {
  tone: InsightTone;
  title: string;
  body: string;
  metricLabel?: string | null;
  metricValue?: string | null;
  supportingCopy?: string | null;
  ctaLabel?: string;
  onPress?: () => void;
}) {
  const style = toneStyles[tone];
  const content = (
    <View
      style={{
        gap: spacing.md,
        borderRadius: radii.lg,
        borderCurve: 'continuous',
        backgroundColor: style.backgroundColor,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
        boxShadow: shadows.elevation1,
      }}
    >
      <View
        style={{
          height: 4,
          width: 52,
          borderRadius: radii.pill,
          backgroundColor: style.stripe,
        }}
      />
      <View style={{ gap: spacing.sm }}>
        <Text selectable style={{ color: colors.textStrong, fontSize: typography.section, fontWeight: '700', lineHeight: 28 }}>
          {title}
        </Text>
        <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}>
          {body}
        </Text>
      </View>
      {metricLabel && metricValue ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: spacing.md,
          }}
        >
          <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, fontWeight: '700' }}>
            {metricLabel}
          </Text>
          <Text selectable style={{ color: colors.textStrong, fontSize: typography.section, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
            {metricValue}
          </Text>
        </View>
      ) : null}
      {supportingCopy ? (
        <Text selectable style={{ color: colors.textSoft, fontSize: typography.caption, lineHeight: 20 }}>
          {supportingCopy}
        </Text>
      ) : null}
      {ctaLabel && onPress ? (
        <Text selectable style={{ color: colors.brandStrong, fontSize: typography.caption, fontWeight: '700' }}>
          {ctaLabel}
        </Text>
      ) : null}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} style={{ borderRadius: radii.lg, borderCurve: 'continuous' }}>
      {content}
    </Pressable>
  );
}
