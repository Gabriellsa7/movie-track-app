import { Mail } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';

export function ResetLinkSent() {
  const scheme = useAppTheme();
  const { t } = useTranslation();

  return (
    <View
      accessibilityRole="alert"
      className="flex-row gap-3 rounded-[14px] border border-success-border-color bg-success-soft-bg-color p-4"
    >
      <Mail size={22} color={color(scheme, 'success-text-color')} />
      <View className="flex-1 gap-1.5">
        <Text className="font-semibold text-[15px] text-primary-text-color">
          {t('auth.forgot.sentTitle')}
        </Text>
        <Text className="font-sans text-sm leading-[21px] text-secondary-text-color">
          {t('auth.forgot.sentBody')}
        </Text>
      </View>
    </View>
  );
}
