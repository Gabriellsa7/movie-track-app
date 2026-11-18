import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStatsQuery } from '@/api/get-user-stats';
import type { IUserStats } from '@/api/types';
import { NewMovieButton } from '@/components/new-movie-button';
import { SectionError } from '@/components/section-error';
import { formatAverage, formatHours, lastTwelveMonths } from '@/lib/stats';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { useSessionStore } from '@/stores/session.store';
import { color } from '@/theme/palette';
import { MetricCard } from './components/metric-card/metric-card';
import { MonthlyChart } from './components/monthly-chart/monthly-chart';
import { RatingDistribution } from './components/rating-distribution/rating-distribution';
import { StatsHeader } from './components/stats-header/stats-header';
import { StatsSection } from './components/stats-section/stats-section';
import { StatsSkeleton } from './components/stats-skeleton/stats-skeleton';
import { TopGenres } from './components/top-genres/top-genres';
import {
  monthsInsights,
  mostGivenRating,
  percentOf,
  rewatchCount,
} from './utils/stats.utils';

function plural(count: number, singular: string, pluralWord: string): string {
  return `${String(count)} ${count === 1 ? singular : pluralWord}`;
}

function Dashboard({ stats }: { stats: IUserStats }) {
  const months = lastTwelveMonths(stats.moviesPerMonth, new Date());
  const insights = monthsInsights(months);
  const topRating = mostGivenRating(stats.ratingDistribution);
  const favoriteShare = percentOf(stats.favoritesCount, stats.totalMovies);

  return (
    <View className="gap-4">
      <View className="flex-row flex-wrap gap-2.5">
        <MetricCard
          label="Movies logged"
          value={String(stats.totalMovies)}
          description="Different movies in your log."
        />
        <MetricCard
          label="Times watched"
          value={String(stats.totalWatches)}
          description={`Counting ${plural(rewatchCount(stats), 'rewatch', 'rewatches')}.`}
        />
        <MetricCard
          label="Hours watched"
          value={formatHours(stats.totalMinutes)}
          description="Runtime times watches. Movies without a runtime count as 0."
        />
        <MetricCard
          label="Average rating"
          value={formatAverage(stats.averageRating)}
          description="The mean of your ratings, from 1 to 10."
        />
        <MetricCard
          label="Favorites"
          value={String(stats.favoritesCount)}
          description={`${String(favoriteShare)}% of your movies.`}
        />
        <MetricCard
          label="Most given rating"
          value={topRating ? String(topRating.rating) : '–'}
          description={
            topRating
              ? `Given to ${plural(topRating.count, 'movie', 'movies')}.`
              : 'Rate movies to see it.'
          }
        />
      </View>

      <StatsSection
        title="Movies per month"
        description="Movies you watched in each of the last 12 months, by watched date."
      >
        <MonthlyChart months={months} insights={insights} />
      </StatsSection>

      <StatsSection
        title="Your ratings"
        description="How many movies got each rating. Shows if you are a tough or a generous critic."
      >
        <RatingDistribution distribution={stats.ratingDistribution} />
      </StatsSection>

      {stats.topGenres.length > 0 && (
        <StatsSection
          title="Top genres"
          description="Your 5 most watched genres. A movie with several genres counts for each one."
        >
          <TopGenres genres={stats.topGenres} totalMovies={stats.totalMovies} />
        </StatsSection>
      )}
    </View>
  );
}

export function StatsScreen() {
  const scheme = useAppTheme();
  const userId = useSessionStore((state) => state.userId) ?? '';
  const stats = useUserStatsQuery(userId);
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    await stats.refetch();
    setRefreshing(false);
  }

  function renderBody() {
    if (stats.isPending) {
      return <StatsSkeleton />;
    }
    if (stats.isError) {
      return (
        <SectionError
          message="Couldn't load your stats."
          onRetry={() => void stats.refetch()}
        />
      );
    }
    if (stats.data.totalMovies === 0) {
      return (
        <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
          <Text className="font-semibold text-sm text-primary-text-color">
            Nothing to measure yet
          </Text>
          <Text className="font-sans text-caption text-tertiary-text-color">
            Log your first movie with the + button and your dashboard starts
            filling up.
          </Text>
        </View>
      );
    }
    return <Dashboard stats={stats.data} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <ScrollView
        contentContainerClassName="gap-5 px-5 pb-28 pt-2"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refresh()}
            tintColor={color(scheme, 'accent-bg-color')}
            colors={[color(scheme, 'accent-bg-color')]}
          />
        }
      >
        <StatsHeader />
        {renderBody()}
      </ScrollView>
      <NewMovieButton />
    </SafeAreaView>
  );
}
