import { View } from 'react-native';
import type { IUserStats } from '@/api/types';
import { formatAverage, formatHours, lastTwelveMonths } from '@/lib/stats';
import {
  monthsInsights,
  mostGivenRating,
  percentOf,
  rewatchCount,
} from '../../utils/stats.utils';
import { MetricCard } from '../metric-card/metric-card';
import { MonthlyChart } from '../monthly-chart/monthly-chart';
import { RatingDistribution } from '../rating-distribution/rating-distribution';
import { StatsSection } from '../stats-section/stats-section';
import { TopGenres } from '../top-genres/top-genres';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n';

export function Dashboard({ stats }: { stats: IUserStats }) {
  const { t } = useTranslation();
  const language = useLanguage();
  const months = lastTwelveMonths(stats.moviesPerMonth, new Date(), language);
  const insights = monthsInsights(months);
  const topRating = mostGivenRating(stats.ratingDistribution);
  const favoriteShare = percentOf(stats.favoritesCount, stats.totalMovies);

  return (
    <View className="gap-4">
      <View className="gap-2.5">
        <View className="flex-row gap-2.5">
          <MetricCard
            label={t('stats.metrics.moviesLogged')}
            value={String(stats.totalMovies)}
            description={t('stats.metrics.moviesLoggedHelp')}
          />
          <MetricCard
            label={t('stats.metrics.timesWatched')}
            value={String(stats.totalWatches)}
            description={t('stats.metrics.timesWatchedHelp', {
              rewatches: t('stats.rewatch', { count: rewatchCount(stats) }),
            })}
          />
        </View>
        <View className="flex-row gap-2.5">
          <MetricCard
            label={t('stats.metrics.hoursWatched')}
            value={formatHours(stats.totalMinutes)}
            description={t('stats.metrics.hoursWatchedHelp')}
          />
          <MetricCard
            label={t('stats.metrics.averageRating')}
            value={formatAverage(stats.averageRating, language)}
            description={t('stats.metrics.averageRatingHelp')}
          />
        </View>
        <View className="flex-row gap-2.5">
          <MetricCard
            label={t('stats.metrics.favorites')}
            value={String(stats.favoritesCount)}
            description={t('stats.metrics.favoritesHelp', {
              percent: favoriteShare,
            })}
          />
          <MetricCard
            label={t('stats.metrics.mostGivenRating')}
            value={topRating ? String(topRating.rating) : '–'}
            description={
              topRating
                ? t('stats.metrics.mostGivenRatingHelp', {
                    movies: t('stats.movie', { count: topRating.count }),
                  })
                : t('stats.metrics.mostGivenRatingEmpty')
            }
          />
        </View>
      </View>

      <StatsSection
        title={t('stats.perMonth.title')}
        description={t('stats.perMonth.help')}
      >
        <MonthlyChart months={months} insights={insights} />
      </StatsSection>

      <StatsSection
        title={t('stats.ratings.title')}
        description={t('stats.ratings.help')}
      >
        <RatingDistribution distribution={stats.ratingDistribution} />
      </StatsSection>

      {stats.topGenres.length > 0 && (
        <StatsSection
          title={t('stats.genres.title')}
          description={t('stats.genres.help')}
        >
          <TopGenres genres={stats.topGenres} totalMovies={stats.totalMovies} />
        </StatsSection>
      )}
    </View>
  );
}
