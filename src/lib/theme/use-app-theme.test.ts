import { act, renderHook } from '@testing-library/react-native';
import { colorScheme } from 'nativewind';
import { useThemeStore } from '@/stores/theme.store';
import { color } from '@/theme/palette';
import { THEME_VARS } from '@/theme/theme-vars';
import { useAppTheme } from './use-app-theme';

afterEach(() => {
  useThemeStore.setState({ preference: 'dark' });
});

describe('When we apply the theme preference', () => {
  it('should start dark and switch when the preference changes', async () => {
    const setScheme = jest.spyOn(colorScheme, 'set');

    const { result } = await renderHook(() => useAppTheme());
    expect(setScheme).toHaveBeenLastCalledWith('dark');
    expect(result.current).toBe('dark');

    await act(() => {
      useThemeStore.getState().setPreference('light');
    });
    expect(setScheme).toHaveBeenLastCalledWith('light');
  });
});

describe('When we read the palette', () => {
  it('should give hex colors and css variables for both schemes', () => {
    expect(color('dark', 'accent-bg-color')).toBe('#F5B83D');
    expect(color('light', 'primary-bg-color')).toBe('#F7F5F1');
    expect(THEME_VARS.dark).toBeDefined();
    expect(THEME_VARS.light).toBeDefined();
  });
});
