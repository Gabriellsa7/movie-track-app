import { QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { A_MOVIE } from '@/test/fixtures';
import { mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { MoviesScreen } from './movies';

const PAGE = { page: 1, limit: 20 };

async function renderMovies() {
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
    expect(mockApi.history.get[0]?.params).toEqual({
      sort: 'watchedAt',
      order: 'desc',
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
      expect(mockApi.history.get.at(-1)?.params).toEqual({
        sort: 'watchedAt',
        order: 'desc',
        search: 'xyz',
      });
    });
  });
});
