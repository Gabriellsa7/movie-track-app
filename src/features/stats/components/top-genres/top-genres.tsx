import { Text, View } from 'react-native';
import type { IUserStats } from '@/api/types';
import { percentOf } from '../../utils/stats.utils';

interface ITopGenresProps {
  genres: IUserStats['topGenres'];
  totalMovies: number;
}

export function TopGenres({ genres, totalMovies }: ITopGenresProps) {
  return (
    <View className="gap-3">
      {genres.map((genre, index) => {
        const share = percentOf(genre.count, totalMovies);
        return (
          <View
            key={genre.genreId}
            accessible
            accessibilityLabel={`${String(index + 1)}. ${genre.name}: ${String(genre.count)} ${
              genre.count === 1 ? 'movie' : 'movies'
            }, ${String(share)}% of your movies`}
            className="gap-1.5"
          >
            <View className="flex-row items-baseline justify-between">
              <Text className="font-semibold text-sm text-primary-text-color">
                {index + 1}. {genre.name}
              </Text>
              <Text className="font-sans text-xs text-tertiary-text-color">
                {genre.count} · {share}%
              </Text>
            </View>
            <View className="h-2 overflow-hidden rounded-full bg-tertiary-bg-color">
              <View
                className="h-full rounded-full bg-accent-bg-color"
                style={{ width: `${String(share)}%` }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
