import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateWatchlist } from '@/api/get-watchlist';
import type { TNewWatchlistItemBody, TWatchlistItem } from '@/api/types';

export async function addWatchlistItem(
  body: TNewWatchlistItemBody,
): Promise<TWatchlistItem> {
  const { data } = await apiClient.post<TWatchlistItem>('/watchlist', body);
  return data;
}

export function useAddWatchlistItemMutation() {
  const invalidate = useInvalidateWatchlist();
  return useMutation({ mutationFn: addWatchlistItem, onSuccess: invalidate });
}
