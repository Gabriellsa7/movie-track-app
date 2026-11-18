import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { toast } from 'sonner-native';
import { ITEM_ID } from '@/test/constants';
import { A_WATCHLIST_ITEM } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { WatchlistItemFormScreen } from './watchlist-item-form';

const TMDB_PERFECT_DAYS = {
  tmdbId: 976893,
  title: 'Perfect Days',
  originalTitle: 'Perfect Days',
  synopsis: 'A toilet cleaner in Tokyo.',
  releaseYear: 2023,
  posterUrl: 'https://image.tmdb.org/t/p/w500/pd.jpg',
  genreIds: ['genre-1'],
};

async function renderForm(initialUrl = '/watchlist/new') {
  mockApi.onGet('/genres').reply(200, [{ id: 'genre-1', name: 'Drama' }]);
  const client = createTestQueryClient();
  await renderRouter(
    {
      index: () => null,
      'watchlist/new': () => (
        <QueryClientProvider client={client}>
          <WatchlistItemFormScreen />
        </QueryClientProvider>
      ),
      'watchlist/[itemId]/edit': () => (
        <QueryClientProvider client={client}>
          <WatchlistItemFormScreen />
        </QueryClientProvider>
      ),
    },
    { initialUrl },
  );
}

describe('When we add a movie to the watchlist', () => {
  it('should add it from TMDB with priority, date and note', async () => {
    mockApi.onGet('/tmdb/search').reply(200, {
      items: [TMDB_PERFECT_DAYS],
      total: 1,
      page: 1,
      limit: 20,
    });
    mockApi.onPost('/watchlist').reply(201, A_WATCHLIST_ITEM);
    await renderForm();

    await fireEvent.changeText(screen.getByLabelText('Search TMDB'), 'perfect');
    await fireEvent.press(
      await screen.findByLabelText(
        'Fill with Perfect Days, 2023',
        {},
        { timeout: 2000 },
      ),
    );
    expect(await screen.findByText('2023 · Drama')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('radio', { name: 'High' }));
    await fireEvent.changeText(
      screen.getByLabelText('Personal note'),
      'With Ana',
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Added to your watchlist');
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toEqual({
      title: 'Perfect Days',
      priority: 'high',
      note: 'With Ana',
      releaseYear: 2023,
      genreIds: ['genre-1'],
      synopsis: 'A toilet cleaner in Tokyo.',
      tmdbId: 976893,
      posterUrl: TMDB_PERFECT_DAYS.posterUrl,
    });
  });

  it('should need at least a title', async () => {
    await renderForm();

    await fireEvent.press(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('Enter the title')).toBeOnTheScreen();
    expect(mockApi.history.post).toHaveLength(0);
  });

  it('should warn when the movie is already on the watchlist', async () => {
    mockApi
      .onPost('/watchlist')
      .reply(...apiErrorReply(409, 'ALREADY_IN_WATCHLIST'));
    await renderForm();

    await fireEvent.changeText(screen.getByLabelText('Title'), 'Perfect Days');
    await fireEvent.press(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'This movie is already on your watchlist.',
      );
    });
  });
});

describe('When we edit a watchlist item', () => {
  it('should prefill it and send the changes, clearing what was removed', async () => {
    mockApi.onGet('/watchlist').reply(200, {
      items: [
        {
          ...A_WATCHLIST_ITEM,
          plannedFor: '2099-01-03T00:00:00.000Z',
          note: 'With Ana',
        },
      ],
      total: 1,
      page: 1,
      limit: 50,
    });
    mockApi.onPut(`/watchlist/${ITEM_ID}`).reply(200, A_WATCHLIST_ITEM);
    await renderForm(`/watchlist/${ITEM_ID}/edit`);

    expect(
      await screen.findByRole('header', { name: 'Edit item' }),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText('Personal note').props.value).toBe('With Ana');
    await fireEvent.press(screen.getByRole('button', { name: 'No date' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'Low' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Watchlist item updated');
    });
    expect(JSON.parse(mockApi.history.put[0]?.data as string)).toMatchObject({
      title: 'Perfect Days',
      priority: 'low',
      plannedFor: null,
      note: 'With Ana',
      genreIds: null,
    });
  });
});
