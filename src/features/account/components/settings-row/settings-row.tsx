import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

interface ISettingsRowProps {
  label: string;
  icon: LucideIcon;
  last?: boolean;
  onPress: () => void;
}

export function SettingsRow({
  label,
  icon: Icon,
  last = false,
  onPress,
}: ISettingsRowProps) {
  const scheme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`h-14 flex-row items-center gap-3 px-3.5 active:opacity-80 ${
        last ? '' : 'border-b border-primary-border-color'
      }`}
    >
      <Icon size={20} color={color(scheme, 'secondary-text-color')} />
      <Text className="flex-1 font-sans text-[15px] text-primary-text-color">
        {label}
      </Text>
      <ChevronRight
        size={18}
        strokeWidth={2.2}
        color={color(scheme, 'tertiary-text-color')}
      />
    </Pressable>
  );
}
