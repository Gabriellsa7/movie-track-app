import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
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

export function useUserMoviesQuery(userId: string, query: IListMoviesQuery) {
  return useQuery({
    queryKey: queryKeys.users.movies(userId, query),
    queryFn: () => listUserMovies(userId, query),
    placeholderData: keepPreviousData,
  });
}
