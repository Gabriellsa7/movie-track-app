import { apiClient } from '@/api/client';
import type { TUpdateUserBody, TUser } from '@/api/types';
import { useAccountMutation } from './account-mutation';

export async function updateAccount(
  userId: string,
  body: TUpdateUserBody,
): Promise<TUser> {
  const { data } = await apiClient.put<TUser>(`/users/${userId}`, body);
  return data;
}

export function useUpdateAccountMutation() {
  return useAccountMutation(updateAccount);
}
