import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShadowVisible: false }}>
      <Tabs.Screen name="index" options={{ title: 'Painel' }} />
      <Tabs.Screen name="journey" options={{ title: 'GLP-1' }} />
      <Tabs.Screen name="reports" options={{ title: 'Relatórios' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
