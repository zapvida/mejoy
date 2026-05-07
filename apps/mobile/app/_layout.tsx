import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SessionProvider } from '@/context/session-context';

export default function RootLayout() {
  return (
    <SessionProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerLargeTitle: true,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ title: 'Acesso' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="meal-analysis" options={{ title: 'Meal AI' }} />
        <Stack.Screen name="consult-request" options={{ title: 'Solicitar consulta' }} />
        <Stack.Screen name="share-bundle" options={{ title: 'Pacote clínico' }} />
        <Stack.Screen name="exam-upload" options={{ title: 'Exames e documentos' }} />
      </Stack>
    </SessionProvider>
  );
}
