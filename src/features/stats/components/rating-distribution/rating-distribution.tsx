import { Star } from 'lucide-react-native';
import { Text, View } from 'react-native';
import type { IUserStats } from '@/api/types';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

interface IRatingDistributionProps {
  distribution: IUserStats['ratingDistribution'];
}

export function RatingDistribution({ distribution }: IRatingDistributionProps) {
  const scheme = useAppTheme();
  const rows = distribution
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.rating - a.rating);
  const max = Math.max(...rows.map((entry) => entry.count), 1);

  return (
    <View className="gap-2">
      {rows.map((entry) => (
        <View
          key={entry.rating}
          accessible
          accessibilityLabel={`Rating ${String(entry.rating)}: ${String(entry.count)} ${
            entry.count === 1 ? 'movie' : 'movies'
          }`}
          className="flex-row items-center gap-2.5"
        >
          <View className="w-11 flex-row items-center gap-1">
            <Star
              size={12}
              color={color(scheme, 'star-filled-color')}
              fill={color(scheme, 'star-filled-color')}
            />
            <Text className="font-semibold text-xs text-primary-text-color">
              {entry.rating}
            </Text>
          </View>
          <View className="h-2.5 flex-1 overflow-hidden rounded-full bg-tertiary-bg-color">
            <View
              className="rounded-full bg-accent-bg-color"
              style={{
                height: '100%',
                width: `${String((entry.count / max) * 100)}%`,
              }}
            />
          </View>
          <Text className="w-7 text-right font-sans text-xs text-secondary-text-color">
            {entry.count}
          </Text>
        </View>
      ))}
    </View>
  );
}
