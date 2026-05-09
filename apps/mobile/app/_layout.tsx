import * as Notifications from 'expo-notifications';
import * as ExpoLinking from 'expo-linking';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { SessionProvider } from '@/context/session-context';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function AppRuntimeBridge() {
  const router = useRouter();
  const session = useSession();

  React.useEffect(() => {
    void trackMobileEvent(
      { apiBaseUrl: session.apiBaseUrl, email: session.email },
      {
        event: 'app_open',
        screen: 'root',
        status: 'info',
        metadata: {
          authenticated: Boolean(session.email),
        },
      }
    );
  }, [session.apiBaseUrl, session.email]);

  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const deepLink = response.notification.request.content.data?.deepLink;
      if (typeof deepLink === 'string' && deepLink.length > 0) {
        void trackMobileEvent(
          { apiBaseUrl: session.apiBaseUrl, email: session.email },
          {
            event: 'deeplink_opened',
            screen: 'notification',
            status: 'ok',
            metadata: {
              deepLink,
            },
          }
        );

        if (deepLink.startsWith('http')) {
          void ExpoLinking.openURL(deepLink);
          return;
        }

        router.push(deepLink as never);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router, session.apiBaseUrl, session.email]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerLargeTitle: true,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="activation-complete" options={{ title: 'Ativação', headerLargeTitle: false }} />
        <Stack.Screen name="sign-in" options={{ title: 'Acesso MeJoy' }} />
        <Stack.Screen name="review/[screenId]" options={{ title: 'Review de tela', headerLargeTitle: false }} />
        <Stack.Screen name="goals" options={{ title: 'Metas do dia' }} />
        <Stack.Screen name="prevention-checklist" options={{ title: 'Checklist preventivo' }} />
        <Stack.Screen name="notifications-center" options={{ title: 'Notificações' }} />
        <Stack.Screen name="referral-gamification" options={{ title: 'Referral MeJoy' }} />
        <Stack.Screen name="premium-benefits" options={{ title: 'Benefícios dos planos' }} />
        <Stack.Screen name="specialist-request" options={{ title: 'Canal premium' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="meal-analysis"
          options={{ title: 'Meal AI', presentation: 'modal', headerLargeTitle: false }}
        />
        <Stack.Screen
          name="consult-request"
          options={{ title: 'Solicitar consulta', presentation: 'modal', headerLargeTitle: false }}
        />
        <Stack.Screen
          name="share-bundle"
          options={{ title: 'Pacote clínico', presentation: 'modal', headerLargeTitle: false }}
        />
        <Stack.Screen
          name="exam-upload"
          options={{ title: 'Exames e documentos', presentation: 'modal', headerLargeTitle: false }}
        />
        <Stack.Screen
          name="refill-request"
          options={{ title: 'Pedido de refill', presentation: 'modal', headerLargeTitle: false }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <AppRuntimeBridge />
    </SessionProvider>
  );
}
