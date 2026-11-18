import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TChangePasswordBody } from '@/api/types';
import { requireUserId } from '@/stores/session.store';

export async function changePassword(
  userId: string,
  body: TChangePasswordBody,
): Promise<void> {
  await apiClient.patch(`/users/${userId}/password`, body);
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (body: TChangePasswordBody) =>
      changePassword(requireUserId(), body),
  });
}
