import { Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';

export function HeroCard({
  eyebrow,
  title,
  summary,
  badge,
  children,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <View
      style={{
        overflow: 'hidden',
        borderRadius: radii.xl,
        borderCurve: 'continuous',
        backgroundColor: colors.ink,
        padding: spacing.xxl,
        gap: spacing.md,
        boxShadow: shadows.medium,
      }}
    >
      <View
        style={{
          position: 'absolute',
          right: -40,
          top: -20,
          height: 180,
          width: 180,
          borderRadius: 999,
          backgroundColor: 'rgba(255, 138, 61, 0.12)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: -30,
          bottom: -55,
          height: 140,
          width: 140,
          borderRadius: 999,
          backgroundColor: 'rgba(221, 239, 231, 0.08)',
        }}
      />
      <View style={{ gap: spacing.sm }}>
        <Text
          selectable
          style={{
            color: '#CFE8DC',
            fontSize: typography.micro,
            fontWeight: '700',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
          <Text
            selectable
            style={{
              flex: 1,
              minWidth: 180,
              color: colors.white,
              fontSize: typography.display,
              fontWeight: '700',
              lineHeight: 38,
            }}
          >
            {title}
          </Text>
          {badge}
        </View>
        <Text selectable style={{ color: '#D7E7E0', fontSize: typography.body, lineHeight: 24 }}>
          {summary}
        </Text>
      </View>
      {children}
    </View>
  );
}
