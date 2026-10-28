import '../../global.css';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { setUpReactQueryManagers } from '@/lib/react-query/react-native-managers';
import { bootstrapSession, setUpSession } from '@/lib/session/session';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { Providers } from '@/providers';
import { ROUTES } from '@/routes/routes.constants';
import { useSessionStore } from '@/stores/session.store';
import { rgb, type TColorScheme } from '@/theme/palette';
import { THEME_VARS } from '@/theme/theme-vars';

void SplashScreen.preventAutoHideAsync();
setUpSession();
setUpReactQueryManagers();
void bootstrapSession();

function navigationTheme(scheme: TColorScheme) {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: rgb(scheme, 'accent'),
      background: rgb(scheme, 'background'),
      card: rgb(scheme, 'sidebar'),
      text: rgb(scheme, 'text'),
      border: rgb(scheme, 'border'),
    },
  };
}

const MODAL = { presentation: 'modal' } as const;

function RootStack() {
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

export default function RootLayout() {
  const scheme = useAppTheme();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    BebasNeue_400Regular,
  });
  const sessionLoading = useSessionStore((state) => state.status === 'loading');
  // The splash stays until the fonts and the session are ready, so no screen flashes.
  const ready = (fontsLoaded || fontError !== null) && !sessionLoading;

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Providers>
        <ThemeProvider value={navigationTheme(scheme)}>
          <View style={[{ flex: 1 }, THEME_VARS[scheme]]}>
            <RootStack />
          </View>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </Providers>
    </SafeAreaProvider>
  );
}
