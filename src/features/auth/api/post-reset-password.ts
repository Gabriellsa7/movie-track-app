import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { IResetPasswordBody } from '@/api/types';

export async function resetPassword(body: IResetPasswordBody): Promise<void> {
  await apiClient.post('/auth/reset-password', body);
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: resetPassword });
}
