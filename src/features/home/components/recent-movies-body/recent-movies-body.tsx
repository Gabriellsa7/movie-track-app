import { ScrollView, Text, View } from 'react-native';
import { useMoviesQuery } from '@/api/get-movies';
import { SectionError } from '@/components/section-error';
import { Skeleton } from '@/components/skeleton';
import { RecentMovieCard } from '../recent-movie-card/recent-movie-card';
import { useTranslation } from 'react-i18next';

export const RECENT_MOVIES_QUERY = {
  sort: 'watchedAt',
  order: 'desc',
  limit: 6,
} as const;

export function RecentMoviesBody() {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch } =
    useMoviesQuery(RECENT_MOVIES_QUERY);

  if (isPending) {
    return (
      <View className="flex-row gap-3">
        {[0, 1, 2].map((index) => (
          <Skeleton
            key={index}
            className="h-[156px] w-[104px] rounded-[10px]"
          />
        ))}
      </View>
    );
  }
  if (isError) {
    return (
      <SectionError
        message={t('home.recent.loadFailed')}
        onRetry={() => void refetch()}
      />
    );
  }
  if (data.items.length === 0) {
    return (
      <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
        <Text className="font-semibold text-sm text-primary-text-color">
          {t('home.recent.empty')}
        </Text>
        <Text className="font-sans text-caption text-tertiary-text-color">
          {t('movies.empty.hint')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-5"
      contentContainerClassName="gap-3 px-5"
    >
      {data.items.map((movie) => (
        <RecentMovieCard key={movie.id} movie={movie} />
      ))}
    </ScrollView>
  );
}
