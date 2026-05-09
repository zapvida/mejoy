import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ActionTile } from '@/components/action-tile';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { HeroCard } from '@/components/hero-card';
import { MetricPill } from '@/components/metric-pill';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TimelineRow } from '@/components/timeline-row';
import { reviewScreenDefinitions } from '@/review/screen-definitions';

export default function ReviewScreenRoute() {
  const params = useLocalSearchParams<{ screenId?: string }>();
  const screen = reviewScreenDefinitions.find((candidate) => candidate.screenId === params.screenId);

  if (!screen) {
    return (
      <ScreenShell
        eyebrow="Review"
        title="Tela não encontrada"
        summary="O screenId solicitado não existe no catálogo de review local."
      >
        <SectionCard eyebrow="Erro" title="screenId inválido">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            Use um id presente em `reviewScreenDefinitions`.
          </Text>
        </SectionCard>
      </ScreenShell>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `${screen.screenId} · review`, headerLargeTitle: false }} />
      <ScreenShell
        eyebrow={screen.eyebrow}
        title={screen.title}
        summary={screen.summary}
        support={`route ${screen.route} · tier ${screen.tier} · state ${screen.state} · status ${screen.reviewStatus}`}
      >
        <HeroCard
          eyebrow={screen.eyebrow}
          title={screen.title}
          summary={screen.summary}
          badge={screen.badge ? <ClinicalStatusBadge label={screen.badge.label} tone={screen.badge.tone} /> : null}
        >
          {screen.metrics?.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {screen.metrics.map((metric) => (
                <MetricPill
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  caption={metric.caption}
                  tone={metric.tone}
                />
              ))}
            </View>
          ) : null}
        </HeroCard>

        {screen.sections.map((section) => (
          <SectionCard
            key={`${screen.screenId}-${section.title}`}
            eyebrow={section.eyebrow}
            title={section.title}
            support={section.support}
            tone={section.tone}
          >
            {section.items.map((item, index) => {
              if (item.type === 'action') {
                return (
                  <ActionTile
                    key={`${screen.screenId}-action-${index}`}
                    eyebrow={item.eyebrow}
                    title={item.title}
                    description={item.description}
                    tone={item.tone}
                    caption={item.caption}
                  />
                );
              }

              if (item.type === 'timeline') {
                return (
                  <TimelineRow
                    key={`${screen.screenId}-timeline-${index}`}
                    title={item.title}
                    subtitle={item.subtitle}
                    meta={item.meta}
                    tone={item.tone}
                  />
                );
              }

              if (item.type === 'badges') {
                return (
                  <View
                    key={`${screen.screenId}-badges-${index}`}
                    style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}
                  >
                    {item.badges.map((badge) => (
                      <ClinicalStatusBadge key={`${screen.screenId}-${badge.label}`} label={badge.label} tone={badge.tone} />
                    ))}
                  </View>
                );
              }

              return (
                <Text
                  key={`${screen.screenId}-text-${index}`}
                  selectable
                  style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}
                >
                  {item.body}
                </Text>
              );
            })}
          </SectionCard>
        ))}
      </ScreenShell>
    </>
  );
}
