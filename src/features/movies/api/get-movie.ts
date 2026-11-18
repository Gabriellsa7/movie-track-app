import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/query-keys';
import type { IMovie } from '@/api/types';

export async function getMovie(movieId: string): Promise<IMovie> {
  const { data } = await apiClient.get<IMovie>(`/movies/${movieId}`);
  return data;
}

export function useMovieQuery(movieId: string) {
  return useQuery({
    queryKey: queryKeys.movies.detail(movieId),
    queryFn: () => getMovie(movieId),
  });
}
