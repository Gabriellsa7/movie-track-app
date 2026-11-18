import { View } from 'react-native';
import type { IUserStats } from '@/api/types';
import { formatAverage, formatHours, lastTwelveMonths } from '@/lib/stats';
import {
  monthsInsights,
  mostGivenRating,
  percentOf,
  plural,
  rewatchCount,
} from '../../utils/stats.utils';
import { MetricCard } from '../metric-card/metric-card';
import { MonthlyChart } from '../monthly-chart/monthly-chart';
import { RatingDistribution } from '../rating-distribution/rating-distribution';
import { StatsSection } from '../stats-section/stats-section';
import { TopGenres } from '../top-genres/top-genres';

export function Dashboard({ stats }: { stats: IUserStats }) {
  const months = lastTwelveMonths(stats.moviesPerMonth, new Date());
  const insights = monthsInsights(months);
  const topRating = mostGivenRating(stats.ratingDistribution);
  const favoriteShare = percentOf(stats.favoritesCount, stats.totalMovies);

  return (
    <View className="gap-4">
      <View className="gap-2.5">
        <View className="flex-row gap-2.5">
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
        </View>
        <View className="flex-row gap-2.5">
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
        </View>
        <View className="flex-row gap-2.5">
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
