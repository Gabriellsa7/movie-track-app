import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/query-keys';
import type { IMovie, IWatchlistItemWatchedBody } from '@/api/types';

// "I watched it": creates the movie from the item and removes the item.
export async function markWatchlistItemWatched(
  itemId: string,
  body: IWatchlistItemWatchedBody,
): Promise<IMovie> {
  const { data } = await apiClient.post<IMovie>(
    `/watchlist/${itemId}/watched`,
    body,
  );
  return data;
}

export function useMarkWatchedMutation(itemId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: IWatchlistItemWatchedBody) =>
      markWatchlistItemWatched(itemId, body),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.watchlist.all }),
        client.invalidateQueries({ queryKey: queryKeys.movies.all }),
        client.invalidateQueries({ queryKey: queryKeys.users.all }),
      ]),
  });
}
