import { useMutation } from '@tanstack/react-query';
import { startSession } from '@/lib/session/session';
import { apiClient } from './client';
import type { IAuthTokens, ILoginBody } from './types';

export async function login(body: ILoginBody): Promise<IAuthTokens> {
  const { data } = await apiClient.post<IAuthTokens>('/auth/login', body);
  return data;
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (body: ILoginBody) => {
      await startSession(await login(body));
    },
  });
}
