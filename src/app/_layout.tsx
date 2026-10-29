import '../../global.css';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { setUpReactQueryManagers } from '@/lib/react-query/react-native-managers';
import { bootstrapSession, setUpSession } from '@/lib/session/session';
import {
  AnimatedSplash,
  SPLASH_BACKGROUND,
} from '@/components/animated-splash';
import { Toaster } from '@/components/toaster';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { Providers } from '@/providers';
import { RootStack } from '@/routes/root-stack';
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
      primary: rgb(scheme, 'accent-bg-color'),
      background: rgb(scheme, 'primary-bg-color'),
      card: rgb(scheme, 'sidebar-bg-color'),
      text: rgb(scheme, 'primary-text-color'),
      border: rgb(scheme, 'primary-border-color'),
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
  // The logo stays on screen until the fonts and the session are ready, so no screen flashes.
  const ready = (fontsLoaded || fontError !== null) && !sessionLoading;
  const [splashVisible, setSplashVisible] = useState(true);
  const hideSplash = useCallback(() => {
    setSplashVisible(false);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: SPLASH_BACKGROUND }}>
      {ready ? (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <Providers>
              <ThemeProvider value={navigationTheme(scheme)}>
                <View style={[{ flex: 1 }, THEME_VARS[scheme]]}>
                  <RootStack />
                </View>
                <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
                <Toaster scheme={scheme} />
              </ThemeProvider>
            </Providers>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      ) : null}
      {splashVisible ? (
        <AnimatedSplash ready={ready} onFinish={hideSplash} />
      ) : null}
    </View>
  );
}
