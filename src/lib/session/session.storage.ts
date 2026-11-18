import * as SecureStore from 'expo-secure-store';
import type { IUser } from '@/api/types';

const REFRESH_TOKEN_KEY = 'movie-track.refresh-token';
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

export async function readStoredUser(): Promise<IUser | null> {
  const stored = await SecureStore.getItemAsync(USER_KEY);
  return stored ? (JSON.parse(stored) as IUser) : null;
}

export async function writeStoredUser(user: IUser | null): Promise<void> {
  if (user) {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
}
