import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { MetricCard } from '@/components/metric-card';
import { PremiumCard } from '@/components/premium-card';
import { SectionTitle } from '@/components/section-title';
import { StatusBadge } from '@/components/status-badge';

export function MealResultCard({
  quality,
  insight,
  recommendation,
}: {
  quality: string;
  insight: string;
  recommendation: string;
}) {
  return (
    <PremiumCard tone="default">
      <SectionTitle eyebrow="Meal AI" title="Leitura rápida do prato" aside={<StatusBadge label={quality} tone="brand" />} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <MetricCard label="Calorias" value="540 kcal" tone="brand" />
        <MetricCard label="Proteína" value="34 g" tone="success" />
        <MetricCard label="Carboidrato" value="44 g" tone="accent" />
        <MetricCard label="Fibras" value="9 g" tone="warning" />
      </View>
      <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}>
        {insight}
      </Text>
      <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, lineHeight: 20 }}>
        {recommendation}
      </Text>
    </PremiumCard>
  );
}
