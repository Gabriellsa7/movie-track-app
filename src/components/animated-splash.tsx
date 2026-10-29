import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet } from 'react-native';
import { rgb } from '@/theme/palette';
import { LogoMark } from './logo';

// Same background and logo width as the native splash in app.config.ts, so the hand-off is invisible.
export const SPLASH_BACKGROUND = rgb('dark', 'primary-bg-color');
const LOGO_SIZE = 120;
// Keeps the brand moment readable when the session is restored instantly.
const MIN_VISIBLE_MS = 600;
const EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);
const EASE_OUT_CUBIC = Easing.bezier(0.33, 1, 0.68, 1);

export function AnimatedSplash({
  ready,
  onFinish,
}: {
  ready: boolean;
  onFinish: () => void;
}) {
  const [pulse] = useState(() => new Animated.Value(1));
  const [exit] = useState(() => new Animated.Value(0));
  const [reduceMotion, setReduceMotion] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const timer = setTimeout(() => {
      setMinElapsed(true);
    }, MIN_VISIBLE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    const breathe = (toValue: number) =>
      Animated.timing(pulse, {
        toValue,
        duration: 700,
        easing: EASE_IN_OUT,
        useNativeDriver: true,
      });
    const loop = Animated.loop(Animated.sequence([breathe(0.92), breathe(1)]));
    loop.start();
    return () => {
      loop.stop();
    };
  }, [pulse, reduceMotion]);

  const leaving = ready && minElapsed;
  useEffect(() => {
    if (!leaving) {
      return;
    }
    Animated.timing(exit, {
      toValue: 1,
      duration: 450,
      easing: EASE_OUT_CUBIC,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onFinish();
      }
    });
  }, [leaving, exit, onFinish]);

  const exitScale = exit.interpolate({
    inputRange: [0, 1],
    outputRange: [1, reduceMotion ? 1 : 1.6],
  });

  return (
    <Animated.View
      accessible
      accessibilityLabel="Carregando o Movie Track"
      // The native splash goes away only once this identical screen is drawn.
      onLayout={() => void SplashScreen.hideAsync()}
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        {
          opacity: exit.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        },
      ]}
    >
      <Animated.View
        style={{ transform: [{ scale: Animated.multiply(pulse, exitScale) }] }}
      >
        <LogoMark size={LOGO_SIZE} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SPLASH_BACKGROUND,
  },
});
