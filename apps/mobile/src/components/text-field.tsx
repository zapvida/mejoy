import { TextInput, View, Text } from 'react-native';

import { colors, radii, spacing, typography } from '@mejoy/design-tokens';

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (_value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'decimal-pad' | 'numeric' | 'url';
}) {
  return (
    <View style={{ gap: spacing.sm }}>
      <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, fontWeight: '600' }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        keyboardType={keyboardType}
        style={{
          minHeight: multiline ? 110 : 52,
          borderRadius: radii.md,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: colors.borderStrong,
          backgroundColor: colors.card,
          paddingHorizontal: spacing.lg,
          paddingVertical: multiline ? spacing.lg : 0,
          color: colors.textStrong,
          fontSize: typography.body,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
        placeholderTextColor={colors.textSoft}
      />
    </View>
  );
}
