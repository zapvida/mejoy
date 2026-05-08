import * as Haptics from 'expo-haptics';
import { Pressable, Text } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';

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
  const backgroundColor =
    tone === 'accent' ? colors.accent : tone === 'ghost' ? colors.card : colors.brand;
  const textColor = tone === 'accent' ? colors.ink : tone === 'ghost' ? colors.textStrong : colors.white;
  const detailColor = tone === 'ghost' ? colors.textSoft : tone === 'accent' ? colors.inkSoft : '#D9F1E6';
  const handlePress = () => {
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
        minHeight: 52,
        alignItems: 'center',
        justifyContent: 'center',
        gap: detail ? 2 : 0,
        borderRadius: radii.pill,
        borderCurve: 'continuous',
        borderWidth: tone === 'ghost' ? 1 : 0,
        borderColor: tone === 'ghost' ? colors.border : 'transparent',
        backgroundColor: disabled ? colors.border : backgroundColor,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        opacity: pressed ? 0.92 : 1,
        boxShadow: disabled ? 'none' : tone === 'ghost' ? shadows.soft : shadows.focus,
      })}
    >
      <Text selectable style={{ color: textColor, fontSize: typography.bodyStrong, fontWeight: '700' }}>
        {label}
      </Text>
      {detail ? (
        <Text selectable style={{ color: detailColor, fontSize: typography.caption, lineHeight: 18 }}>
          {detail}
        </Text>
      ) : null}
    </Pressable>
  );
}
