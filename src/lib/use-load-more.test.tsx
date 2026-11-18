import { renderHook } from '@testing-library/react-native';
import { useLoadMore } from './use-load-more';

function pagedQuery(overrides: object = {}) {
  return {
    hasNextPage: true,
    isFetchingNextPage: false,
    isFetchNextPageError: false,
    fetchNextPage: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('When a list reaches its end', () => {
  it('should load the next page when there is one', async () => {
    const query = pagedQuery();
    const { result } = await renderHook(() => useLoadMore(query));

    result.current.onEndReached();

    expect(query.fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('should not ask again while loading, at the end or after a failure', async () => {
    for (const state of [
      { isFetchingNextPage: true },
      { hasNextPage: false },
      { isFetchNextPageError: true },
    ]) {
      const query = pagedQuery(state);
      const { result } = await renderHook(() => useLoadMore(query));

      result.current.onEndReached();

      expect(query.fetchNextPage).not.toHaveBeenCalled();
    }
  });

  it('should show a footer only while loading or after a failure', async () => {
    const idle = await renderHook(() => useLoadMore(pagedQuery()));
    const loading = await renderHook(() =>
      useLoadMore(pagedQuery({ isFetchingNextPage: true })),
    );

    expect(idle.result.current.ListFooterComponent).toBeUndefined();
    expect(loading.result.current.ListFooterComponent).toBeDefined();
  });
});
