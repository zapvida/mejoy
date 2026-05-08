import * as Haptics from 'expo-haptics';
import { Link, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';

type ActionTone = 'default' | 'brand' | 'accent';

const toneStyles: Record<ActionTone, { backgroundColor: string; borderColor: string; accentColor: string; eyebrowColor: string }> = {
  default: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    accentColor: colors.textStrong,
    eyebrowColor: colors.textMuted,
  },
  brand: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brandSoft,
    accentColor: colors.brandStrong,
    eyebrowColor: colors.brandStrong,
  },
  accent: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentSoft,
    accentColor: colors.ink,
    eyebrowColor: colors.ink,
  },
};

function ActionTileBody({
  eyebrow,
  title,
  description,
  caption,
  tone = 'default',
}: {
  eyebrow?: string;
  title: string;
  description: string;
  caption?: string;
  tone?: ActionTone;
}) {
  const style = toneStyles[tone];

  return (
    <View
      style={{
        gap: spacing.sm,
        borderRadius: radii.lg,
        borderCurve: 'continuous',
        backgroundColor: style.backgroundColor,
        borderWidth: 1,
        borderColor: style.borderColor,
        padding: spacing.xl,
        boxShadow: shadows.elevation1,
      }}
    >
      {eyebrow ? (
        <Text
          selectable
          style={{
            color: style.eyebrowColor,
            fontSize: typography.micro,
            fontWeight: '700',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </Text>
      ) : null}
      <Text selectable style={{ color: colors.textStrong, fontSize: typography.section, fontWeight: '700', lineHeight: 28 }}>
        {title}
      </Text>
      <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}>
        {description}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
        <Text selectable style={{ color: style.accentColor, fontSize: typography.caption, fontWeight: '700' }}>
          {caption || 'Abrir'}
        </Text>
        <Text selectable style={{ color: style.accentColor, fontSize: typography.bodyStrong, fontWeight: '700' }}>
          →
        </Text>
      </View>
    </View>
  );
}

export function ActionTile({
  href,
  onPress,
  ...props
}: {
  href?: Href;
  onPress?: () => void;
  eyebrow?: string;
  title: string;
  description: string;
  caption?: string;
  tone?: ActionTone;
}) {
  const handlePress = () => {
    if (process.env.EXPO_OS === 'ios') {
      void Haptics.selectionAsync();
    }
    onPress?.();
  };

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable onPress={handlePress} style={{ borderRadius: radii.lg, borderCurve: 'continuous' }}>
          <ActionTileBody {...props} />
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable onPress={handlePress} style={{ borderRadius: radii.lg, borderCurve: 'continuous' }}>
      <ActionTileBody {...props} />
    </Pressable>
  );
}
