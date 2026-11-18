import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from './client';
import { FIRST_PAGE, nextPageParam, PAGE_SIZE } from './pagination';
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

export function useMoviePagesQuery(query: IListMoviesQuery) {
  return useInfiniteQuery({
    queryKey: queryKeys.movies.pages(query),
    queryFn: ({ pageParam }) =>
      listMovies({ ...query, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: nextPageParam,
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
