import { router } from 'expo-router';
import { toast } from 'sonner-native';
import type { IWatchlistItem } from '@/api/types';
import { useRemoveWatchlistItemMutation } from '../api/delete-watchlist-item';
import { i18n } from '@/i18n';

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
        toast.success(i18n.t('watchlist.removed'));
      },
      onError: () => {
        toast.error(i18n.t('watchlist.removeFailed'));
      },
    });
  }

  return { edit, remove };
}
