import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import { queryKeys } from './query-keys';
import type { TUserStats } from './types';

export async function getUserStats(userId: string): Promise<TUserStats> {
  const { data } = await apiClient.get<TUserStats>(`/users/${userId}/stats`);
  return data;
}

export function useUserStatsQuery(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.stats(userId),
    queryFn: () => getUserStats(userId),
  });
}
