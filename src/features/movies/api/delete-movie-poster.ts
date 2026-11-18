import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateMyMovies } from '@/api/get-movies';
import type { IMovie } from '@/api/types';

export async function removeMoviePoster(movieId: string): Promise<IMovie> {
  const { data } = await apiClient.delete<IMovie>(`/movies/${movieId}/poster`);
  return data;
}

export function useRemovePosterMutation(movieId: string) {
  const invalidate = useInvalidateMyMovies();
  return useMutation({
    mutationFn: () => removeMoviePoster(movieId),
    onSuccess: invalidate,
  });
}
