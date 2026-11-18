import { Text, View } from 'react-native';
import { SectionError } from '@/components/section-error';
import { Skeleton } from '@/components/skeleton';
import { useWatchlistItemQuery } from '../../../api/get-watchlist-item';
import { ItemForm } from '../item-form/item-form';

export function EditItem({ itemId }: { itemId: string }) {
  const item = useWatchlistItemQuery(itemId);

  if (item.data) {
    return <ItemForm item={item.data} />;
  }
  return (
    <View className="gap-4 px-5 pt-4">
      {item.isPending ? (
        <Skeleton className="h-40 rounded-xl" />
      ) : item.isError ? (
        <SectionError
          message="Couldn't load this movie."
          onRetry={() => void item.refetch()}
        />
      ) : (
        <Text className="font-sans text-base text-secondary-text-color">
          This movie is no longer on your watchlist.
        </Text>
      )}
    </View>
  );
}
