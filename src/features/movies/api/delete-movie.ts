import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/query-keys';

export async function deleteMovie(movieId: string): Promise<void> {
  await apiClient.delete(`/movies/${movieId}`);
}

export function useDeleteMovieMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteMovie,
    onSuccess: async (_data, movieId) => {
      const detailKey = queryKeys.movies.detail(movieId);
      client.removeQueries({ queryKey: detailKey, exact: true });
      await Promise.all([
        client.invalidateQueries({
          queryKey: queryKeys.movies.all,
          predicate: (query) =>
            JSON.stringify(query.queryKey) !== JSON.stringify(detailKey),
        }),
        client.invalidateQueries({ queryKey: queryKeys.users.all }),
      ]);
    },
  });
}
