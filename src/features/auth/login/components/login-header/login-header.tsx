import { LogoMark } from '@/components/logo-mark';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export function LoginHeader() {
  const { t } = useTranslation();
  return (
    <View className="gap-5">
      <LogoMark size={56} />
      <View className="gap-3">
        <Text
          accessibilityRole="header"
          className="font-display text-[52px] leading-[58px] tracking-[1px] text-primary-text-color"
        >
          {t('auth.login.headline')}
        </Text>
        <Text className="font-sans text-body text-tertiary-text-color">
          {t('auth.login.tagline')}
        </Text>
      </View>
    </View>
  );
}
