import React from 'react';
import { ActivityIndicator, Text } from 'react-native';

import { colors, typography } from '@mejoy/design-tokens';
import { PremiumCard } from '@/components/premium-card';
import { SectionTitle } from '@/components/section-title';

export function LoadingState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <PremiumCard tone="muted">
      <SectionTitle eyebrow="Carregando" title={title} />
      <ActivityIndicator color={colors.brand} />
      <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 23 }}>
        {body}
      </Text>
    </PremiumCard>
  );
}
