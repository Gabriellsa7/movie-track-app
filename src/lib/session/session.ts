import { onlineManager } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { ApiError } from '@/api/api-error';
import { registerSessionHandlers } from '@/api/client';
import { EApiErrorCode } from '@/api/error-codes';
import * as authService from '@/api/services/auth.service';
import * as userService from '@/api/services/user.service';
import type { TAuthTokens } from '@/api/types';
import { queryPersister } from '@/lib/react-query/persister';
import { queryClient } from '@/lib/react-query/query-client';
import { useSessionStore } from '@/stores/session.store';
import {
  readRefreshToken,
  readStoredUser,
  writeRefreshToken,
  writeStoredUser,
} from './session.storage';

export function setUpSession() {
  registerSessionHandlers({
    getAccessToken: () => useSessionStore.getState().accessToken,
    refreshAccessToken,
    onSessionExpired: () => {
      void endSession();
    },
  });
}

// On app start: the stored refresh token brings the session back.
export async function bootstrapSession() {
  if (!(await readRefreshToken())) {
    useSessionStore.getState().clear();
    return;
  }
  try {
    await refreshAccessToken();
    await loadAccount();
  } catch (error) {
    if (ApiError.from(error).status === 401) {
      await endSession();
      return;
    }
    await resumeOffline();
  }
}

export async function startSession(tokens: TAuthTokens) {
  await saveTokens(tokens);
  await loadAccount();
}

export async function logout() {
  const refreshToken = await readRefreshToken();
  if (refreshToken) {
    // The device forgets the session even if the API can't revoke the token now.
    await authService.logout(refreshToken).catch(() => undefined);
  }
  await endSession();
}

async function endSession() {
  useSessionStore.getState().clear();
  queryClient.clear();
  await Promise.all([
    writeRefreshToken(null),
    writeStoredUser(null),
    queryPersister.removeClient(),
  ]);
}

// Without a connection, the cached account and queries keep the app usable (read only);
// the session is refreshed as soon as the device is back online.
async function resumeOffline() {
  const user = await readStoredUser();
  if (!user) {
    useSessionStore.getState().clear();
    return;
  }
  useSessionStore.getState().setUser(user);
  const unsubscribe = onlineManager.subscribe((online) => {
    if (online) {
      unsubscribe();
      void refreshAccessToken().then(loadAccount, () => undefined);
    }
  });
}

async function saveTokens({ accessToken, refreshToken }: TAuthTokens) {
  useSessionStore.getState().setAccessToken(accessToken);
  await writeRefreshToken(refreshToken);
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await readRefreshToken();
  if (!refreshToken) {
    throw new ApiError({
      message: 'No session',
      status: 401,
      code: EApiErrorCode.INVALID_TOKEN,
    });
  }
  const tokens = await authService.refreshTokens(refreshToken);
  await saveTokens(tokens);
  return tokens.accessToken;
}

async function loadAccount() {
  const accessToken = useSessionStore.getState().accessToken;
  const userId = accessToken ? jwtDecode(accessToken).sub : undefined;
  if (!userId) {
    throw new Error('Session without a user id');
  }
  const user = await userService.getAccount(userId);
  useSessionStore.getState().setUser(user);
  await writeStoredUser(user);
}
