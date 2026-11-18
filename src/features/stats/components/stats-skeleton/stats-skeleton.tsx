import { View } from 'react-native';
import { Skeleton } from '@/components/skeleton';

const CARDS = [0, 1, 2, 3, 4, 5];

export function StatsSkeleton() {
  return (
    <View className="gap-4">
      <View className="flex-row flex-wrap gap-2.5">
        {CARDS.map((card) => (
          <Skeleton
            key={card}
            className="h-[112px] min-w-[45%] flex-1 rounded-[14px]"
          />
        ))}
      </View>
      <Skeleton className="h-[220px] rounded-[14px]" />
      <Skeleton className="h-[180px] rounded-[14px]" />
    </View>
  );
}
