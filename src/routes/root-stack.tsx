import { Stack } from 'expo-router';
import { useSessionStore } from '@/stores/session.store';
import { ROUTES } from './routes.constants';

const MODAL = { presentation: 'modal' } as const;

export function RootStack() {
  const isAuthenticated = useSessionStore(
    (state) => state.status === 'authenticated',
  );

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated} redirectTo={ROUTES.login}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="movies/new" options={MODAL} />
        <Stack.Screen name="movies/[movieId]/index" />
        <Stack.Screen name="movies/[movieId]/edit" options={MODAL} />
        <Stack.Screen name="watchlist/new" options={MODAL} />
        <Stack.Screen name="watchlist/[itemId]/edit" options={MODAL} />
        <Stack.Screen name="watchlist/[itemId]/watched" options={MODAL} />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated} redirectTo={ROUTES.home}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="explore" />
      </Stack.Protected>
      {/* Public: opened from e-mail links and shared profile and review links. */}
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="users/[userId]/index" />
      <Stack.Screen name="users/[userId]/movies/[movieId]" />
    </Stack>
  );
}
