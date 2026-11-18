import { View } from 'react-native';
import { Skeleton } from '@/components/skeleton';

export function MovieDetailSkeleton() {
  return (
    <View className="gap-4">
      <View className="flex-row gap-1.5">
        <Skeleton className="h-[26px] w-24 rounded-full" />
        <Skeleton className="h-[26px] w-20 rounded-full" />
      </View>
      <Skeleton className="h-[62px] rounded-[14px]" />
      <Skeleton className="h-14 rounded-xl" />
      <Skeleton className="h-28 rounded-[14px]" />
    </View>
  );
}
