import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { listWatchlist } from '@/api/get-watchlist';
import { queryKeys } from '@/api/query-keys';
import { cachedItems, type TCachedPages } from '@/api/pagination';
import type { IWatchlistItem } from '@/api/types';

const PAGE_LIMIT = 50;
const MAX_PAGES = 10;

function findCachedItem(
  client: QueryClient,
  itemId: string,
): IWatchlistItem | undefined {
  return client
    .getQueriesData<TCachedPages<IWatchlistItem>>({
      queryKey: queryKeys.watchlist.all,
    })
    .flatMap(([, data]) => cachedItems(data))
    .find((item) => item.id === itemId);
}

export async function findWatchlistItem(
  itemId: string,
): Promise<IWatchlistItem | null> {
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const result = await listWatchlist({ page, limit: PAGE_LIMIT });
    const item = result.items.find((candidate) => candidate.id === itemId);
    if (item) {
      return item;
    }
    if (page * PAGE_LIMIT >= result.total) {
      return null;
    }
  }
  return null;
}

export function useWatchlistItemQuery(itemId: string) {
  const client = useQueryClient();
  return useQuery({
    queryKey: queryKeys.watchlist.item(itemId),
    queryFn: () => findWatchlistItem(itemId),
    initialData: () => findCachedItem(client, itemId),
  });
}
