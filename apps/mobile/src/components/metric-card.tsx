import React from 'react';
import { Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';

export function MetricCard({
  label,
  value,
  caption,
  tone = 'default',
}: {
  label: string;
  value: string;
  caption?: string;
  tone?: 'default' | 'brand' | 'accent' | 'warning' | 'success';
}) {
  const backgroundColor =
    tone === 'brand'
      ? colors.brandSoft
      : tone === 'accent'
        ? colors.accentSoft
        : tone === 'warning'
          ? colors.warningSoft
          : tone === 'success'
            ? colors.successSoft
            : colors.surfaceElevated;
  const valueColor =
    tone === 'brand'
      ? colors.brandStrong
      : tone === 'accent'
        ? colors.ink
        : tone === 'warning'
          ? colors.warning
          : tone === 'success'
            ? colors.success
            : colors.textStrong;

  return (
    <View
      style={{
        flexBasis: '47%',
        flexGrow: 1,
        gap: spacing.xs,
        borderRadius: radii.md,
        borderCurve: 'continuous',
        backgroundColor,
        borderWidth: 1,
        borderColor: backgroundColor === colors.surfaceElevated ? colors.border : backgroundColor,
        padding: spacing.lg,
        boxShadow: shadows.soft,
      }}
    >
      <Text selectable style={{ color: colors.textMuted, fontSize: typography.micro, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {label}
      </Text>
      <Text selectable style={{ color: valueColor, fontSize: typography.section, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
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
