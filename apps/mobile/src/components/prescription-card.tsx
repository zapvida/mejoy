import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { PremiumCard } from '@/components/premium-card';
import { StatusBadge } from '@/components/status-badge';

export function PrescriptionCard({
  label,
  clinician,
  summary,
  tone = 'brand',
}: {
  label: string;
  clinician: string;
  summary: string;
  tone?: 'brand' | 'accent' | 'neutral';
}) {
  return (
    <PremiumCard tone={tone === 'brand' ? 'brand' : tone === 'accent' ? 'accent' : 'default'} padding={spacing.lg}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
        <Text selectable style={{ flex: 1, color: colors.textStrong, fontSize: typography.bodyStrong, fontWeight: '700' }}>
          {label}
        </Text>
        <StatusBadge label={clinician} tone={tone === 'brand' ? 'brand' : tone === 'accent' ? 'warning' : 'neutral'} />
      </View>
      <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, lineHeight: 20 }}>
        {summary}
      </Text>
    </PremiumCard>
  );
}
