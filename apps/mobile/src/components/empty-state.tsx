import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { PremiumCard } from '@/components/premium-card';
import { SectionTitle } from '@/components/section-title';

export function EmptyState({
  title,
  body,
  eyebrow = 'Ainda vazio',
}: {
  title: string;
  body: string;
  eyebrow?: string;
}) {
  return (
    <PremiumCard tone="muted">
      <SectionTitle eyebrow={eyebrow} title={title} />
      <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 23 }}>
        {body}
      </Text>
    </PremiumCard>
  );
}
