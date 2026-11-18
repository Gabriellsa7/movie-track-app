import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import { queryKeys } from './query-keys';
import type { TGenre } from './types';

export async function listGenres(): Promise<TGenre[]> {
  const { data } = await apiClient.get<TGenre[]>('/genres');
  return data;
}

export function useGenresQuery() {
  return useQuery({
    queryKey: queryKeys.genres,
    queryFn: listGenres,
    // The genre list is a fixed seed on the backend.
    staleTime: Infinity,
  });
}
