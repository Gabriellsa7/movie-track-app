import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateMyMovies } from '@/api/get-movies';
import type { TMovie, TNewMovieBody } from '@/api/types';

export async function createMovie(body: TNewMovieBody): Promise<TMovie> {
  const { data } = await apiClient.post<TMovie>('/movies', body);
  return data;
}

export function useCreateMovieMutation() {
  const invalidate = useInvalidateMyMovies();
  return useMutation({ mutationFn: createMovie, onSuccess: invalidate });
}
