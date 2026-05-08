import { View, Text } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';

export function SectionCard({
  eyebrow,
  title,
  support,
  children,
  tone = 'default',
}: {
  eyebrow?: string;
  title?: string;
  support?: string;
  children: React.ReactNode;
  tone?: 'default' | 'muted';
}) {
  const backgroundColor = tone === 'muted' ? colors.cardSubtle : colors.card;

  return (
    <View
      style={{
        backgroundColor,
        borderRadius: radii.lg,
        borderCurve: 'continuous',
        padding: spacing.xl,
        gap: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        boxShadow: shadows.elevation1,
      }}
    >
      {eyebrow ? (
        <Text
          selectable
          style={{
            color: colors.brandStrong,
            fontSize: typography.micro,
            fontWeight: '700',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </Text>
      ) : null}
      {title ? (
        <Text selectable style={{ color: colors.textStrong, fontSize: typography.section, fontWeight: '700', lineHeight: 28 }}>
          {title}
        </Text>
      ) : null}
      {support ? (
        <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, lineHeight: 20 }}>
          {support}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
