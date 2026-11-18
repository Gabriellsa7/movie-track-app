import { act, renderHook, waitFor } from '@testing-library/react-native';
import { A_MOVIE } from '@/test/fixtures';
import { mockApi } from '@/test/mock-api';
import { createWrapper } from '@/test/render';
import { useMoviePagesQuery } from './get-movies';
import { pagesItems } from './pagination';

const movieNumber = (number: number) => ({
  ...A_MOVIE,
  id: `movie-${String(number)}`,
});

describe('When we scroll through my movies', () => {
  it('should load the next page and join it to the first one', async () => {
    mockApi.onGet('/movies').reply((config) => {
      const { page } = config.params as { page: number };
      return page === 1
        ? [
            200,
            {
              items: Array.from({ length: 20 }, (_, index) =>
                movieNumber(index),
              ),
              total: 21,
              page: 1,
              limit: 20,
            },
          ]
        : [200, { items: [movieNumber(20)], total: 21, page: 2, limit: 20 }];
    });

    const { result } = await renderHook(
      () => useMoviePagesQuery({ sort: 'watchedAt' }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => {
      expect(result.current.hasNextPage).toBe(true);
    });

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(pagesItems(result.current.data)).toHaveLength(21);
    });
    expect(result.current.hasNextPage).toBe(false);
    expect(
      mockApi.history.get.map((request) => request.params as unknown),
    ).toEqual([
      { sort: 'watchedAt', page: 1, limit: 20 },
      { sort: 'watchedAt', page: 2, limit: 20 },
    ]);
  });
});
