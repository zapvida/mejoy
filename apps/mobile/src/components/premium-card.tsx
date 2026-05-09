import React from 'react';
import { View } from 'react-native';

import { colors, radii, shadows, spacing } from '@mejoy/design-tokens';

export function PremiumCard({
  children,
  tone = 'default',
  padding = spacing.xl,
}: {
  children: React.ReactNode;
  tone?: 'default' | 'muted' | 'brand' | 'accent' | 'warning' | 'dark';
  padding?: number;
}) {
  const backgroundColor =
    tone === 'brand'
      ? colors.brandSoft
      : tone === 'accent'
        ? colors.accentSoft
        : tone === 'warning'
          ? colors.warningSoft
          : tone === 'dark'
            ? colors.ink
            : tone === 'muted'
              ? colors.cardSubtle
              : colors.card;

  const borderColor =
    tone === 'brand'
      ? colors.brandSoft
      : tone === 'accent'
        ? colors.accentSoft
        : tone === 'warning'
          ? colors.warningSoft
          : tone === 'dark'
            ? 'rgba(255,255,255,0.06)'
            : colors.border;

  return (
    <View
      style={{
        borderRadius: radii.lg,
        borderCurve: 'continuous',
        backgroundColor,
        borderWidth: 1,
        borderColor,
        padding,
        gap: spacing.md,
        boxShadow: tone === 'dark' ? shadows.elevation3 : shadows.elevation1,
      }}
    >
      {children}
    </View>
  );
}
