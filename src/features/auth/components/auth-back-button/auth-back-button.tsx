import { ChevronLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { goBackOr } from '@/lib/navigation';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';

export function AuthBackButton() {
  const scheme = useAppTheme();
  const { t } = useTranslation();

  return (
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
  );
}
