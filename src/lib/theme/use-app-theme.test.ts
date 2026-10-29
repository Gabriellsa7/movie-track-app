import { act, renderHook } from '@testing-library/react-native';
import { colorScheme } from 'nativewind';
import { useThemeStore } from '@/stores/theme.store';
import { rgb } from '@/theme/palette';
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
  it('should give rgb colors and css variables for both schemes', () => {
    expect(rgb('dark', 'accent-bg-color')).toBe('rgb(245, 184, 61)');
    expect(rgb('light', 'primary-bg-color')).toBe('rgb(247, 245, 241)');
    expect(THEME_VARS.dark).toBeDefined();
    expect(THEME_VARS.light).toBeDefined();
  });
});
