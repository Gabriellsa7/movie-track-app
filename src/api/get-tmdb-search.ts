import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/i18n';
import { apiClient } from './client';
import { queryKeys } from './query-keys';
import type { ITmdbMoviePage, ITmdbSearchQuery } from './types';

const MIN_QUERY_LENGTH = 2;

export async function searchTmdbMovies(
  query: ITmdbSearchQuery,
): Promise<ITmdbMoviePage> {
  const { data } = await apiClient.get<ITmdbMoviePage>('/tmdb/search', {
    params: query,
  });
  return data;
}

export function useTmdbSearchQuery(query: ITmdbSearchQuery) {
  const language = useLanguage();
  return useQuery({
    queryKey: queryKeys.tmdb.search(query, language),
    queryFn: () => searchTmdbMovies(query),
    enabled: query.query.trim().length >= MIN_QUERY_LENGTH,
    placeholderData: keepPreviousData,
  });
}
