import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateWatchlist } from '@/api/get-watchlist';
import { queryKeys } from '@/api/query-keys';
import type {
  IUpdateWatchlistItemBody,
  IWatchlistItem,
  IWatchlistPage,
} from '@/api/types';

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

// Optimistic on every cached page, so a priority change shows at once.
export function useUpdateWatchlistItemMutation(itemId: string) {
  const client = useQueryClient();
  const invalidate = useInvalidateWatchlist();
  return useMutation({
    mutationFn: (body: IUpdateWatchlistItemBody) =>
      updateWatchlistItem(itemId, body),
    onMutate: async (body) => {
      await client.cancelQueries({ queryKey: queryKeys.watchlist.all });
      const previous = client.getQueriesData<IWatchlistPage>({
        queryKey: queryKeys.watchlist.all,
      });
      if (body.priority) {
        const { priority } = body;
        client.setQueriesData<IWatchlistPage>(
          { queryKey: queryKeys.watchlist.all },
          (page) =>
            page && {
              ...page,
              items: page.items.map((item) =>
                item.id === itemId ? { ...item, priority } : item,
              ),
            },
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
