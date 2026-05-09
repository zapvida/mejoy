import React from 'react';
import { Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@mejoy/design-tokens';

export function ProgressRing({
  value,
  label,
  caption,
  size = 132,
  tone = 'brand',
}: {
  value: number;
  label: string;
  caption?: string;
  size?: number;
  tone?: 'brand' | 'accent' | 'success';
}) {
  const color = tone === 'accent' ? colors.accent : tone === 'success' ? colors.success : colors.brand;

  return (
    <View style={{ alignItems: 'center', gap: spacing.sm }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 10,
          borderColor: `${color}20`,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.card,
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            right: 8,
            bottom: 8,
            borderRadius: size / 2,
            borderWidth: 4,
            borderColor: color,
            opacity: Math.max(0.28, Math.min(1, value / 100)),
          }}
        />
        <Text selectable style={{ color: colors.textStrong, fontSize: typography.display, fontWeight: '700' }}>
          {Math.round(value)}
        </Text>
        <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, fontWeight: '700' }}>
          {label}
        </Text>
      </View>
      {caption ? (
        <Text selectable style={{ color: colors.textSoft, fontSize: typography.caption, lineHeight: 19, textAlign: 'center' }}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}
