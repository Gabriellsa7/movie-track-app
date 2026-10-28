import * as SecureStore from 'expo-secure-store';
import type { TUser } from '@/api/types';

const REFRESH_TOKEN_KEY = 'movie-track.refresh-token';
// The account is kept too, so the app opens offline with the cached data.
const USER_KEY = 'movie-track.user';

export async function readRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function writeRefreshToken(
  refreshToken: string | null,
): Promise<void> {
  if (refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}

export async function readStoredUser(): Promise<TUser | null> {
  const stored = await SecureStore.getItemAsync(USER_KEY);
  return stored ? (JSON.parse(stored) as TUser) : null;
}

export async function writeStoredUser(user: TUser | null): Promise<void> {
  if (user) {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
}
