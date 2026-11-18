import { Star } from 'lucide-react-native';
import { Text, View } from 'react-native';
import type { IMovie } from '@/api/types';
import { Poster } from '@/components/poster';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { formatRuntime } from '../../utils/movie-detail.utils';

interface IMovieHeroProps {
  movie: IMovie;
  genreNames: string[];
}

export function MovieHero({ movie, genreNames }: IMovieHeroProps) {
  const scheme = useAppTheme();
  const meta = [
    String(movie.releaseYear),
    movie.durationMinutes ? formatRuntime(movie.durationMinutes) : undefined,
  ].filter(Boolean);

  return (
    <View className="gap-4">
      <View className="flex-row gap-4">
        <Poster
          title={movie.title}
          posterUrl={movie.posterUrl}
          className="h-[180px] w-[120px] rounded-[12px]"
        />
        <View className="flex-1 justify-end gap-1.5">
          <Text
            accessibilityRole="header"
            className="font-display text-3xl text-primary-text-color"
          >
            {movie.title}
          </Text>
          <Text className="font-sans text-sm text-tertiary-text-color">
            {meta.join(' · ')}
          </Text>
          {movie.director && (
            <Text className="font-sans text-sm text-secondary-text-color">
              Directed by {movie.director}
            </Text>
          )}
          <View
            accessible
            accessibilityLabel={`Rating ${String(movie.rating)} of 10`}
            className="mt-1 flex-row items-center gap-1.5"
          >
            <Star
              size={18}
              color={color(scheme, 'star-filled-color')}
              fill={color(scheme, 'star-filled-color')}
            />
            <Text className="font-semibold text-lg text-primary-text-color">
              {movie.rating}
            </Text>
            <Text className="font-sans text-sm text-tertiary-text-color">
              / 10
            </Text>
          </View>
        </View>
      </View>
      {genreNames.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {genreNames.map((name) => (
            <View
              key={name}
              className="h-8 justify-center rounded-full border border-primary-border-color bg-secondary-bg-color px-3"
            >
              <Text className="font-medium text-xs text-secondary-text-color">
                {name}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
