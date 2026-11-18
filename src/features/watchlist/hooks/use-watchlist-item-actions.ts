import { router } from 'expo-router';
import { toast } from 'sonner-native';
import type { IWatchlistItem } from '@/api/types';
import { useRemoveWatchlistItemMutation } from '../api/delete-watchlist-item';

export function useWatchlistItemActions() {
  const removeItem = useRemoveWatchlistItemMutation();

  function edit(item: IWatchlistItem) {
    router.push({
      pathname: '/watchlist/[itemId]/edit',
      params: { itemId: item.id },
    });
  }

  function remove(item: IWatchlistItem) {
    removeItem.mutate(item.id, {
      onSuccess: () => {
        toast.success('Removed from your watchlist');
      },
      onError: () => {
        toast.error("Couldn't remove it. Try again.");
      },
    });
  }

  return { edit, remove };
}
