import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import { queryKeys } from './query-keys';
import type { IUserStats } from './types';

export async function getUserStats(userId: string): Promise<IUserStats> {
  const { data } = await apiClient.get<IUserStats>(`/users/${userId}/stats`);
  return data;
}

export function useUserStatsQuery(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.stats(userId),
    queryFn: () => getUserStats(userId),
  });
}
