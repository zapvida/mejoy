import React from 'react';
import * as Haptics from 'expo-haptics';
import { Pressable, Text } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';

export function SecondaryButton({
  label,
  onPress,
  tone = 'default',
}: {
  label: string;
  onPress: () => void;
  tone?: 'default' | 'dark' | 'brand';
}) {
  const backgroundColor = tone === 'dark' ? 'rgba(255,255,255,0.08)' : tone === 'brand' ? colors.brandSoft : colors.card;
  const borderColor = tone === 'dark' ? 'rgba(255,255,255,0.12)' : tone === 'brand' ? colors.brandSoft : colors.border;
  const color = tone === 'dark' ? colors.white : tone === 'brand' ? colors.brandStrong : colors.textStrong;

  return (
    <Pressable
      onPress={() => {
        if (process.env.EXPO_OS === 'ios') {
          void Haptics.selectionAsync();
        }
        onPress();
      }}
      style={({ pressed }) => ({
        borderRadius: radii.pill,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor,
        backgroundColor,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        opacity: pressed ? 0.92 : 1,
        boxShadow: shadows.soft,
      })}
    >
      <Text selectable style={{ color, fontSize: typography.caption, fontWeight: '700' }}>
        {label}
      </Text>
    </Pressable>
  );
}
