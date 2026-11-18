import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from './client';
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

export function useInvalidateWatchlist() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: queryKeys.watchlist.all });
}
