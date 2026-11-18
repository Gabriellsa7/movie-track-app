import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from './client';
import { queryKeys } from './query-keys';
import type { IListMoviesQuery, IMoviePage } from './types';

export async function listMovies(
  query: IListMoviesQuery = {},
): Promise<IMoviePage> {
  const { data } = await apiClient.get<IMoviePage>('/movies', {
    params: query,
  });
  return data;
}

export function useMoviesQuery(query: IListMoviesQuery) {
  return useQuery({
    queryKey: queryKeys.movies.list(query),
    queryFn: () => listMovies(query),
    placeholderData: keepPreviousData,
  });
}

export function useInvalidateMyMovies() {
  const client = useQueryClient();
  return () =>
    Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.movies.all }),
      client.invalidateQueries({ queryKey: queryKeys.users.all }),
    ]);
}
