import React from 'react';
import { Link, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';

export function FeatureCard({
  eyebrow,
  title,
  body,
  href,
  tone = 'default',
}: {
  eyebrow: string;
  title: string;
  body: string;
  href?: Href;
  tone?: 'default' | 'accent' | 'brand' | 'warm';
}) {
  const backgroundColor =
    tone === 'brand'
      ? colors.brandSoft
      : tone === 'accent'
        ? colors.accentSoft
        : tone === 'warm'
          ? colors.surfaceWarm
          : colors.card;

  const content = (
    <View
      style={{
        flexBasis: '47%',
        flexGrow: 1,
        minWidth: 156,
        borderRadius: radii.lg,
        borderCurve: 'continuous',
        backgroundColor,
        borderWidth: 1,
        borderColor: backgroundColor === colors.card ? colors.border : backgroundColor,
        padding: spacing.lg,
        gap: spacing.sm,
        boxShadow: shadows.soft,
      }}
    >
      <Text selectable style={{ color: colors.textMuted, fontSize: typography.micro, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {eyebrow}
      </Text>
      <Text selectable style={{ color: colors.textStrong, fontSize: typography.bodyStrong, fontWeight: '700', lineHeight: 24 }}>
        {title}
      </Text>
      <Text selectable style={{ color: colors.text, fontSize: typography.caption, lineHeight: 19 }}>
        {body}
      </Text>
    </View>
  );

  if (!href) return content;

  return (
    <Link href={href} asChild>
      <Pressable style={{ borderRadius: radii.lg, borderCurve: 'continuous', flexBasis: '47%', flexGrow: 1, minWidth: 156 }}>
        {content}
      </Pressable>
    </Link>
  );
}
