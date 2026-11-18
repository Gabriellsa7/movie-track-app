import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';

export function MovieFormHeader({ title }: { title: string }) {
  const scheme = useAppTheme();

  return (
    <View className="flex-row items-center justify-between">
      <Text
        accessibilityRole="header"
        className="font-display text-4xl text-primary-text-color"
      >
        {title}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace(ROUTES.movies);
          }
        }}
        className="-mr-2 h-11 w-11 items-center justify-center"
      >
        <X size={22} color={color(scheme, 'primary-text-color')} />
      </Pressable>
    </View>
  );
}
