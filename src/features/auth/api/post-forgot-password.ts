import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email });
}

export function useRequestPasswordResetMutation() {
  return useMutation({ mutationFn: requestPasswordReset });
}
