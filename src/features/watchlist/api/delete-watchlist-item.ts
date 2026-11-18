import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateWatchlist } from '@/api/get-watchlist';

export async function removeWatchlistItem(itemId: string): Promise<void> {
  await apiClient.delete(`/watchlist/${itemId}`);
}

export function useRemoveWatchlistItemMutation() {
  const invalidate = useInvalidateWatchlist();
  return useMutation({
    mutationFn: removeWatchlistItem,
    onSuccess: invalidate,
  });
}
