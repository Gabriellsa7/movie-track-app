import { Text, View } from 'react-native';
import { Skeleton } from '@/components/skeleton';

interface IMoviesHeaderProps {
  total: number | undefined;
}

export function MoviesHeader({ total }: IMoviesHeaderProps) {
  return (
    <View className="gap-1">
      <Text
        accessibilityRole="header"
        className="font-display text-4xl text-primary-text-color"
      >
        My movies
      </Text>
      {total === undefined ? (
        <Skeleton className="h-4 w-24 rounded" />
      ) : (
        <Text className="font-sans text-sm text-tertiary-text-color">
          {total === 1 ? '1 movie' : `${String(total)} movies`}
        </Text>
      )}
    </View>
  );
}
