import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import { queryKeys } from './query-keys';
import type { IGenre } from './types';

export async function listGenres(): Promise<IGenre[]> {
  const { data } = await apiClient.get<IGenre[]>('/genres');
  return data;
}

export function useGenresQuery() {
  return useQuery({
    queryKey: queryKeys.genres,
    queryFn: listGenres,
    staleTime: Infinity,
  });
}

export function useGenreNames(
  genreIds: readonly string[] | undefined,
): string[] {
  const { data } = useGenresQuery();
  return (genreIds ?? [])
    .map((genreId) => data?.find((genre) => genre.id === genreId)?.name)
    .filter((name): name is string => Boolean(name));
}
