import { View, Text } from 'react-native';

import { colors, radii, spacing } from '@mejoy/design-tokens';

export function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: radii.lg,
        borderCurve: 'continuous',
        padding: spacing.xl,
        gap: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {eyebrow ? (
        <Text selectable style={{ color: colors.brand, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          {eyebrow}
        </Text>
      ) : null}
      {title ? (
        <Text selectable style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
