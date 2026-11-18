import { ChevronLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { goBackOr } from '@/lib/navigation';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';

export function AuthBackButton() {
  const scheme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
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
