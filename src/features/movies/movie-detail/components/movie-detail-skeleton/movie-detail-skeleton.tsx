import { View } from 'react-native';
import { Skeleton } from '@/components/skeleton';

export function MovieDetailSkeleton() {
  return (
    <View className="gap-6">
      <View className="flex-row gap-4">
        <Skeleton className="h-[180px] w-[120px] rounded-[12px]" />
        <View className="flex-1 justify-end gap-2">
          <Skeleton className="h-8 w-4/5 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <Skeleton className="h-5 w-1/3 rounded" />
        </View>
      </View>
      <Skeleton className="h-16 rounded-[14px]" />
      <Skeleton className="h-24 rounded-[14px]" />
    </View>
  );
}
