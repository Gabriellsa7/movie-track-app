import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { login } from '@/api/post-login';
import type { TNewUserBody, TUser } from '@/api/types';
import { startSession } from '@/lib/session/session';

export async function signUp(body: TNewUserBody): Promise<TUser> {
  const { data } = await apiClient.post<TUser>('/users', body);
  return data;
}

// Sign-up returns the user but no tokens, so it logs in right after.
export function useSignUpMutation() {
  return useMutation({
    mutationFn: async (body: TNewUserBody) => {
      await signUp(body);
      await startSession(
        await login({ email: body.email, password: body.password }),
      );
    },
  });
}
