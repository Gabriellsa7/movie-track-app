import { View } from 'react-native';
import { Skeleton } from '@/components/skeleton';

const ROWS = [0, 1, 2];

export function ProfileMoviesSkeleton() {
  return (
    <View className="gap-2.5">
      {ROWS.map((row) => (
        <Skeleton key={row} className="h-[100px] rounded-xl" />
      ))}
    </View>
  );
}
