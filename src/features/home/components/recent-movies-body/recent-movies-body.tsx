import { ScrollView, Text, View } from 'react-native';
import { useMoviesQuery } from '@/api/get-movies';
import { SectionError } from '@/components/section-error';
import { Skeleton } from '@/components/skeleton';
import { RecentMovieCard } from '../recent-movie-card/recent-movie-card';

export const RECENT_MOVIES_QUERY = {
  sort: 'watchedAt',
  order: 'desc',
  limit: 6,
} as const;

export function RecentMoviesBody() {
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
        message="Couldn't load your movies."
        onRetry={() => void refetch()}
      />
    );
  }
  if (data.items.length === 0) {
    return (
      <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
        <Text className="font-semibold text-sm text-primary-text-color">
          No movies logged yet
        </Text>
        <Text className="font-sans text-caption text-tertiary-text-color">
          Tap + to log your first one.
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
