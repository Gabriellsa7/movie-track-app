import { Text, View } from 'react-native';
import type { IUserStats } from '@/api/types';
import { Skeleton } from '@/components/skeleton';
import { lastTwelveMonths } from '@/lib/stats';

const CHART_HEIGHT = 70;
const EMPTY_BAR_HEIGHT = 3;

export function MoviesPerMonth({ stats }: { stats: IUserStats | undefined }) {
  if (!stats) {
    return <Skeleton className="h-[122px] rounded-[14px]" />;
  }

  const months = lastTwelveMonths(stats.moviesPerMonth, new Date());
  const max = Math.max(...months.map((month) => month.count), 1);
  const summary = months
    .map((month) => `${month.label}: ${month.count}`)
    .join(', ');

  return (
    <View className="rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
      <Text
        accessibilityRole="header"
        className="mb-3.5 font-semibold text-sm text-primary-text-color"
      >
        Movies per month
      </Text>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Movies watched per month. ${summary}`}
        className="flex-row items-end gap-1.5"
        style={{ height: CHART_HEIGHT }}
      >
        {months.map((month) => (
          <View
            key={month.month}
            className={`flex-1 rounded-b-[1px] rounded-t-[4px] ${
              month.count === 0
                ? 'bg-primary-border-color'
                : 'bg-accent-bg-color'
            }`}
            style={{
              height: Math.max(
                EMPTY_BAR_HEIGHT,
                Math.round((month.count / max) * CHART_HEIGHT),
              ),
            }}
          />
        ))}
      </View>
    </View>
  );
}
