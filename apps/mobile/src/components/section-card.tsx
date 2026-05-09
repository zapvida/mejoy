import { View, Text } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { PremiumCard } from '@/components/premium-card';

export function SectionCard({
  eyebrow,
  title,
  support,
  children,
  tone = 'default',
}: {
  eyebrow?: string;
  title?: string;
  support?: string;
  children: React.ReactNode;
  tone?: 'default' | 'muted';
}) {
  return (
    <PremiumCard tone={tone === 'muted' ? 'muted' : 'default'}>
      {eyebrow ? (
        <Text
          selectable
          style={{
            color: colors.brandStrong,
            fontSize: typography.micro,
            fontWeight: '700',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </Text>
      ) : null}
      {title ? (
        <Text selectable style={{ color: colors.textStrong, fontSize: typography.section, fontWeight: '700', lineHeight: 28 }}>
          {title}
        </Text>
      ) : null}
      {support ? (
        <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, lineHeight: 20 }}>
          {support}
        </Text>
      ) : null}
      {children}
    </PremiumCard>
  );
}
