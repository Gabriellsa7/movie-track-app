import { Pressable, Text, View } from 'react-native';
import { useThemeStore, type TThemePreference } from '@/stores/theme.store';

const THEMES: { value: TThemePreference; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
];

export function ThemeSelect() {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);

  return (
    <View className="gap-2">
      <Text className="font-semibold text-[13px] text-primary-text-color">
        Appearance
      </Text>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Theme"
        className="flex-row rounded-xl border border-primary-border-color bg-secondary-bg-color p-1"
      >
        {THEMES.map(({ value, label }) => {
          const isSelected = preference === value;
          return (
            <Pressable
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              onPress={() => {
                setPreference(value);
              }}
              className={`h-10 flex-1 items-center justify-center rounded-[9px] ${
                isSelected ? 'bg-tertiary-bg-color' : ''
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
                  isSelected
                    ? 'text-primary-text-color'
                    : 'text-tertiary-text-color'
                }`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
