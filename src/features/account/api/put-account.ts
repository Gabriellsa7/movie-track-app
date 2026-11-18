import { apiClient } from '@/api/client';
import type { IUpdateUserBody, IUser } from '@/api/types';
import { useAccountMutation } from './account-mutation';

export async function updateAccount(
  userId: string,
  body: IUpdateUserBody,
): Promise<IUser> {
  const { data } = await apiClient.put<IUser>(`/users/${userId}`, body);
  return data;
}

export function useUpdateAccountMutation() {
  return useAccountMutation(updateAccount);
}
