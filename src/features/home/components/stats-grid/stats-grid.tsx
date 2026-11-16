import { Text, View } from 'react-native';
import type { TUserStats } from '@/api/types';
import { Skeleton } from '@/components/skeleton';
import { formatAverage, formatHours } from '../../utils/home.utils';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      className="min-w-[40%] flex-1 gap-1.5 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-3.5"
    >
      <Text className="font-sans text-small text-tertiary-text-color">
        {label}
      </Text>
      <Text className="font-display text-[34px] leading-[34px] text-primary-text-color">
        {value}
      </Text>
    </View>
  );
}

export function StatsGrid({ stats }: { stats: TUserStats | undefined }) {
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
    <View accessibilityLabel="Resumo" className="flex-row flex-wrap gap-2.5">
      <StatCard label="Filmes" value={String(stats.totalMovies)} />
      <StatCard label="Nota média" value={formatAverage(stats.averageRating)} />
      <StatCard label="Favoritos" value={String(stats.favoritesCount)} />
      <StatCard label="Horas" value={formatHours(stats.totalMinutes)} />
    </View>
  );
}
