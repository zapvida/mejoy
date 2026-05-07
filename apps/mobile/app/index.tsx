import { Redirect } from 'expo-router';

import { useSession } from '@/context/session-context';

export default function IndexRoute() {
  const session = useSession();
  return <Redirect href={session.email ? '/(tabs)' : '/sign-in'} />;
}
