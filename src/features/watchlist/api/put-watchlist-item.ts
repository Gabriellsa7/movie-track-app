import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateWatchlist } from '@/api/get-watchlist';
import { mapCachedItems, type TCachedPages } from '@/api/pagination';
import { queryKeys } from '@/api/query-keys';
import type { IUpdateWatchlistItemBody, IWatchlistItem } from '@/api/types';

export async function updateWatchlistItem(
  itemId: string,
  body: IUpdateWatchlistItemBody,
): Promise<IWatchlistItem> {
  const { data } = await apiClient.put<IWatchlistItem>(
    `/watchlist/${itemId}`,
    body,
  );
  return data;
}

export function useUpdateWatchlistItemMutation(itemId: string) {
  const client = useQueryClient();
  const invalidate = useInvalidateWatchlist();
  return useMutation({
    mutationFn: (body: IUpdateWatchlistItemBody) =>
      updateWatchlistItem(itemId, body),
    onMutate: async (body) => {
      await client.cancelQueries({ queryKey: queryKeys.watchlist.all });
      const previous = client.getQueriesData<TCachedPages<IWatchlistItem>>({
        queryKey: queryKeys.watchlist.all,
      });
      if (body.priority) {
        const { priority } = body;
        client.setQueriesData<TCachedPages<IWatchlistItem>>(
          { queryKey: queryKeys.watchlist.all },
          (data) =>
            mapCachedItems(data, (item) =>
              item.id === itemId ? { ...item, priority } : item,
            ),
        );
      }
      return { previous };
    },
    onError: (_error, _body, context) => {
      context?.previous.forEach(([key, page]) => {
        client.setQueryData(key, page);
      });
    },
    onSettled: invalidate,
  });
}
