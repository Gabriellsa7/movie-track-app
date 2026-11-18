import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateMyMovies } from '@/api/get-movies';
import type { TMovie } from '@/api/types';
import { toFormData, type IUploadFile } from '@/api/upload-file';

export async function uploadMoviePoster(
  movieId: string,
  poster: IUploadFile,
): Promise<TMovie> {
  const { data } = await apiClient.put<TMovie>(
    `/movies/${movieId}/poster`,
    toFormData('poster', poster),
  );
  return data;
}

export function useUploadPosterMutation(movieId: string) {
  const invalidate = useInvalidateMyMovies();
  return useMutation({
    mutationFn: (poster: IUploadFile) => uploadMoviePoster(movieId, poster),
    onSuccess: invalidate,
  });
}
