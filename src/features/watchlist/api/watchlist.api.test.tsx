import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useWatchlistQuery } from '@/api/get-watchlist';
import { queryKeys } from '@/api/query-keys';
import type { IWatchlistPage } from '@/api/types';
import { ITEM_ID } from '@/test/constants';
import { A_MOVIE, A_WATCHLIST_ITEM, A_WATCHLIST_PAGE } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient, createWrapper } from '@/test/render';
import { useRemoveWatchlistItemMutation } from './delete-watchlist-item';
import { useAddWatchlistItemMutation } from './post-watchlist-item';
import { useMarkWatchedMutation } from './post-watchlist-item-watched';
import { useUpdateWatchlistItemMutation } from './put-watchlist-item';

const LIST_KEY = queryKeys.watchlist.list({ planned: true });

function seededClient() {
  const client = createTestQueryClient();
  client.setQueryData(LIST_KEY, A_WATCHLIST_PAGE);
  return client;
}

describe('When we read and change the watchlist', () => {
  it('should load, add, remove and mark an item as watched', async () => {
    mockApi.onGet('/watchlist').reply(200, A_WATCHLIST_PAGE);
    mockApi.onPost('/watchlist').reply(201, A_WATCHLIST_ITEM);
    mockApi.onDelete(`/watchlist/${ITEM_ID}`).reply(204);
    mockApi.onPost(`/watchlist/${ITEM_ID}/watched`).reply(201, A_MOVIE);
    const wrapper = createWrapper(seededClient());

    const list = await renderHook(() => useWatchlistQuery({}), { wrapper });
    await waitFor(() => {
      expect(list.result.current.data).toEqual(A_WATCHLIST_PAGE);
    });

    const { result } = await renderHook(
      () => ({
        add: useAddWatchlistItemMutation(),
        remove: useRemoveWatchlistItemMutation(),
        watched: useMarkWatchedMutation(ITEM_ID),
      }),
      { wrapper },
    );
    await act(async () => {
      await result.current.add.mutateAsync({ title: 'Perfect Days' });
      await result.current.remove.mutateAsync(ITEM_ID);
      await expect(
        result.current.watched.mutateAsync({ rating: 9 }),
      ).resolves.toEqual(A_MOVIE);
    });
  });
});

describe('When we change an item priority', () => {
  it('should show the new priority at once on every cached page', async () => {
    mockApi
      .onPut(`/watchlist/${ITEM_ID}`)
      .reply(200, { ...A_WATCHLIST_ITEM, priority: 'high' });
    const client = seededClient();

    const { result } = await renderHook(
      () => useUpdateWatchlistItemMutation(ITEM_ID),
      {
        wrapper: createWrapper(client),
      },
    );
    await act(() => {
      result.current.mutate({ priority: 'high' });
    });

    expect(
      client.getQueryData<IWatchlistPage>(LIST_KEY)?.items[0]?.priority,
    ).toBe('high');
  });

  it('should roll back when the API refuses', async () => {
    mockApi
      .onPut(`/watchlist/${ITEM_ID}`)
      .reply(...apiErrorReply(404, 'WATCHLIST_ITEM_NOT_FOUND'));
    const client = seededClient();

    const { result } = await renderHook(
      () => useUpdateWatchlistItemMutation(ITEM_ID),
      {
        wrapper: createWrapper(client),
      },
    );
    await act(async () => {
      await result.current
        .mutateAsync({ priority: 'high' })
        .catch(() => undefined);
    });

    expect(
      client.getQueryData<IWatchlistPage>(LIST_KEY)?.items[0]?.priority,
    ).toBe('medium');
  });

  it('should not touch the cache for a change without priority', async () => {
    mockApi
      .onPut(`/watchlist/${ITEM_ID}`)
      .reply(200, { ...A_WATCHLIST_ITEM, note: 'x' });
    const client = seededClient();

    const { result } = await renderHook(
      () => useUpdateWatchlistItemMutation(ITEM_ID),
      {
        wrapper: createWrapper(client),
      },
    );
    await act(async () => {
      await result.current.mutateAsync({ note: 'x' });
    });

    expect(
      client.getQueryData<IWatchlistPage>(LIST_KEY)?.items[0]?.priority,
    ).toBe('medium');
  });
});
