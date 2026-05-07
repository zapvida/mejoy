import { ScrollView, Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';

export function ScreenShell({
  summary,
  children,
}: {
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: spacing.xl,
        gap: spacing.lg,
        backgroundColor: colors.surface,
      }}
    >
      <View
        style={{
          backgroundColor: colors.ink,
          borderRadius: 28,
          borderCurve: 'continuous',
          padding: spacing.xl,
          gap: spacing.sm,
        }}
      >
        <Text selectable style={{ color: '#DAF5E7', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 }}>
          MeJoy Native
        </Text>
        <Text selectable style={{ color: '#FFFFFF', fontSize: typography.section, fontWeight: '700' }}>
          Jornada clínica e retenção em uma única interface
        </Text>
        <Text selectable style={{ color: '#D9E7E2', fontSize: typography.body, lineHeight: 22 }}>
          {summary}
        </Text>
      </View>
      {children}
    </ScrollView>
  );
}
