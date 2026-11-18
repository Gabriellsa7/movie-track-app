import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export async function verifyEmail(token: string): Promise<void> {
  await apiClient.post('/auth/verify-email', { token });
}

export function useVerifyEmailMutation() {
  return useMutation({ mutationFn: verifyEmail });
}
