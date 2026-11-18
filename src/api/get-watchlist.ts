import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from './client';
import { FIRST_PAGE, nextPageParam, PAGE_SIZE } from './pagination';
import { queryKeys } from './query-keys';
import type { IListWatchlistQuery, IWatchlistPage } from './types';

export async function listWatchlist(
  query: IListWatchlistQuery = {},
): Promise<IWatchlistPage> {
  const { data } = await apiClient.get<IWatchlistPage>('/watchlist', {
    params: query,
  });
  return data;
}

export function useWatchlistQuery(query: IListWatchlistQuery) {
  return useQuery({
    queryKey: queryKeys.watchlist.list(query),
    queryFn: () => listWatchlist(query),
    placeholderData: keepPreviousData,
  });
}

export function useWatchlistPagesQuery(query: IListWatchlistQuery) {
  return useInfiniteQuery({
    queryKey: queryKeys.watchlist.pages(query),
    queryFn: ({ pageParam }) =>
      listWatchlist({ ...query, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: nextPageParam,
    placeholderData: keepPreviousData,
  });
}

export function useInvalidateWatchlist() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: queryKeys.watchlist.all });
}
