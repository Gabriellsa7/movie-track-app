import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/query-keys';
import type { IListUsersQuery, IUserPage } from '@/api/types';

export async function listUsers(
  query: IListUsersQuery = {},
): Promise<IUserPage> {
  const { data } = await apiClient.get<IUserPage>('/users', { params: query });
  return data;
}

export function useUsersQuery(query: IListUsersQuery) {
  return useQuery({
    queryKey: queryKeys.users.list(query),
    queryFn: () => listUsers(query),
    placeholderData: keepPreviousData,
  });
}
