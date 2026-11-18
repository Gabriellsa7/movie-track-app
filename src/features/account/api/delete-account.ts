import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { logout } from '@/lib/session/session';
import { requireUserId } from '@/stores/session.store';

export async function deleteAccount(
  userId: string,
  password: string,
): Promise<void> {
  await apiClient.delete(`/users/${userId}`, { data: { password } });
}

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: async (password: string) => {
      await deleteAccount(requireUserId(), password);
      await logout();
    },
  });
}
