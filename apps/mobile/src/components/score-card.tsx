import React from 'react';
import { Text, View } from 'react-native';

import type { HealthScoreSnapshot } from '@mejoy/api-contracts/mobile';
import { colors, radii, spacing, typography } from '@mejoy/design-tokens';
import { PremiumCard } from '@/components/premium-card';
import { ProgressRing } from '@/components/progress-ring';
import { SectionTitle } from '@/components/section-title';
import { StatusBadge } from '@/components/status-badge';

export function ScoreCard({
  score,
  nextAction,
}: {
  score: HealthScoreSnapshot;
  nextAction?: string;
}) {
  const tone =
    score.overallScore >= 80 ? 'success' : score.overallScore >= 60 ? 'brand' : score.overallScore >= 40 ? 'accent' : 'warning';

  return (
    <PremiumCard tone="default">
      <SectionTitle
        eyebrow="Saúde de hoje"
        title={`${score.overallScore}/100 com leitura simples`}
        summary="O índice resume hábitos, adesão e prevenção. Ele não é diagnóstico."
        aside={<StatusBadge label={score.trend.replace('_', ' ')} tone={tone === 'warning' ? 'warning' : tone === 'accent' ? 'warning' : tone} />}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
        <ProgressRing
          value={score.overallScore}
          label="score"
          caption={`Delta 24h ${score.delta24h >= 0 ? '+' : ''}${score.delta24h}`}
          tone={tone === 'warning' ? 'accent' : tone}
        />
        <View style={{ flex: 1, gap: spacing.sm }}>
          {score.pillars.slice(0, 4).map((pillar) => (
            <View key={pillar.id} style={{ gap: spacing.xs }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
                <Text selectable style={{ color: colors.textStrong, fontSize: typography.caption, fontWeight: '700' }}>
                  {pillar.label}
                </Text>
                <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, fontWeight: '700' }}>
                  {pillar.currentScore}/{pillar.maxScore}
                </Text>
              </View>
              <View style={{ height: 8, borderRadius: radii.pill, backgroundColor: colors.surfaceMuted, overflow: 'hidden' }}>
                <View
                  style={{
                    width: `${Math.max(10, Math.min(100, (pillar.currentScore / pillar.maxScore) * 100))}%`,
                    height: '100%',
                    borderRadius: radii.pill,
                    backgroundColor:
                      pillar.status === 'good' ? colors.success : pillar.status === 'attention' ? colors.accent : colors.danger,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
      {nextAction ? (
        <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, lineHeight: 20 }}>
          Próximo passo: {nextAction}
        </Text>
      ) : null}
    </PremiumCard>
  );
}
