import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { FIRST_PAGE, nextPageParam, PAGE_SIZE } from '@/api/pagination';
import { queryKeys } from '@/api/query-keys';
import type { IListMoviesQuery, IMoviePage } from '@/api/types';

export async function listUserMovies(
  userId: string,
  query: IListMoviesQuery = {},
): Promise<IMoviePage> {
  const { data } = await apiClient.get<IMoviePage>(`/users/${userId}/movies`, {
    params: query,
  });
  return data;
}

export function useUserMoviePagesQuery(
  userId: string,
  query: IListMoviesQuery,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.users.moviePages(userId, query),
    queryFn: ({ pageParam }) =>
      listUserMovies(userId, { ...query, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: nextPageParam,
    placeholderData: keepPreviousData,
  });
}
