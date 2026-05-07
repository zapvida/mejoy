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

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
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
        opacity: pressed ? 0.92 : 1,
        boxShadow: disabled ? 'none' : shadows.focus,
      })}
    >
      <Text selectable style={{ color: textColor, fontSize: typography.bodyStrong, fontWeight: '700' }}>
        {label}
      </Text>
      {detail ? (
        <Text selectable style={{ color: tone === 'ghost' ? colors.textSoft : textColor, fontSize: typography.caption }}>
          {detail}
        </Text>
      ) : null}
    </Pressable>
  );
}
