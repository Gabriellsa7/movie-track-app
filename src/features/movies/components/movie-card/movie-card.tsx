import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Star } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import type { IMovie } from '@/api/types';
import { formatRating } from '@/lib/rating';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n';

interface IMovieCardProps {
  movie: IMovie;
  width: number;
}

export function MovieCard({ movie, width }: IMovieCardProps) {
  const { t } = useTranslation();
  const language = useLanguage();
  const scheme = useAppTheme();

  return (
    <Link
      href={{ pathname: '/movies/[movieId]', params: { movieId: movie.id } }}
      asChild
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={t('movies.cardLabel', {
          title: movie.title,
          year: movie.releaseYear,
          rating: formatRating(movie.rating, language),
        })}
        className="gap-1.5 active:opacity-80"
        style={{ width }}
      >
        <View
          className="justify-between overflow-hidden rounded-lg border border-primary-border-color bg-tertiary-bg-color px-2 pb-2 pt-1.5"
          style={{ width, aspectRatio: 2 / 3 }}
        >
          {movie.posterUrl && (
            <Image
              source={{ uri: movie.posterUrl }}
              contentFit="cover"
              transition={150}
              style={{ position: 'absolute', inset: 0 }}
            />
          )}
          <View className="h-5 flex-row items-center gap-[3px] self-start rounded-[5px] bg-overlay-bg-color/80 px-1.5">
            <Star
              size={10}
              color={color(scheme, 'star-filled-color')}
              fill={color(scheme, 'star-filled-color')}
            />
            <Text className="font-semibold text-[11px] text-primary-text-color">
              {formatRating(movie.rating, language)}
            </Text>
          </View>
          {!movie.posterUrl && (
            <Text
              numberOfLines={3}
              className="font-display text-[17px] leading-[17px] text-primary-text-color"
            >
              {movie.title}
            </Text>
          )}
        </View>
        <Text
          numberOfLines={1}
          className="font-semibold text-xs text-primary-text-color"
        >
          {movie.title}
        </Text>
      </Pressable>
    </Link>
  );
}
