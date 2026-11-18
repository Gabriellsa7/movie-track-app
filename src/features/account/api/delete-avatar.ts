import { apiClient } from '@/api/client';
import type { TUser } from '@/api/types';
import { useAccountMutation } from './account-mutation';

export async function removeAvatar(userId: string): Promise<TUser> {
  const { data } = await apiClient.delete<TUser>(`/users/${userId}/avatar`);
  return data;
}

export function useRemoveAvatarMutation() {
  return useAccountMutation((userId) => removeAvatar(userId));
}
