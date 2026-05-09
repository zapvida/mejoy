import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { PremiumCard } from '@/components/premium-card';
import { StatusBadge } from '@/components/status-badge';

export function PharmacyOrderCard({
  title,
  status,
  eta,
  body,
}: {
  title: string;
  status: string;
  eta: string;
  body: string;
}) {
  const tone =
    status.includes('entreg') ? 'success' : status.includes('produção') ? 'warning' : status.includes('análise') ? 'brand' : 'neutral';

  return (
    <PremiumCard tone="default" padding={spacing.lg}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, alignItems: 'center' }}>
        <Text selectable style={{ flex: 1, color: colors.textStrong, fontSize: typography.bodyStrong, fontWeight: '700' }}>
          {title}
        </Text>
        <StatusBadge label={status} tone={tone} />
      </View>
      <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
        {body}
      </Text>
      <Text selectable style={{ color: colors.textSoft, fontSize: typography.caption, lineHeight: 18 }}>
        {eta}
      </Text>
    </PremiumCard>
  );
}
