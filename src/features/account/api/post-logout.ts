import { useMutation } from '@tanstack/react-query';
import { logout } from '@/lib/session/session';

// The request lives in @/api/post-logout; the session ends even if the API can't revoke it.
export function useLogoutMutation() {
  return useMutation({ mutationFn: logout });
}
