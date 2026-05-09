import React from 'react';
import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';

export function CTAButton({
  label,
  detail,
  onPress,
  disabled,
  tone = 'brand',
}: {
  label: string;
  detail?: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'brand' | 'accent' | 'dark';
}) {
  const backgroundColor =
    tone === 'accent' ? colors.accent : tone === 'dark' ? colors.ink : colors.brand;
  const textColor = tone === 'accent' ? colors.ink : colors.white;
  const detailColor = tone === 'accent' ? colors.inkSoft : '#C9DDD4';

  const handlePress = () => {
    if (disabled) return;
    if (process.env.EXPO_OS === 'ios') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => ({
        borderRadius: radii.pill,
        borderCurve: 'continuous',
        backgroundColor: disabled ? colors.border : backgroundColor,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        opacity: pressed ? 0.94 : 1,
        boxShadow: disabled ? 'none' : shadows.focus,
      })}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center', gap: detail ? 2 : 0 }}>
        <Text selectable style={{ color: textColor, fontSize: typography.bodyStrong, fontWeight: '700' }}>
          {label}
        </Text>
        {detail ? (
          <Text selectable style={{ color: detailColor, fontSize: typography.caption, lineHeight: 18 }}>
            {detail}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
