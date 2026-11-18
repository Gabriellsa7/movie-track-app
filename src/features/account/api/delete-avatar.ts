import { apiClient } from '@/api/client';
import type { IUser } from '@/api/types';
import { useAccountMutation } from './account-mutation';

export async function removeAvatar(userId: string): Promise<IUser> {
  const { data } = await apiClient.delete<IUser>(`/users/${userId}/avatar`);
  return data;
}

export function useRemoveAvatarMutation() {
  return useAccountMutation((userId) => removeAvatar(userId));
}
