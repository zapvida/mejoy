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
        <NativeTabs.Trigger.Label>Hoje</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="plan">
        <NativeTabs.Trigger.Icon sf={{ default: 'list.bullet.clipboard', selected: 'list.bullet.clipboard.fill' }} md="checklist_rtl" />
        <NativeTabs.Trigger.Label>Plano</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="medical">
        <NativeTabs.Trigger.Icon sf={{ default: 'cross.case', selected: 'cross.case.fill' }} md="medical_services" />
        <NativeTabs.Trigger.Label>Médico</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="pharmacy">
        <NativeTabs.Trigger.Icon sf={{ default: 'pill', selected: 'pill.fill' }} md="medication" />
        <NativeTabs.Trigger.Label>Farmácia</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} md="person" />
        <NativeTabs.Trigger.Label>Perfil</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
