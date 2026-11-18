import { QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { A_MOVIE } from '@/test/fixtures';
import { mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { MoviesScreen } from './movies';

const PAGE = { page: 1, limit: 20 };
const GENRES = [{ id: 'genre-1', name: 'Drama' }];

function lastMoviesParams(): unknown {
  return mockApi.history.get
    .filter((request) => request.url === '/movies')
    .at(-1)?.params;
}

function lastMoviesFilters(): unknown {
  const { page, limit, ...filters } = lastMoviesParams() as Record<
    string,
    unknown
  >;
  return filters;
}

async function renderMovies() {
  mockApi.onGet('/genres').reply(200, GENRES);
  const client = createTestQueryClient();
  await renderRouter({
    index: () => (
      <QueryClientProvider client={client}>
        <MoviesScreen />
      </QueryClientProvider>
    ),
  });
}

describe('When we open my movies', () => {
  it('should show the total and the movies, latest watched first', async () => {
    mockApi
      .onGet('/movies')
      .reply(200, { ...PAGE, total: 1, items: [A_MOVIE] });
    await renderMovies();

    expect(await screen.findByText('1 movie')).toBeOnTheScreen();
    expect(
      screen.getByLabelText('Duna: Parte 2, 2024, rating 9'),
    ).toBeOnTheScreen();
    expect(lastMoviesParams()).toEqual({
      sort: 'watchedAt',
      order: 'desc',
      page: 1,
      limit: 20,
    });
  });

  it('should tell when there is no movie yet', async () => {
    mockApi.onGet('/movies').reply(200, { ...PAGE, total: 0, items: [] });
    await renderMovies();

    expect(await screen.findByText('0 movies')).toBeOnTheScreen();
    expect(screen.getByText('No movies logged yet')).toBeOnTheScreen();
  });

  it('should offer a retry when the list fails', async () => {
    mockApi.onGet('/movies').replyOnce(500);
    await renderMovies();

    expect(
      await screen.findByText("Couldn't load your movies."),
    ).toBeOnTheScreen();
  });
});

describe('When we search my movies', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should send the search once the user stops typing', async () => {
    mockApi.onGet('/movies').reply((config) => {
      const search = (config.params as { search?: string }).search;
      return [
        200,
        search
          ? { ...PAGE, total: 0, items: [] }
          : { ...PAGE, total: 1, items: [A_MOVIE] },
      ];
    });
    await renderMovies();
    expect(await screen.findByText('1 movie')).toBeOnTheScreen();

    await fireEvent.changeText(screen.getByLabelText('Search movies'), ' xyz ');
    await act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(
      await screen.findByText('No movies found for “xyz”'),
    ).toBeOnTheScreen();
    await waitFor(() => {
      expect(lastMoviesFilters()).toEqual({
        sort: 'watchedAt',
        order: 'desc',
        search: 'xyz',
      });
    });
  });
});

describe('When we filter my movies', () => {
  it('should send the favorite, genre and sort chosen in the chips', async () => {
    mockApi
      .onGet('/movies')
      .reply(200, { ...PAGE, total: 1, items: [A_MOVIE] });
    await renderMovies();
    await screen.findByText('1 movie');

    await fireEvent.press(screen.getByRole('switch', { name: 'Favorites' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Genre' }));
    await fireEvent.press(await screen.findByRole('radio', { name: 'Drama' }));
    await fireEvent.press(
      screen.getByRole('button', { name: 'Latest watched' }),
    );
    await fireEvent.press(
      await screen.findByRole('radio', { name: 'Highest rating' }),
    );

    await waitFor(() => {
      expect(lastMoviesFilters()).toEqual({
        sort: 'rating',
        order: 'desc',
        favorite: true,
        genreId: 'genre-1',
      });
    });
  });

  it('should say when no movie matches the filters', async () => {
    mockApi
      .onGet('/movies')
      .reply((config) =>
        (config.params as { favorite?: boolean }).favorite
          ? [200, { ...PAGE, total: 0, items: [] }]
          : [200, { ...PAGE, total: 1, items: [A_MOVIE] }],
      );
    await renderMovies();
    await screen.findByText('1 movie');

    await fireEvent.press(screen.getByRole('switch', { name: 'Favorites' }));

    expect(
      await screen.findByText('No movies match these filters'),
    ).toBeOnTheScreen();
  });
});
