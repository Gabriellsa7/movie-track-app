import { Check, Dot } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { PASSWORD_RULES } from '@/lib/validation/rules';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n';
import { translateMessage } from '@/i18n/message';

export function PasswordRules({ password }: { password: string }) {
  const scheme = useAppTheme();
  const { t } = useTranslation();
  const language = useLanguage();

  return (
    <View
      accessibilityLabel={t('validation.passwordRules.title')}
      className="-mt-1 gap-1.5"
    >
      {PASSWORD_RULES.map(({ label, test }) => {
        const met = test(password);
        return (
          <View
            key={label}
            accessible
            accessibilityLabel={translateMessage(label, language)}
            accessibilityState={{ checked: met }}
            className="flex-row items-center gap-2"
          >
            {met ? (
              <Check
                size={14}
                strokeWidth={3}
                color={color(scheme, 'success-text-color')}
              />
            ) : (
              <Dot
                size={14}
                strokeWidth={3}
                color={color(scheme, 'tertiary-text-color')}
              />
            )}
            <Text
              className={`font-sans text-xs ${
                met ? 'text-success-text-color' : 'text-tertiary-text-color'
              }`}
            >
              {translateMessage(label, language)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
