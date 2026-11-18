import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/query-keys';
import type { TListUsersQuery, TUserPage } from '@/api/types';

export async function listUsers(
  query: TListUsersQuery = {},
): Promise<TUserPage> {
  const { data } = await apiClient.get<TUserPage>('/users', { params: query });
  return data;
}

export function useUsersQuery(query: TListUsersQuery) {
  return useQuery({
    queryKey: queryKeys.users.list(query),
    queryFn: () => listUsers(query),
    placeholderData: keepPreviousData,
  });
}
