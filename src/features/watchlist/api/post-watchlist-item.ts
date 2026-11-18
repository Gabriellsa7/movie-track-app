import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateWatchlist } from '@/api/get-watchlist';
import type { INewWatchlistItemBody, IWatchlistItem } from '@/api/types';

export async function addWatchlistItem(
  body: INewWatchlistItemBody,
): Promise<IWatchlistItem> {
  const { data } = await apiClient.post<IWatchlistItem>('/watchlist', body);
  return data;
}

export function useAddWatchlistItemMutation() {
  const invalidate = useInvalidateWatchlist();
  return useMutation({ mutationFn: addWatchlistItem, onSuccess: invalidate });
}
