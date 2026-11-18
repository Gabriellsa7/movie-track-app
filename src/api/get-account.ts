import { apiClient } from './client';
import type { TUser } from './types';

export async function getAccount(userId: string): Promise<TUser> {
  const { data } = await apiClient.get<TUser>(`/users/${userId}/account`);
  return data;
}
