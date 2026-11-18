import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { toast } from 'sonner-native';
import { pickImage } from '@/lib/pick-image';
import { ITEM_ID } from '@/test/constants';
import { A_WATCHLIST_ITEM } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { WatchlistItemFormScreen } from './watchlist-item-form';

jest.mock('@/lib/pick-image', () => ({ pickImage: jest.fn() }));

const PHOTO = {
  uri: 'file:///poster.jpg',
  name: 'poster.jpg',
  type: 'image/jpeg',
};

const TMDB_PERFECT_DAYS = {
  tmdbId: 976893,
  title: 'Perfect Days',
  originalTitle: 'Perfect Days',
  synopsis: 'A toilet cleaner in Tokyo.',
  releaseYear: 2023,
  posterUrl: 'https://image.tmdb.org/t/p/w500/pd.jpg',
  genreIds: ['genre-1'],
};

const COMPLETE_ITEM = {
  ...A_WATCHLIST_ITEM,
  releaseYear: 2023,
  genreIds: ['genre-1'],
  synopsis: 'A toilet cleaner in Tokyo.',
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

function replyWithItem(item: object) {
  mockApi.onGet('/watchlist').reply(200, {
    items: [item],
    total: 1,
    page: 1,
    limit: 50,
  });
}

async function fillMovieByHand() {
  await fireEvent.changeText(screen.getByLabelText('Title'), 'Perfect Days');
  await fireEvent.changeText(screen.getByLabelText('Release year'), '2023');
  await fireEvent.press(await screen.findByText('Drama'));
  await fireEvent.changeText(
    screen.getByLabelText('Synopsis'),
    'A toilet cleaner in Tokyo.',
  );
}

async function pickFromTmdb() {
  mockApi.onGet('/tmdb/search').reply(200, {
    items: [TMDB_PERFECT_DAYS],
    total: 1,
    page: 1,
    limit: 20,
  });
  await fireEvent.changeText(screen.getByLabelText('Search TMDB'), 'perfect');
  await fireEvent.press(
    await screen.findByLabelText(
      'Fill with Perfect Days, 2023',
      {},
      { timeout: 2000 },
    ),
  );
}

function add() {
  return fireEvent.press(screen.getByRole('button', { name: 'Add' }));
}

beforeEach(() => {
  jest.mocked(toast.success).mockClear();
  jest.mocked(pickImage).mockResolvedValue({ status: 'picked', file: PHOTO });
});

describe('When we add a movie to the watchlist', () => {
  it('should add it from TMDB with its director, runtime, priority, date and note', async () => {
    mockApi.onGet('/tmdb/movies/976893').reply(200, {
      tmdbId: 976893,
      director: 'Wim Wenders',
      durationMinutes: 124,
    });
    mockApi.onPost('/watchlist').reply(201, A_WATCHLIST_ITEM);
    await renderForm();

    await pickFromTmdb();
    expect(await screen.findByText('Wim Wenders · 124 min')).toBeOnTheScreen();
    expect(screen.getByText('2023')).toBeOnTheScreen();
    expect(screen.queryByLabelText('Title')).toBeNull();
    await fireEvent.press(screen.getByRole('radio', { name: 'High' }));
    await fireEvent.changeText(
      screen.getByLabelText('Personal note'),
      'With Ana',
    );
    await add();

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
      director: 'Wim Wenders',
      durationMinutes: 124,
      tmdbId: 976893,
      posterUrl: TMDB_PERFECT_DAYS.posterUrl,
    });
  });

  it('should ask for the same movie details as the movie log', async () => {
    await renderForm();

    await add();

    expect(await screen.findByText('Enter the title')).toBeOnTheScreen();
    expect(screen.getByText('Enter the year')).toBeOnTheScreen();
    expect(screen.getByText('Pick at least one genre')).toBeOnTheScreen();
    expect(screen.getByText('Write a synopsis')).toBeOnTheScreen();
    expect(screen.queryByText('Give it a rating')).toBeNull();
    expect(mockApi.history.post).toHaveLength(0);
  });

  it('should send the director and runtime typed by hand', async () => {
    mockApi.onPost('/watchlist').reply(201, A_WATCHLIST_ITEM);
    await renderForm();

    await fillMovieByHand();
    await fireEvent.changeText(
      screen.getByLabelText('Director'),
      'Wim Wenders',
    );
    await fireEvent.changeText(
      screen.getByLabelText('Runtime (minutes)'),
      '124',
    );
    await add();

    await waitFor(() => {
      expect(mockApi.history.post).toHaveLength(1);
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toEqual({
      title: 'Perfect Days',
      priority: 'medium',
      releaseYear: 2023,
      genreIds: ['genre-1'],
      synopsis: 'A toilet cleaner in Tokyo.',
      director: 'Wim Wenders',
      durationMinutes: 124,
    });
  });

  it('should warn when the movie is already on the watchlist', async () => {
    mockApi
      .onPost('/watchlist')
      .reply(...apiErrorReply(409, 'ALREADY_IN_WATCHLIST'));
    await renderForm();

    await fillMovieByHand();
    await add();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'This movie is already on your watchlist.',
      );
    });
  });
});

describe('When we add a movie to the watchlist with a photo as poster', () => {
  it('should add the item and then upload the photo', async () => {
    mockApi.onPost('/watchlist').reply(201, A_WATCHLIST_ITEM);
    mockApi.onPut(`/watchlist/${ITEM_ID}/poster`).reply(200, A_WATCHLIST_ITEM);
    await renderForm();

    await fillMovieByHand();
    await fireEvent.press(screen.getByRole('button', { name: 'Choose photo' }));
    expect(await screen.findByText('Photo from your phone')).toBeOnTheScreen();
    await add();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Added to your watchlist');
    });
    expect(mockApi.history.put[0]?.url).toBe(`/watchlist/${ITEM_ID}/poster`);
    expect(mockApi.history.put[0]?.data).toBeInstanceOf(FormData);
  });

  it('should send the photo instead of the TMDB poster', async () => {
    mockApi.onPost('/watchlist').reply(201, A_WATCHLIST_ITEM);
    mockApi.onPut(`/watchlist/${ITEM_ID}/poster`).reply(200, A_WATCHLIST_ITEM);
    await renderForm();

    await pickFromTmdb();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Edit movie details' }),
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Choose photo' }));
    expect(await screen.findByText('Photo from your phone')).toBeOnTheScreen();
    await add();

    await waitFor(() => {
      expect(mockApi.history.put).toHaveLength(1);
    });
    expect(
      JSON.parse(mockApi.history.post[0]?.data as string),
    ).not.toHaveProperty('posterUrl');
  });

  it('should tell when the item was added but the photo was not', async () => {
    mockApi.onPost('/watchlist').reply(201, A_WATCHLIST_ITEM);
    mockApi.onPut(`/watchlist/${ITEM_ID}/poster`).reply(500);
    await renderForm();

    await fillMovieByHand();
    await fireEvent.press(screen.getByRole('button', { name: 'Choose photo' }));
    await screen.findByText('Photo from your phone');
    await add();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Saved, but the poster was not uploaded.',
      );
    });
    expect(toast.success).not.toHaveBeenCalled();
  });
});

describe('When we edit a watchlist item', () => {
  it('should prefill it and send the changes, clearing what was removed', async () => {
    replyWithItem({
      ...COMPLETE_ITEM,
      plannedFor: '2099-01-03T00:00:00.000Z',
      note: 'With Ana',
      director: 'Wim Wenders',
    });
    mockApi.onPut(`/watchlist/${ITEM_ID}`).reply(200, COMPLETE_ITEM);
    await renderForm(`/watchlist/${ITEM_ID}/edit`);

    expect(
      await screen.findByRole('header', { name: 'Edit item' }),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText('Personal note').props.value).toBe('With Ana');
    await fireEvent.changeText(screen.getByLabelText('Director'), '');
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
      director: '',
      durationMinutes: null,
      genreIds: ['genre-1'],
    });
  });

  it('should ask for the details an older item is missing', async () => {
    replyWithItem(A_WATCHLIST_ITEM);
    await renderForm(`/watchlist/${ITEM_ID}/edit`);

    await fireEvent.press(await screen.findByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Enter the year')).toBeOnTheScreen();
    expect(screen.getByText('Write a synopsis')).toBeOnTheScreen();
    expect(mockApi.history.put).toHaveLength(0);
  });

  it('should show the current poster and upload a new photo', async () => {
    const withPoster = {
      ...COMPLETE_ITEM,
      posterUrl: 'https://cdn.example.com/posters/old.png',
    };
    replyWithItem(withPoster);
    mockApi.onPut(`/watchlist/${ITEM_ID}`).reply(200, withPoster);
    mockApi.onPut(`/watchlist/${ITEM_ID}/poster`).reply(200, withPoster);
    await renderForm(`/watchlist/${ITEM_ID}/edit`);

    expect(await screen.findByText('Current poster')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Choose photo' }));
    await screen.findByText('Photo from your phone');
    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Watchlist item updated');
    });
    expect(mockApi.history.put.map((request) => request.url)).toEqual([
      `/watchlist/${ITEM_ID}`,
      `/watchlist/${ITEM_ID}/poster`,
    ]);
  });
});
