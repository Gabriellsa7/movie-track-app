import { ChevronDown } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

export function FilterChip({
  label,
  active,
  withMenu = false,
  onPress,
}: {
  label: string;
  active: boolean;
  withMenu?: boolean;
  onPress: () => void;
}) {
  const scheme = useAppTheme();

  return (
    <Pressable
      accessibilityRole={withMenu ? 'button' : 'switch'}
      accessibilityState={withMenu ? undefined : { checked: active }}
      onPress={onPress}
      className={`h-9 flex-row items-center gap-1 rounded-full border px-3 ${
        active
          ? 'border-accent-bg-color bg-accent-soft-bg-color'
          : 'border-primary-border-color bg-secondary-bg-color'
      }`}
    >
      <Text
        className={`font-semibold text-[13px] ${
          active ? 'text-accent-text-color' : 'text-primary-text-color'
        }`}
      >
        {label}
      </Text>
      {withMenu && (
        <ChevronDown
          size={14}
          strokeWidth={2.4}
          color={color(
            scheme,
            active ? 'accent-text-color' : 'primary-text-color',
          )}
        />
      )}
    </Pressable>
  );
}
