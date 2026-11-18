import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/query-keys';
import type { TListMoviesQuery, TMoviePage } from '@/api/types';

export async function listUserMovies(
  userId: string,
  query: TListMoviesQuery = {},
): Promise<TMoviePage> {
  const { data } = await apiClient.get<TMoviePage>(`/users/${userId}/movies`, {
    params: query,
  });
  return data;
}

export function useUserMoviesQuery(userId: string, query: TListMoviesQuery) {
  return useQuery({
    queryKey: queryKeys.users.movies(userId, query),
    queryFn: () => listUserMovies(userId, query),
    placeholderData: keepPreviousData,
  });
}
