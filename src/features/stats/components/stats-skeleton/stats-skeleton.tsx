import { View } from 'react-native';
import { Skeleton } from '@/components/skeleton';

const ROWS = [0, 1, 2];

export function StatsSkeleton() {
  return (
    <View className="gap-4">
      <View className="gap-2.5">
        {ROWS.map((row) => (
          <View key={row} className="flex-row gap-2.5">
            <View className="flex-1">
              <Skeleton className="h-[112px] rounded-[14px]" />
            </View>
            <View className="flex-1">
              <Skeleton className="h-[112px] rounded-[14px]" />
            </View>
          </View>
        ))}
      </View>
      <Skeleton className="h-[220px] rounded-[14px]" />
      <Skeleton className="h-[180px] rounded-[14px]" />
    </View>
  );
}
