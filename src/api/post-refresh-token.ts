import { apiClient } from './client';
import type { IAuthTokens } from './types';

export async function refreshTokens(
  refreshToken: string,
): Promise<IAuthTokens> {
  const { data } = await apiClient.post<IAuthTokens>(
    '/auth/refresh',
    { refreshToken },
    { skipAuthRefresh: true },
  );
  return data;
}
