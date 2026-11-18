import { View } from 'react-native';
import { Skeleton } from '@/components/skeleton';

export function UserRowSkeleton() {
  return (
    <View className="flex-row items-center gap-3 px-3.5 py-3">
      <Skeleton className="h-11 w-11 rounded-full" />
      <View className="flex-1 gap-1.5">
        <Skeleton className="h-4 w-36 rounded" />
        <Skeleton className="h-3 w-28 rounded" />
      </View>
    </View>
  );
}
