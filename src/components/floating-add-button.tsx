import { Link, type Href } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

interface IFloatingAddButtonProps {
  href: Href;
  label: string;
}

export function FloatingAddButton({ href, label }: IFloatingAddButtonProps) {
  const scheme = useAppTheme();

  return (
    <View className="absolute bottom-5 right-5">
      <Link href={href} asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
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
