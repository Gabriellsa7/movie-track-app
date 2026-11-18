import { Heart } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useGenreNames } from '@/api/get-genres';
import type { IMovie } from '@/api/types';
import { GenreChips } from '@/components/genre-chips';
import { Poster } from '@/components/poster';
import { formatRuntime } from '@/lib/movie-format';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';

export function ReviewMovie({ movie }: { movie: IMovie }) {
  const { t } = useTranslation();
  const scheme = useAppTheme();
  const genreNames = useGenreNames(movie.genreIds);
  const meta = [
    String(movie.releaseYear),
    movie.durationMinutes ? formatRuntime(movie.durationMinutes) : undefined,
    movie.director,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View className="flex-row gap-3.5">
      <Poster
        title={movie.title}
        posterUrl={movie.posterUrl}
        className="h-[165px] w-[110px] rounded-[10px]"
      />
      <View className="min-w-0 flex-1 gap-1.5">
        <Text
          accessibilityRole="header"
          className="font-display text-[40px] leading-[38px] tracking-[1px] text-primary-text-color"
        >
          {movie.title}
        </Text>
        <Text className="font-sans text-[13px] text-tertiary-text-color">
          {meta}
        </Text>
        <View className="mt-1">
          <GenreChips names={genreNames} />
        </View>
        {movie.isFavorite && (
          <View className="mt-auto flex-row items-center gap-1.5">
            <Heart
              size={14}
              fill={color(scheme, 'accent-text-color')}
              color={color(scheme, 'accent-text-color')}
            />
            <Text className="font-semibold text-[13px] text-accent-text-color">
              {t('users.review.favorite')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
