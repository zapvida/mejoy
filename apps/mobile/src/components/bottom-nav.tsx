import React from 'react';
import { Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@mejoy/design-tokens';

export function BottomNav({
  items,
  active,
}: {
  items: string[];
  active: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
        borderRadius: radii.pill,
        borderCurve: 'continuous',
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.sm,
      }}
    >
      {items.map((item) => {
        const selected = item === active;
        return (
          <View
            key={item}
            style={{
              flex: 1,
              alignItems: 'center',
              borderRadius: radii.pill,
              backgroundColor: selected ? colors.brandSoft : 'transparent',
              paddingVertical: spacing.sm,
            }}
          >
            <Text selectable style={{ color: selected ? colors.brandStrong : colors.textSoft, fontSize: typography.caption, fontWeight: '700' }}>
              {item}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
