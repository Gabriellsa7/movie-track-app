import { apiClient } from './client';

// Only the request: the session (lib/session) owns the logout flow and its hook.
export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post(
    '/auth/logout',
    { refreshToken },
    { skipAuthRefresh: true },
  );
}
