import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { colors } from '@mejoy/design-tokens';

export default function TabsLayout() {
  return (
    <NativeTabs
      tintColor={colors.brand}
      backgroundColor={colors.cardSubtle}
      labelStyle={{
        fontWeight: '700',
        fontSize: 11,
      }}
      disableTransparentOnScrollEdge
      minimizeBehavior="onScrollDown"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="journey">
        <NativeTabs.Trigger.Icon sf={{ default: 'waveform.path.ecg', selected: 'waveform.path.ecg.rectangle.fill' }} md="monitor_heart" />
        <NativeTabs.Trigger.Label>Jornada</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="reports">
        <NativeTabs.Trigger.Icon sf={{ default: 'doc.text', selected: 'doc.text.fill' }} md="lab_profile" />
        <NativeTabs.Trigger.Label>Relatórios</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="rituals">
        <NativeTabs.Trigger.Icon sf={{ default: 'sparkles', selected: 'sparkles' }} md="self_improvement" />
        <NativeTabs.Trigger.Label>Rituais</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} md="person" />
        <NativeTabs.Trigger.Label>Perfil</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
