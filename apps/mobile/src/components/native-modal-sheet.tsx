import { Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';

export function NativeModalSheet({
  eyebrow,
  title,
  summary,
  children,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        gap: spacing.lg,
        borderRadius: radii.xl,
        borderCurve: 'continuous',
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.xxl,
        boxShadow: shadows.medium,
      }}
    >
      <View style={{ gap: spacing.sm }}>
        <Text
          selectable
          style={{
            color: colors.brand,
            fontSize: typography.micro,
            fontWeight: '700',
            letterSpacing: 0.7,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </Text>
        <Text selectable style={{ color: colors.textStrong, fontSize: typography.title, fontWeight: '700', lineHeight: 32 }}>
          {title}
        </Text>
        <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 23 }}>
          {summary}
        </Text>
      </View>
      {children}
    </View>
  );
}
