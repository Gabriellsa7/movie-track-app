import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import { queryKeys } from './query-keys';
import type { TTmdbMoviePage, TTmdbSearchQuery } from './types';

const MIN_QUERY_LENGTH = 2;

export async function searchTmdbMovies(
  query: TTmdbSearchQuery,
): Promise<TTmdbMoviePage> {
  const { data } = await apiClient.get<TTmdbMoviePage>('/tmdb/search', {
    params: query,
  });
  return data;
}

// Pass an already debounced query; short queries don't hit TMDB.
export function useTmdbSearchQuery(query: TTmdbSearchQuery) {
  return useQuery({
    queryKey: queryKeys.tmdb.search(query),
    queryFn: () => searchTmdbMovies(query),
    enabled: query.query.trim().length >= MIN_QUERY_LENGTH,
    placeholderData: keepPreviousData,
  });
}
