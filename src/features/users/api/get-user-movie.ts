import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/query-keys';
import type { TMovie } from '@/api/types';

export async function getUserMovie(
  userId: string,
  movieId: string,
): Promise<TMovie> {
  const { data } = await apiClient.get<TMovie>(
    `/users/${userId}/movies/${movieId}`,
  );
  return data;
}

export function useUserMovieQuery(userId: string, movieId: string) {
  return useQuery({
    queryKey: queryKeys.users.movie(userId, movieId),
    queryFn: () => getUserMovie(userId, movieId),
  });
}
