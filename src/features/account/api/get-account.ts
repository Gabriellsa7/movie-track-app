import { useQuery } from '@tanstack/react-query';
import { getAccount } from '@/api/get-account';
import { queryKeys } from '@/api/query-keys';
import { writeStoredUser } from '@/lib/session/session.storage';
import { requireUserId, useSessionStore } from '@/stores/session.store';

export function useAccountQuery() {
  const userId = useSessionStore((state) => state.userId);
  return useQuery({
    queryKey: queryKeys.users.account(userId ?? ''),
    queryFn: async () => {
      const user = await getAccount(requireUserId());
      useSessionStore.getState().setUser(user);
      await writeStoredUser(user);
      return user;
    },
    enabled: userId !== null,
  });
}
