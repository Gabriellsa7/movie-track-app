import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TResetPasswordBody } from '@/api/types';

export async function resetPassword(body: TResetPasswordBody): Promise<void> {
  await apiClient.post('/auth/reset-password', body);
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: resetPassword });
}
