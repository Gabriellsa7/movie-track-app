import { Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import type { IUserStats } from '@/api/types';
import { Skeleton } from '@/components/skeleton';
import { lastTwelveMonths } from '@/lib/stats';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';

const CHART_HEIGHT = 70;
const EMPTY_BAR_HEIGHT = 3;

export function MoviesPerMonth({ stats }: { stats: IUserStats | undefined }) {
  const scheme = useAppTheme();

  if (!stats) {
    return <Skeleton className="h-[122px] rounded-[14px]" />;
  }

  const months = lastTwelveMonths(stats.moviesPerMonth, new Date());
  const max = Math.max(...months.map((month) => month.count), 1);
  const summary = months
    .map((month) => `${month.label}: ${month.count}`)
    .join(', ');

  return (
    <Link href={ROUTES.stats} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`Movies per month. ${summary}`}
        accessibilityHint="Opens your dashboard"
        className="rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4 active:opacity-80"
      >
        <View className="mb-3.5 flex-row items-center justify-between">
          <Text className="font-semibold text-sm text-primary-text-color">
            Movies per month
          </Text>
          <View className="flex-row items-center gap-0.5">
            <Text className="font-semibold text-label text-accent-text-color">
              See dashboard
            </Text>
            <ChevronRight
              size={16}
              color={color(scheme, 'accent-text-color')}
            />
          </View>
        </View>
        <View
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
      </Pressable>
    </Link>
  );
}
