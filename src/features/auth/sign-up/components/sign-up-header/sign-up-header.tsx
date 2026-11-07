import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';

export function SignUpHeader() {
  const scheme = useAppTheme();

  return (
    <View className="gap-5">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace(ROUTES.login);
          }
        }}
        className="-ml-3 h-11 w-11 items-center justify-center"
      >
        <ChevronLeft
          size={22}
          strokeWidth={2.4}
          color={color(scheme, 'primary-text-color')}
        />
      </Pressable>
      <View className="gap-1.5">
        <Text
          accessibilityRole="header"
          className="font-display text-[48px] leading-[54px] tracking-[1px] text-primary-text-color"
        >
          CRIAR CONTA
        </Text>
        <Text className="font-sans text-sm text-tertiary-text-color">
          Leva menos de um minuto.
        </Text>
      </View>
    </View>
  );
}
