import { apiClient } from './client';
import type { IUser } from './types';

export async function getAccount(userId: string): Promise<IUser> {
  const { data } = await apiClient.get<IUser>(`/users/${userId}/account`);
  return data;
}
