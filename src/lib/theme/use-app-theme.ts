import { colorScheme, useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import type { TColorScheme } from '@/theme/palette';
import { useThemeStore } from '@/stores/theme.store';

// Applies the saved preference and returns the scheme in use ("system" follows the OS).
export function useAppTheme(): TColorScheme {
  const preference = useThemeStore((state) => state.preference);
  const { colorScheme: current } = useColorScheme();

  useEffect(() => {
    colorScheme.set(preference);
  }, [preference]);

  return current === 'light' ? 'light' : 'dark';
}
