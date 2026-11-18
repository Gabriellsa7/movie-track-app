import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import type { IUser } from '@/api/types';

export type TSessionStatus = 'loading' | 'authenticated' | 'anonymous';

interface ISessionState {
  status: TSessionStatus;
  // Memory only; SecureStore keeps the refresh token (see session.storage.ts).
  accessToken: string | null;
  userId: string | null;
  user: IUser | null;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: IUser) => void;
  clear: () => void;
}

export const useSessionStore = create<ISessionState>()((set) => ({
  status: 'loading',
  accessToken: null,
  userId: null,
  user: null,
  setAccessToken: (accessToken) => {
    set({ accessToken, userId: jwtDecode(accessToken).sub ?? null });
  },
  setUser: (user) => {
    set({ user, userId: user.id, status: 'authenticated' });
  },
  clear: () => {
    set({ status: 'anonymous', accessToken: null, userId: null, user: null });
  },
}));

// For account calls: they need the logged-in user's id.
export function requireUserId(): string {
  const { userId } = useSessionStore.getState();
  if (!userId) {
    throw new Error('Not logged in');
  }
  return userId;
}
