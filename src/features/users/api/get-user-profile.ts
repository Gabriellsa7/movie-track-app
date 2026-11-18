import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/query-keys';
import type { TUserProfile } from '@/api/types';

export async function getUserProfile(userId: string): Promise<TUserProfile> {
  const { data } = await apiClient.get<TUserProfile>(`/users/${userId}`);
  return data;
}

export function useUserProfileQuery(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.profile(userId),
    queryFn: () => getUserProfile(userId),
  });
}
