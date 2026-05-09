import React from 'react';
import { Link, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';
import { StatusBadge } from '@/components/status-badge';

export function ActionCard({
  eyebrow,
  title,
  description,
  href,
  onPress,
  tone = 'default',
  badge,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href?: Href;
  onPress?: () => void;
  tone?: 'default' | 'brand' | 'accent' | 'dark';
  badge?: { label: string; tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'dark' };
}) {
  const backgroundColor =
    tone === 'brand' ? colors.brandSoft : tone === 'accent' ? colors.accentSoft : tone === 'dark' ? colors.ink : colors.surfaceElevated;
  const borderColor = tone === 'dark' ? 'rgba(255,255,255,0.08)' : backgroundColor === colors.surfaceElevated ? colors.border : backgroundColor;
  const titleColor = tone === 'dark' ? colors.white : colors.textStrong;
  const bodyColor = tone === 'dark' ? '#D3E0DB' : colors.text;
  const eyebrowColor = tone === 'dark' ? '#D8F0E4' : colors.textMuted;
  const ctaColor = tone === 'dark' ? colors.white : tone === 'brand' ? colors.brandStrong : colors.textStrong;

  const content = (
    <View
      style={{
        borderRadius: radii.lg,
        borderCurve: 'continuous',
        backgroundColor,
        borderWidth: 1,
        borderColor,
        padding: spacing.xl,
        gap: spacing.md,
        boxShadow: tone === 'dark' ? shadows.elevation2 : shadows.elevation1,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
        <Text selectable style={{ color: eyebrowColor, fontSize: typography.micro, fontWeight: '700', letterSpacing: 0.7, textTransform: 'uppercase', flex: 1 }}>
          {eyebrow}
        </Text>
        {badge ? <StatusBadge label={badge.label} tone={badge.tone} /> : null}
      </View>
      <Text selectable style={{ color: titleColor, fontSize: typography.section, fontWeight: '700', lineHeight: 28 }}>
        {title}
      </Text>
      <Text selectable style={{ color: bodyColor, fontSize: typography.body, lineHeight: 23 }}>
        {description}
      </Text>
      <Text selectable style={{ color: ctaColor, fontSize: typography.caption, fontWeight: '700' }}>
        Abrir agora
      </Text>
    </View>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable style={{ borderRadius: radii.lg, borderCurve: 'continuous' }}>{content}</Pressable>
      </Link>
    );
  }

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={{ borderRadius: radii.lg, borderCurve: 'continuous' }}>
        {content}
      </Pressable>
    );
  }

  return content;
}
