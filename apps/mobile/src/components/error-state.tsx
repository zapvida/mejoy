import React from 'react';
import { Text } from 'react-native';

import { colors, typography } from '@mejoy/design-tokens';
import { PremiumCard } from '@/components/premium-card';
import { SectionTitle } from '@/components/section-title';

export function ErrorState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <PremiumCard tone="default">
      <SectionTitle eyebrow="Atenção" title={title} />
      <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 23 }}>
        {body}
      </Text>
    </PremiumCard>
  );
}
