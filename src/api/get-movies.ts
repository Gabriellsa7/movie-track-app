import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from './client';
import { queryKeys } from './query-keys';
import type { TListMoviesQuery, TMoviePage } from './types';

export async function listMovies(
  query: TListMoviesQuery = {},
): Promise<TMoviePage> {
  const { data } = await apiClient.get<TMoviePage>('/movies', {
    params: query,
  });
  return data;
}

export function useMoviesQuery(query: TListMoviesQuery) {
  return useQuery({
    queryKey: queryKeys.movies.list(query),
    queryFn: () => listMovies(query),
    placeholderData: keepPreviousData,
  });
}

// Any change to my movies also changes my stats and my public profile.
export function useInvalidateMyMovies() {
  const client = useQueryClient();
  return () =>
    Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.movies.all }),
      client.invalidateQueries({ queryKey: queryKeys.users.all }),
    ]);
}
