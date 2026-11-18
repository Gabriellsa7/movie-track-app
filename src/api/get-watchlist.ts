import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from './client';
import { queryKeys } from './query-keys';
import type { TListWatchlistQuery, TWatchlistPage } from './types';

export async function listWatchlist(
  query: TListWatchlistQuery = {},
): Promise<TWatchlistPage> {
  const { data } = await apiClient.get<TWatchlistPage>('/watchlist', {
    params: query,
  });
  return data;
}

export function useWatchlistQuery(query: TListWatchlistQuery) {
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
