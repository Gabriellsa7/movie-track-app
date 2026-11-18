import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { requireUserId } from '@/stores/session.store';

export async function resendEmailVerification(userId: string): Promise<void> {
  await apiClient.post(`/users/${userId}/email-verification`);
}

export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: () => resendEmailVerification(requireUserId()),
  });
}
