import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { IChangePasswordBody } from '@/api/types';
import { requireUserId } from '@/stores/session.store';

export async function changePassword(
  userId: string,
  body: IChangePasswordBody,
): Promise<void> {
  await apiClient.patch(`/users/${userId}/password`, body);
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (body: IChangePasswordBody) =>
      changePassword(requireUserId(), body),
  });
}
