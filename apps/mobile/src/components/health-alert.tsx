import React from 'react';
import { Link, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';
import { StatusBadge } from '@/components/status-badge';

export function HealthAlert({
  title,
  body,
  href,
  severity = 'warning',
}: {
  title: string;
  body: string;
  href?: Href;
  severity?: 'warning' | 'danger' | 'info';
}) {
  const backgroundColor =
    severity === 'danger' ? colors.dangerSoft : severity === 'warning' ? colors.warningSoft : colors.brandSoft;
  const badgeTone = severity === 'danger' ? 'danger' : severity === 'warning' ? 'warning' : 'brand';

  const content = (
    <View
      style={{
        borderRadius: radii.lg,
        borderCurve: 'continuous',
        backgroundColor,
        borderWidth: 1,
        borderColor: backgroundColor,
        padding: spacing.xl,
        gap: spacing.md,
        boxShadow: shadows.soft,
      }}
    >
      <StatusBadge label={severity === 'danger' ? 'atenção médica' : severity === 'warning' ? 'atenção' : 'guia'} tone={badgeTone} />
      <Text selectable style={{ color: colors.textStrong, fontSize: typography.section, fontWeight: '700', lineHeight: 28 }}>
        {title}
      </Text>
      <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}>
        {body}
      </Text>
      <Text selectable style={{ color: colors.textStrong, fontSize: typography.caption, fontWeight: '700' }}>
        {href ? 'Abrir orientação' : 'Mantenha este ponto visível'}
      </Text>
    </View>
  );

  if (!href) return content;

  return (
    <Link href={href} asChild>
      <Pressable style={{ borderRadius: radii.lg, borderCurve: 'continuous' }}>{content}</Pressable>
    </Link>
  );
}
