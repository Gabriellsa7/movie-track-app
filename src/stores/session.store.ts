import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import type { TUser } from '@/api/types';

export type TSessionStatus = 'loading' | 'authenticated' | 'anonymous';

interface ISessionState {
  status: TSessionStatus;
  // Memory only; SecureStore keeps the refresh token (see session.storage.ts).
  accessToken: string | null;
  userId: string | null;
  user: TUser | null;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: TUser) => void;
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
