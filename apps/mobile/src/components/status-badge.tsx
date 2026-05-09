import React from 'react';
import { Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@mejoy/design-tokens';

const toneStyles = {
  neutral: { backgroundColor: colors.surfaceStrong, color: colors.textStrong },
  brand: { backgroundColor: colors.brandSoft, color: colors.brandStrong },
  success: { backgroundColor: colors.successSoft, color: colors.success },
  warning: { backgroundColor: colors.warningSoft, color: colors.warning },
  danger: { backgroundColor: colors.dangerSoft, color: colors.danger },
  dark: { backgroundColor: 'rgba(255,255,255,0.08)', color: colors.white },
} as const;

export function StatusBadge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: keyof typeof toneStyles;
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
