import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { goBackOr } from '@/lib/navigation';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';

export function StatsHeader() {
  const scheme = useAppTheme();

  return (
    <View className="gap-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => {
          goBackOr(ROUTES.home);
        }}
        className="-ml-3 h-11 w-11 items-center justify-center"
      >
        <ChevronLeft
          size={24}
          strokeWidth={2.4}
          color={color(scheme, 'primary-text-color')}
        />
      </Pressable>
      <View className="gap-1">
        <Text
          accessibilityRole="header"
          className="font-display text-4xl text-primary-text-color"
        >
          Your dashboard
        </Text>
        <Text className="font-sans text-sm text-tertiary-text-color">
          Everything you watched, in numbers. Pull down to refresh.
        </Text>
      </View>
    </View>
  );
}
