import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { queryKeys } from './query-keys';
import type { ITmdbMovieDetails } from './types';

export interface ITmdbDetailsValues {
  director: string;
  durationMinutes: string;
}

export async function getTmdbMovieDetails(
  tmdbId: number,
): Promise<ITmdbMovieDetails> {
  const { data } = await apiClient.get<ITmdbMovieDetails>(
    `/tmdb/movies/${String(tmdbId)}`,
  );
  return data;
}

export function useFetchTmdbDetailsValues() {
  const client = useQueryClient();
  return async (tmdbId: number): Promise<ITmdbDetailsValues | undefined> => {
    try {
      const details = await client.query({
        queryKey: queryKeys.tmdb.details(tmdbId),
        queryFn: () => getTmdbMovieDetails(tmdbId),
        staleTime: Infinity,
      });
      return {
        director: details.director ?? '',
        durationMinutes: details.durationMinutes
          ? String(details.durationMinutes)
          : '',
      };
    } catch {
      return undefined;
    }
  };
}
