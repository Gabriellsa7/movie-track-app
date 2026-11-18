import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import type { IWatchlistItem } from '@/api/types';
import { toast } from 'sonner-native';
import { toIsoDate } from '@/lib/validation/rules';
import { ITEM_ID } from '@/test/constants';
import { A_MOVIE, A_WATCHLIST_ITEM } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { WatchlistWatchedScreen } from './watchlist-watched';

const COMPLETE_ITEM = {
  ...A_WATCHLIST_ITEM,
  releaseYear: 2023,
  genreIds: ['genre-1'],
  synopsis: 'A toilet cleaner in Tokyo.',
};

async function renderWatched(item: IWatchlistItem = COMPLETE_ITEM) {
  mockApi.onGet('/genres').reply(200, [{ id: 'genre-1', name: 'Drama' }]);
  mockApi
    .onGet('/watchlist')
    .reply(200, { items: [item], total: 1, page: 1, limit: 50 });
  const client = createTestQueryClient();
  await renderRouter(
    {
      index: () => null,
      'watchlist/[itemId]/watched': () => (
        <QueryClientProvider client={client}>
          <WatchlistWatchedScreen />
        </QueryClientProvider>
      ),
    },
    { initialUrl: `/watchlist/${ITEM_ID}/watched` },
  );
  await screen.findByRole('header', { name: item.title });
}

function rate(star: number) {
  return fireEvent.press(screen.getByTestId(`rating-star-${String(star)}`), {
    nativeEvent: { locationX: 100 },
  });
}

function submit() {
  return fireEvent.press(
    screen.getByRole('button', { name: 'Log and remove from list' }),
  );
}

describe('When we mark a watchlist movie as watched', () => {
  it('should log it with the rating and leave it out of the list', async () => {
    mockApi.onPost(`/watchlist/${ITEM_ID}/watched`).reply(201, A_MOVIE);
    await renderWatched();

    expect(screen.queryByText(/missing some details/)).toBeNull();
    await rate(8);
    await fireEvent.changeText(screen.getByLabelText('Your review'), 'Lovely.');
    await submit();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Movie logged and removed from your watchlist',
      );
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toEqual({
      rating: 8,
      watchedAt: toIsoDate(new Date()),
      isFavorite: false,
      review: 'Lovely.',
    });
  });

  it('should ask for the details the item does not have', async () => {
    mockApi.onPost(`/watchlist/${ITEM_ID}/watched`).reply(201, A_MOVIE);
    await renderWatched(A_WATCHLIST_ITEM);

    expect(screen.getByText(/missing some details/)).toBeOnTheScreen();
    await rate(9);
    await submit();

    expect(await screen.findByText('Enter the year')).toBeOnTheScreen();
    expect(screen.getByText('Write a synopsis')).toBeOnTheScreen();
    expect(screen.getByText('Pick at least one genre')).toBeOnTheScreen();
    expect(mockApi.history.post).toHaveLength(0);

    await fireEvent.changeText(screen.getByLabelText('Year *'), '2023');
    await fireEvent.press(await screen.findByText('Drama'));
    await fireEvent.changeText(
      screen.getByLabelText('Synopsis *'),
      'A toilet cleaner in Tokyo.',
    );
    await submit();

    await waitFor(() => {
      expect(mockApi.history.post).toHaveLength(1);
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toMatchObject({
      releaseYear: 2023,
      genreIds: ['genre-1'],
      synopsis: 'A toilet cleaner in Tokyo.',
    });
  });

  it('should ask for the details when the API says they are missing', async () => {
    mockApi
      .onPost(`/watchlist/${ITEM_ID}/watched`)
      .reply(...apiErrorReply(422, 'INCOMPLETE_MOVIE'));
    await renderWatched();

    await rate(7);
    await submit();

    expect(await screen.findByText(/missing some details/)).toBeOnTheScreen();
  });

  it('should tell when the item is gone', async () => {
    mockApi
      .onGet('/watchlist')
      .reply(200, { items: [], total: 0, page: 1, limit: 50 });
    const client = createTestQueryClient();
    await renderRouter(
      {
        index: () => null,
        'watchlist/[itemId]/watched': () => (
          <QueryClientProvider client={client}>
            <WatchlistWatchedScreen />
          </QueryClientProvider>
        ),
      },
      { initialUrl: `/watchlist/${ITEM_ID}/watched` },
    );

    expect(
      await screen.findByText('This movie is no longer on your watchlist.'),
    ).toBeOnTheScreen();
  });
});
