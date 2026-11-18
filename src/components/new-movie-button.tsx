import { Link } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';

// The floating "+" of the mockups; place it as the last child of the screen's root view.
export function NewMovieButton() {
  const scheme = useAppTheme();

  return (
    <View className="absolute bottom-5 right-5">
      <Link href={ROUTES.newMovie} asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Registrar filme"
          className="h-14 w-14 items-center justify-center rounded-2xl bg-accent-bg-color shadow-lg shadow-black/45"
        >
          <Plus
            size={26}
            strokeWidth={2.4}
            color={color(scheme, 'on-accent-text-color')}
          />
        </Pressable>
      </Link>
    </View>
  );
}
