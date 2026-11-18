import { router } from 'expo-router';
import { ChevronLeft, Heart, Trash2 } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';

interface IMovieDetailHeaderProps {
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
}

export function goBackToMovies() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(ROUTES.movies);
  }
}

export function MovieDetailHeader({
  isFavorite,
  onToggleFavorite,
  onDelete,
}: IMovieDetailHeaderProps) {
  const scheme = useAppTheme();
  const accent = color(scheme, 'accent-text-color');

  return (
    <View className="flex-row items-center justify-between">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={goBackToMovies}
        className="-ml-3 h-11 w-11 items-center justify-center"
      >
        <ChevronLeft
          size={24}
          strokeWidth={2.4}
          color={color(scheme, 'primary-text-color')}
        />
      </Pressable>
      <View className="flex-row gap-1">
        {onToggleFavorite && (
          <Pressable
            accessibilityRole="switch"
            accessibilityLabel="Favorite"
            accessibilityState={{ checked: isFavorite }}
            onPress={onToggleFavorite}
            className="h-11 w-11 items-center justify-center"
          >
            <Heart
              size={22}
              color={isFavorite ? accent : color(scheme, 'primary-text-color')}
              fill={isFavorite ? accent : 'transparent'}
            />
          </Pressable>
        )}
        {onDelete && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete movie"
            onPress={onDelete}
            className="-mr-2 h-11 w-11 items-center justify-center"
          >
            <Trash2 size={21} color={color(scheme, 'danger-text-color')} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
