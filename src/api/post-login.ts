import { useMutation } from '@tanstack/react-query';
import { startSession } from '@/lib/session/session';
import { apiClient } from './client';
import type { TAuthTokens, TLoginBody } from './types';

export async function login(body: TLoginBody): Promise<TAuthTokens> {
  const { data } = await apiClient.post<TAuthTokens>('/auth/login', body);
  return data;
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (body: TLoginBody) => {
      await startSession(await login(body));
    },
  });
}
