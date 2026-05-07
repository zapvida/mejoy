import { Pressable, Text } from 'react-native';

import { colors, radii, spacing } from '@mejoy/design-tokens';

export function PrimaryButton({
  label,
  onPress,
  disabled,
  tone = 'brand',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'brand' | 'accent';
}) {
  const backgroundColor = tone === 'accent' ? colors.accent : colors.brand;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        minHeight: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radii.pill,
        borderCurve: 'continuous',
        backgroundColor: disabled ? colors.border : backgroundColor,
        paddingHorizontal: spacing.xl,
      }}
    >
      <Text selectable style={{ color: tone === 'accent' ? colors.ink : '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
        {label}
      </Text>
    </Pressable>
  );
}
