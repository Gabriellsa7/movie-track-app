import { useMutation } from '@tanstack/react-query';
import { logout } from '@/lib/session/session';

export function useLogoutMutation() {
  return useMutation({ mutationFn: logout });
}
