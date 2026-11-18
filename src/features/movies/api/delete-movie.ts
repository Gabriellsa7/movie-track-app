import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateMyMovies } from '@/api/get-movies';

export async function deleteMovie(movieId: string): Promise<void> {
  await apiClient.delete(`/movies/${movieId}`);
}

export function useDeleteMovieMutation() {
  const invalidate = useInvalidateMyMovies();
  return useMutation({ mutationFn: deleteMovie, onSuccess: invalidate });
}
