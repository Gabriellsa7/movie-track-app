import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateMyMovies } from '@/api/get-movies';
import type { IMovie, IUpdateMovieBody } from '@/api/types';

export async function updateMovie(
  movieId: string,
  body: IUpdateMovieBody,
): Promise<IMovie> {
  const { data } = await apiClient.put<IMovie>(`/movies/${movieId}`, body);
  return data;
}

export function useUpdateMovieMutation(movieId: string) {
  const invalidate = useInvalidateMyMovies();
  return useMutation({
    mutationFn: (body: IUpdateMovieBody) => updateMovie(movieId, body),
    onSuccess: invalidate,
  });
}
