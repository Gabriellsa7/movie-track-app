import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { FIRST_PAGE, nextPageParam, PAGE_SIZE } from '@/api/pagination';
import { queryKeys } from '@/api/query-keys';
import type { IListUsersQuery, IUserPage } from '@/api/types';

export async function listUsers(
  query: IListUsersQuery = {},
): Promise<IUserPage> {
  const { data } = await apiClient.get<IUserPage>('/users', { params: query });
  return data;
}

export function useUserPagesQuery(query: IListUsersQuery) {
  return useInfiniteQuery({
    queryKey: queryKeys.users.pages(query),
    queryFn: ({ pageParam }) =>
      listUsers({ ...query, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: nextPageParam,
    placeholderData: keepPreviousData,
  });
}
