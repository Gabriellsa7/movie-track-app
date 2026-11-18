import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/query-keys';
import type { IUser } from '@/api/types';
import { writeStoredUser } from '@/lib/session/session.storage';
import { requireUserId, useSessionStore } from '@/stores/session.store';

export function useAccountMutation<TVariables>(
  mutationFn: (userId: string, variables: TVariables) => Promise<IUser>,
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (variables: TVariables) =>
      mutationFn(requireUserId(), variables),
    onSuccess: async (user) => {
      useSessionStore.getState().setUser(user);
      await writeStoredUser(user);
      await client.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
