import React from 'react';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { AppScreen } from '@/components/app-screen';
import { ActionCard } from '@/components/action-card';
import { CTAButton } from '@/components/cta-button';
import { MetricCard } from '@/components/metric-card';
import { PremiumCard } from '@/components/premium-card';
import { SecondaryButton } from '@/components/secondary-button';
import { SectionTitle } from '@/components/section-title';
import { StatusBadge } from '@/components/status-badge';
import { TimelineRow } from '@/components/timeline-row';
import type { StoryDefinition } from '@/content/mejoy-premium';

export function StoryScreen({ story }: { story: StoryDefinition }) {
  const router = useRouter();

  return (
    <AppScreen
      eyebrow={story.eyebrow}
      title={story.title}
      summary={story.summary}
      support={story.support}
      heroAside={story.badge ? <StatusBadge label={story.badge.label} tone={story.badge.tone} /> : undefined}
    >
      {story.metrics?.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {story.metrics.map((metric) => (
            <MetricCard
              key={`${story.title}-${metric.label}`}
              label={metric.label}
              value={metric.value}
              caption={metric.caption}
              tone={metric.tone}
            />
          ))}
        </View>
      ) : null}

      {story.primaryCta || story.secondaryCta ? (
        <PremiumCard tone="muted">
          <SectionTitle eyebrow="Próximo passo" title="O que o paciente faz agora" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {story.primaryCta?.href ? (
              <View style={{ minWidth: 180, flexGrow: 1 }}>
                <CTAButton label={story.primaryCta.label} onPress={() => router.push(story.primaryCta?.href as never)} />
              </View>
            ) : story.primaryCta ? (
              <View style={{ minWidth: 180, flexGrow: 1 }}>
                <CTAButton label={story.primaryCta.label} onPress={() => {}} />
              </View>
            ) : null}
            {story.secondaryCta?.href ? (
              <View style={{ minWidth: 160 }}>
                <SecondaryButton label={story.secondaryCta.label} onPress={() => router.push(story.secondaryCta?.href as never)} />
              </View>
            ) : story.secondaryCta ? (
              <View style={{ minWidth: 160 }}>
                <SecondaryButton label={story.secondaryCta.label} onPress={() => {}} />
              </View>
            ) : null}
          </View>
        </PremiumCard>
      ) : null}

      {story.sections.map((section) => (
        <PremiumCard key={`${story.title}-${section.title}`} tone="default">
          <SectionTitle eyebrow={section.eyebrow} title={section.title} summary={section.support} />
          {section.items.map((item, index) => {
            if (item.type === 'action') {
              return (
                <ActionCard
                  key={`${section.title}-action-${index}`}
                  eyebrow={item.eyebrow}
                  title={item.title}
                  description={item.description}
                  href={item.href as never}
                  tone={item.tone}
                  badge={item.badge}
                />
              );
            }

            if (item.type === 'timeline') {
              return (
                <TimelineRow
                  key={`${section.title}-timeline-${index}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  meta={item.meta}
                  tone={item.tone}
                />
              );
            }

            if (item.type === 'badges') {
              return (
                <View key={`${section.title}-badges-${index}`} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {item.badges.map((badge) => (
                    <StatusBadge key={`${section.title}-${badge.label}`} label={badge.label} tone={badge.tone} />
                  ))}
                </View>
              );
            }

            return (
              <Text
                key={`${section.title}-text-${index}`}
                selectable
                style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}
              >
                {item.body}
              </Text>
            );
          })}
        </PremiumCard>
      ))}
    </AppScreen>
  );
}
