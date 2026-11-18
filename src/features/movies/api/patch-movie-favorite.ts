import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvalidateMyMovies } from '@/api/get-movies';
import { queryKeys } from '@/api/query-keys';
import type { TMovie } from '@/api/types';

export async function setMovieFavorite(
  movieId: string,
  isFavorite: boolean,
): Promise<TMovie> {
  const { data } = await apiClient.patch<TMovie>(
    `/movies/${movieId}/favorite`,
    { isFavorite },
  );
  return data;
}

// Optimistic: the heart flips at once and rolls back if the API refuses.
export function useSetFavoriteMutation(movieId: string) {
  const client = useQueryClient();
  const invalidate = useInvalidateMyMovies();
  const detailKey = queryKeys.movies.detail(movieId);
  return useMutation({
    mutationFn: (isFavorite: boolean) => setMovieFavorite(movieId, isFavorite),
    onMutate: async (isFavorite) => {
      await client.cancelQueries({ queryKey: detailKey });
      const previous = client.getQueryData<TMovie>(detailKey);
      if (previous) {
        client.setQueryData<TMovie>(detailKey, { ...previous, isFavorite });
      }
      return { previous };
    },
    onError: (_error, _isFavorite, context) => {
      if (context?.previous) {
        client.setQueryData(detailKey, context.previous);
      }
    },
    onSettled: invalidate,
  });
}
