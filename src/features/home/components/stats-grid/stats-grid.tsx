import { View } from 'react-native';
import type { IUserStats } from '@/api/types';
import { Skeleton } from '@/components/skeleton';
import { formatAverage, formatHours } from '@/lib/stats';
import { StatCard } from '../stat-card/stat-card';

export function StatsGrid({ stats }: { stats: IUserStats | undefined }) {
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
    <View accessibilityLabel="Summary" className="flex-row flex-wrap gap-2.5">
      <StatCard label="Movies" value={String(stats.totalMovies)} />
      <StatCard
        label="Average rating"
        value={formatAverage(stats.averageRating)}
      />
      <StatCard label="Favorites" value={String(stats.favoritesCount)} />
      <StatCard label="Hours" value={formatHours(stats.totalMinutes)} />
    </View>
  );
}
