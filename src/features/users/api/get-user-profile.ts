import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/query-keys';
import type { IUserProfile } from '@/api/types';

export async function getUserProfile(userId: string): Promise<IUserProfile> {
  const { data } = await apiClient.get<IUserProfile>(`/users/${userId}`);
  return data;
}

export function useUserProfileQuery(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.profile(userId),
    queryFn: () => getUserProfile(userId),
  });
}
