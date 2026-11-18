import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { login } from '@/api/post-login';
import type { INewUserBody, IUser } from '@/api/types';
import { startSession } from '@/lib/session/session';

export async function signUp(body: INewUserBody): Promise<IUser> {
  const { data } = await apiClient.post<IUser>('/users', body);
  return data;
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: async (body: INewUserBody) => {
      await signUp(body);
      await startSession(
        await login({ email: body.email, password: body.password }),
      );
    },
  });
}
