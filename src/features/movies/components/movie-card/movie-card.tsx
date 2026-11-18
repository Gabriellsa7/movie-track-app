import { Link } from 'expo-router';
import { Heart, Star } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import type { IMovie } from '@/api/types';
import { Poster } from '@/components/poster';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

interface IMovieCardProps {
  movie: IMovie;
}

export function MovieCard({ movie }: IMovieCardProps) {
  const scheme = useAppTheme();

  return (
    <Link
      href={{ pathname: '/movies/[movieId]', params: { movieId: movie.id } }}
      asChild
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${movie.title}, ${String(movie.releaseYear)}, nota ${String(movie.rating)}`}
        className="flex-row gap-3 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-2.5 active:opacity-80"
      >
        <Poster
          title={movie.title}
          posterUrl={movie.posterUrl}
          showTitle={false}
          className="h-[90px] w-[60px] rounded-lg"
        />
        <View className="flex-1 justify-center gap-1">
          <Text
            numberOfLines={2}
            className="font-semibold text-base text-primary-text-color"
          >
            {movie.title}
          </Text>
          <Text className="font-sans text-sm text-tertiary-text-color">
            {movie.releaseYear}
          </Text>
          <View className="flex-row items-center gap-1">
            <Star
              size={14}
              color={color(scheme, 'star-filled-color')}
              fill={color(scheme, 'star-filled-color')}
            />
            <Text className="font-semibold text-sm text-primary-text-color">
              {movie.rating}
            </Text>
          </View>
        </View>
        {movie.isFavorite && (
          <View accessibilityLabel="Favorito" className="pt-1">
            <Heart
              size={16}
              color={color(scheme, 'accent-text-color')}
              fill={color(scheme, 'accent-text-color')}
            />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <View className="h-[112px] rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-2.5">
      <View className="h-[90px] w-[60px] rounded-lg bg-tertiary-bg-color" />
    </View>
  );
}
