import { QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import type { TUserStats } from '@/api/types';
import { useSessionStore } from '@/stores/session.store';
import { USER_ID } from '@/test/constants';
import { A_MOVIE, A_USER, A_WATCHLIST_ITEM } from '@/test/fixtures';
import { mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { HomeScreen } from './home';

const STATS: TUserStats = {
  totalMovies: 128,
  averageRating: 7.6,
  favoritesCount: 23,
  totalWatches: 140,
  totalMinutes: 14_760,
  ratingDistribution: [],
  moviesPerMonth: [],
  topGenres: [],
};

const PAGE = { total: 1, page: 1, limit: 6 };

function replyWith({
  movies = [A_MOVIE],
  watchlist = [{ ...A_WATCHLIST_ITEM, plannedFor: '2099-01-05T00:00:00.000Z' }],
} = {}) {
  mockApi.onGet(`/users/${USER_ID}/stats`).reply(200, STATS);
  mockApi.onGet('/movies').reply(200, { ...PAGE, items: movies });
  mockApi.onGet('/watchlist').reply(200, { ...PAGE, items: watchlist });
}

async function renderHome() {
  useSessionStore.getState().setUser(A_USER);
  const client = createTestQueryClient();
  await renderRouter({
    index: () => (
      <QueryClientProvider client={client}>
        <HomeScreen />
      </QueryClientProvider>
    ),
  });
}

describe('When we open the home screen', () => {
  it('should show the stats, the next movie and the latest movies', async () => {
    replyWith();
    await renderHome();

    expect(await screen.findByLabelText('Filmes: 128')).toBeOnTheScreen();
    expect(screen.getByLabelText('Nota média: 7.6')).toBeOnTheScreen();
    expect(screen.getByLabelText('Favoritos: 23')).toBeOnTheScreen();
    expect(screen.getByLabelText('Horas: 246h')).toBeOnTheScreen();
    expect(await screen.findByText('Perfect Days')).toBeOnTheScreen();
    expect(
      screen.getByText('5 jan · Prioridade média', { exact: false }),
    ).toBeOnTheScreen();
    expect(
      await screen.findByLabelText('Duna: Parte 2, nota 9'),
    ).toBeOnTheScreen();
    expect(
      screen.getByText(/^(Bom dia|Boa tarde|Boa noite), Gabriel$/),
    ).toBeOnTheScreen();
  });

  it('should ask for the next movie and the latest six movies', async () => {
    replyWith();
    await renderHome();
    await screen.findByText('Perfect Days');

    const params = (url: string): unknown =>
      mockApi.history.get.find((request) => request.url === url)?.params;
    expect(params('/watchlist')).toEqual({
      planned: true,
      sort: 'plannedFor',
      limit: 1,
    });
    expect(params('/movies')).toEqual({
      sort: 'watchedAt',
      order: 'desc',
      limit: 6,
    });
  });

  it('should show the empty states for a new account', async () => {
    replyWith({ movies: [], watchlist: [] });
    await renderHome();

    expect(
      await screen.findByText('Nenhum filme registrado ainda'),
    ).toBeOnTheScreen();
    expect(
      await screen.findByText('Nenhum filme com data marcada'),
    ).toBeOnTheScreen();
  });

  it('should let the user retry a section that failed', async () => {
    mockApi.onGet(`/users/${USER_ID}/stats`).reply(200, STATS);
    mockApi.onGet('/watchlist').reply(200, { ...PAGE, items: [] });
    mockApi.onGet('/movies').replyOnce(500);
    mockApi.onGet('/movies').reply(200, { ...PAGE, items: [A_MOVIE] });
    await renderHome();

    expect(
      await screen.findByText('Não foi possível carregar seus filmes.'),
    ).toBeOnTheScreen();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Tentar de novo' }),
    );

    expect(
      await screen.findByLabelText('Duna: Parte 2, nota 9'),
    ).toBeOnTheScreen();
  });

  it('should ask everything again when pulled to refresh', async () => {
    replyWith();
    await renderHome();
    await screen.findByText('Perfect Days');
    const requestsBefore = mockApi.history.get.length;

    const { refreshControl } = screen.getByTestId('home-scroll').props as {
      refreshControl: { props: { onRefresh: () => void } };
    };
    await act(() => {
      refreshControl.props.onRefresh();
    });

    await waitFor(() => {
      expect(mockApi.history.get.length).toBe(requestsBefore + 3);
    });
  });

  it('should show an error when the stats fail', async () => {
    replyWith();
    mockApi.onGet(`/users/${USER_ID}/stats`).reply(500);
    await renderHome();

    expect(
      await screen.findByText('Não foi possível carregar suas estatísticas.'),
    ).toBeOnTheScreen();
  });
});
