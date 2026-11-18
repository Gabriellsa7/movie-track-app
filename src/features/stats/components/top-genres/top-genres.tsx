import { Text, View } from 'react-native';
import type { IUserStats } from '@/api/types';
import { percentOf } from '../../utils/stats.utils';
import { useTranslation } from 'react-i18next';

interface ITopGenresProps {
  genres: IUserStats['topGenres'];
  totalMovies: number;
}

export function TopGenres({ genres, totalMovies }: ITopGenresProps) {
  const { t } = useTranslation();
  return (
    <View className="gap-3">
      {genres.map((genre, index) => {
        const share = percentOf(genre.count, totalMovies);
        return (
          <View
            key={genre.genreId}
            accessible
            accessibilityLabel={t('stats.genres.rowLabel', {
              position: index + 1,
              genre: genre.name,
              movies: t('stats.movie', { count: genre.count }),
              percent: share,
            })}
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
                className="rounded-full bg-accent-bg-color"
                style={{ height: '100%', width: `${String(share)}%` }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
