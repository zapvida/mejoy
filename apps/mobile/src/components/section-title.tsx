import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';

export function SectionTitle({
  eyebrow,
  title,
  summary,
  aside,
}: {
  eyebrow?: string;
  title: string;
  summary?: string;
  aside?: React.ReactNode;
}) {
  return (
    <View style={{ gap: spacing.xs }}>
      {eyebrow ? (
        <Text
          selectable
          style={{
            color: colors.brandStrong,
            fontSize: typography.micro,
            fontWeight: '700',
            letterSpacing: 0.7,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text
            selectable
            style={{
              color: colors.textStrong,
              fontSize: typography.section,
              fontWeight: '700',
              lineHeight: 28,
            }}
          >
            {title}
          </Text>
          {summary ? (
            <Text
              selectable
              style={{
                color: colors.textMuted,
                fontSize: typography.caption,
                lineHeight: 20,
              }}
            >
              {summary}
            </Text>
          ) : null}
        </View>
        {aside}
      </View>
    </View>
  );
}
