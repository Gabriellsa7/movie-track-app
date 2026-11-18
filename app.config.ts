import type { ExpoConfig } from 'expo/config';

const APP_BACKGROUND = '#0F1115';
const APP_ACCENT = '#F5B83D';

const config: ExpoConfig = {
  name: 'Movie Track',
  slug: 'movie-track-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'movietrack',
  userInterfaceStyle: 'automatic',
  backgroundColor: APP_BACKGROUND,
  ios: {
    bundleIdentifier: 'com.gabriellsa7.movietrack',
    supportsTablet: false,
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
    },
  },
  locales: {
    'pt-BR': './assets/locales/pt-BR.json',
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
      'expo-localization',
      {
        supportedLocales: {
          ios: ['en', 'pt-BR'],
          android: ['en', 'pt-BR'],
        },
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'Movie Track uses your photos for your avatar and movie posters.',
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
