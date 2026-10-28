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
            <Stack screenOptions={{ headerShown: false }} />
          </View>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </Providers>
    </SafeAreaProvider>
  );
}
