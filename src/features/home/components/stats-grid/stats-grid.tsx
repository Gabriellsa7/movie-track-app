import { View } from 'react-native';
import type { IUserStats } from '@/api/types';
import { Skeleton } from '@/components/skeleton';
import { formatAverage, formatHours } from '@/lib/stats';
import { StatCard } from '../stat-card/stat-card';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n';

export function StatsGrid({ stats }: { stats: IUserStats | undefined }) {
  const { t } = useTranslation();
  const language = useLanguage();
  if (!stats) {
    return (
      <View className="flex-row flex-wrap gap-2.5">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton
            key={index}
            className="h-[82px] min-w-[40%] flex-1 rounded-[14px]"
          />
        ))}
      </View>
    );
  }

  return (
    <View
      accessibilityLabel={t('home.stats.summary')}
      className="flex-row flex-wrap gap-2.5"
    >
      <StatCard
        label={t('home.stats.movies')}
        value={String(stats.totalMovies)}
      />
      <StatCard
        label={t('home.stats.averageRating')}
        value={formatAverage(stats.averageRating, language)}
      />
      <StatCard
        label={t('home.stats.favorites')}
        value={String(stats.favoritesCount)}
      />
      <StatCard
        label={t('home.stats.hours')}
        value={formatHours(stats.totalMinutes)}
      />
    </View>
  );
}
