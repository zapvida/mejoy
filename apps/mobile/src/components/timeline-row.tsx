import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';

type TimelineTone = 'default' | 'success' | 'warning';

const toneDot: Record<TimelineTone, string> = {
  default: colors.brand,
  success: colors.success,
  warning: colors.accent,
};

export function TimelineRow({
  title,
  subtitle,
  meta,
  tone = 'default',
}: {
  title: string;
  subtitle: string;
  meta?: string;
  tone?: TimelineTone;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.md }}>
      <View style={{ alignItems: 'center', gap: spacing.xs }}>
        <View
          style={{
            marginTop: 6,
            height: 10,
            width: 10,
            borderRadius: 999,
            backgroundColor: toneDot[tone],
          }}
        />
        <View style={{ flex: 1, width: 1, backgroundColor: colors.border }} />
      </View>
      <View style={{ flex: 1, gap: spacing.xs, paddingBottom: spacing.lg }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.sm }}>
          <Text selectable style={{ flex: 1, color: colors.textStrong, fontSize: typography.bodyStrong, fontWeight: '700' }}>
            {title}
          </Text>
          {meta ? (
            <Text selectable style={{ color: colors.textSoft, fontSize: typography.caption }}>
              {meta}
            </Text>
          ) : null}
        </View>
        <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, lineHeight: 19 }}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
