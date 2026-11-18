import { apiClient } from './client';
import type { TAuthTokens } from './types';

export async function refreshTokens(
  refreshToken: string,
): Promise<TAuthTokens> {
  const { data } = await apiClient.post<TAuthTokens>(
    '/auth/refresh',
    { refreshToken },
    { skipAuthRefresh: true },
  );
  return data;
}
