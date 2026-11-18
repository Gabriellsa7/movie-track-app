import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateMyMovies } from '@/api/get-movies';
import type { IMovie, IRewatchMovieBody } from '@/api/types';

export async function rewatchMovie(
  movieId: string,
  body: IRewatchMovieBody = {},
): Promise<IMovie> {
  const { data } = await apiClient.post<IMovie>(
    `/movies/${movieId}/rewatch`,
    body,
  );
  return data;
}

export function useRewatchMovieMutation(movieId: string) {
  const invalidate = useInvalidateMyMovies();
  return useMutation({
    mutationFn: (body?: IRewatchMovieBody) => rewatchMovie(movieId, body),
    onSuccess: invalidate,
  });
}
