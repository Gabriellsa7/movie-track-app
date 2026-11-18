import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateMyMovies } from '@/api/get-movies';
import type { TMovie, TUpdateMovieBody } from '@/api/types';

export async function updateMovie(
  movieId: string,
  body: TUpdateMovieBody,
): Promise<TMovie> {
  const { data } = await apiClient.put<TMovie>(`/movies/${movieId}`, body);
  return data;
}

export function useUpdateMovieMutation(movieId: string) {
  const invalidate = useInvalidateMyMovies();
  return useMutation({
    mutationFn: (body: TUpdateMovieBody) => updateMovie(movieId, body),
    onSuccess: invalidate,
  });
}
