import { AppScreen } from '@/components/app-screen';

export function ScreenShell({
  eyebrow = 'MeJoy Native',
  title = 'Jornada clínica em uma interface só',
  summary,
  support,
  refreshing,
  onRefresh,
  children,
}: {
  eyebrow?: string;
  title?: string;
  summary: string;
  support?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
}) {
  return (
    <AppScreen
      eyebrow={eyebrow}
      title={title}
      summary={summary}
      support={support}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      {children}
    </AppScreen>
  );
}
