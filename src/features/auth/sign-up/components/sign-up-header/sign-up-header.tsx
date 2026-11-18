import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { goBackOr } from '@/lib/navigation';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';

export function SignUpHeader() {
  const scheme = useAppTheme();
  const { t } = useTranslation();

  return (
    <View className="gap-5">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
        onPress={() => {
          goBackOr(ROUTES.login);
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
          {t('auth.signUpScreen.title')}
        </Text>
        <Text className="font-sans text-sm text-tertiary-text-color">
          {t('auth.signUpScreen.subtitle')}
        </Text>
      </View>
    </View>
  );
}
