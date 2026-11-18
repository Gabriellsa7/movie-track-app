import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateMyMovies } from '@/api/get-movies';
import type { TMovie, TRewatchMovieBody } from '@/api/types';

export async function rewatchMovie(
  movieId: string,
  body: TRewatchMovieBody = {},
): Promise<TMovie> {
  const { data } = await apiClient.post<TMovie>(
    `/movies/${movieId}/rewatch`,
    body,
  );
  return data;
}

export function useRewatchMovieMutation(movieId: string) {
  const invalidate = useInvalidateMyMovies();
  return useMutation({
    mutationFn: (body?: TRewatchMovieBody) => rewatchMovie(movieId, body),
    onSuccess: invalidate,
  });
}
