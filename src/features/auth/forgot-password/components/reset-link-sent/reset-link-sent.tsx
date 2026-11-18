import { Mail } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

export function ResetLinkSent() {
  const scheme = useAppTheme();

  return (
    <View
      accessibilityRole="alert"
      className="flex-row gap-3 rounded-[14px] border border-success-border-color bg-success-soft-bg-color p-4"
    >
      <Mail size={22} color={color(scheme, 'success-text-color')} />
      <View className="flex-1 gap-1.5">
        <Text className="font-semibold text-[15px] text-primary-text-color">
          Check your inbox
        </Text>
        <Text className="font-sans text-sm leading-[21px] text-secondary-text-color">
          If there is an account with this e-mail, the link arrives in a few
          minutes. It is valid for 1 hour. Check the spam folder too.
        </Text>
      </View>
    </View>
  );
}
