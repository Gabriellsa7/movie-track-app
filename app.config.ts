import type { ExpoConfig } from 'expo/config';

const APP_BACKGROUND = '#0F1115';
const APP_ACCENT = '#F5B83D';

const config: ExpoConfig = {
  name: 'Movie Track',
  slug: 'movie-track-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  // Deep links: movietrack://reset-password?token=… and movietrack://verify-email?token=…
  scheme: 'movietrack',
  userInterfaceStyle: 'automatic',
  backgroundColor: APP_BACKGROUND,
  ios: {
    bundleIdentifier: 'com.gabriellsa7.movietrack',
    supportsTablet: false,
  },
  android: {
    package: 'com.gabriellsa7.movietrack',
    adaptiveIcon: {
      backgroundColor: APP_ACCENT,
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-image-picker',
      {
        photosPermission:
          'O Movie Track usa suas fotos para o avatar e os pôsteres dos filmes.',
        cameraPermission: false,
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: APP_BACKGROUND,
        image: './assets/images/splash-icon.png',
        imageWidth: 120,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
