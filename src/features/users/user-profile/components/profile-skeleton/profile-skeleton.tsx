import { View } from 'react-native';
import { Skeleton } from '@/components/skeleton';

export function ProfileSkeleton() {
  return (
    <View className="gap-[18px]">
      <View className="items-center gap-2">
        <Skeleton className="h-[88px] w-[88px] rounded-full" />
        <Skeleton className="h-9 w-48 rounded" />
        <Skeleton className="h-4 w-36 rounded" />
      </View>
      <Skeleton className="h-[76px] rounded-[14px]" />
    </View>
  );
}
