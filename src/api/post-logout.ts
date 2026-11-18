import { apiClient } from './client';

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post(
    '/auth/logout',
    { refreshToken },
    { skipAuthRefresh: true },
  );
}
