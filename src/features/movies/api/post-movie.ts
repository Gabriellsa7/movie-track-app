import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateMyMovies } from '@/api/get-movies';
import type { IMovie, INewMovieBody } from '@/api/types';

export async function createMovie(body: INewMovieBody): Promise<IMovie> {
  const { data } = await apiClient.post<IMovie>('/movies', body);
  return data;
}

export function useCreateMovieMutation() {
  const invalidate = useInvalidateMyMovies();
  return useMutation({ mutationFn: createMovie, onSuccess: invalidate });
}
