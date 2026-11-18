import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';
import type { IUserStats } from '@/api/types';
import { MoviesPerMonth } from '@/features/home/components/movies-per-month/movies-per-month';
import { StatsOverview } from '@/features/home/components/stats-overview/stats-overview';
import { useSessionStore } from '@/stores/session.store';
import { USER_ID } from '@/test/constants';
import { A_USER } from '@/test/fixtures';
import { mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { StatsScreen } from './stats';

const thisMonth = (() => {
  const today = new Date();
  return `${String(today.getFullYear())}-${String(today.getMonth() + 1).padStart(2, '0')}`;
})();

const STATS: IUserStats = {
  totalMovies: 10,
  averageRating: 7.6,
  favoritesCount: 3,
  totalWatches: 14,
  totalMinutes: 1_500,
  ratingDistribution: [
    { rating: 7, count: 2 },
    { rating: 8.5, count: 5 },
    { rating: 10, count: 3 },
  ],
  moviesPerMonth: [{ month: thisMonth, count: 4 }],
  topGenres: [
    { genreId: 'g1', name: 'Drama', count: 6 },
    { genreId: 'g2', name: 'Science Fiction', count: 3 },
  ],
};

async function renderStats(stats: IUserStats | number) {
  useSessionStore.getState().setUser(A_USER);
  if (typeof stats === 'number') {
    mockApi.onGet(`/users/${USER_ID}/stats`).reply(stats);
  } else {
    mockApi.onGet(`/users/${USER_ID}/stats`).reply(200, stats);
  }
  const client = createTestQueryClient();
  await renderRouter({
    index: () => (
      <QueryClientProvider client={client}>
        <StatsScreen />
      </QueryClientProvider>
    ),
  });
}

describe('When we open the dashboard', () => {
  it('should explain each number', async () => {
    await renderStats(STATS);

    expect(
      await screen.findByLabelText(
        'Movies logged: 10. Different movies in your log.',
      ),
    ).toBeOnTheScreen();
    expect(
      screen.getByLabelText('Times watched: 14. Counting 4 rewatches.'),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText(/^Hours watched: 25h\./)).toBeOnTheScreen();
    expect(screen.getByLabelText(/^Average rating: 7\.6\./)).toBeOnTheScreen();
    expect(
      screen.getByLabelText('Favorites: 3. 30% of your movies.'),
    ).toBeOnTheScreen();
    expect(
      screen.getByLabelText('Most given rating: 8.5. Given to 5 movies.'),
    ).toBeOnTheScreen();
  });

  it('should show the months, the ratings and the top genres', async () => {
    await renderStats(STATS);

    expect(await screen.findByText('Movies per month')).toBeOnTheScreen();
    expect(screen.getByText('Best month')).toBeOnTheScreen();
    expect(screen.getByLabelText('Rating 8.5: 5 movies')).toBeOnTheScreen();
    expect(
      screen.getByLabelText('1. Drama: 6 movies, 60% of your movies'),
    ).toBeOnTheScreen();
  });

  it('should invite to log a movie when there is nothing yet', async () => {
    await renderStats({
      ...STATS,
      totalMovies: 0,
      totalWatches: 0,
      averageRating: null,
      ratingDistribution: [],
      moviesPerMonth: [],
      topGenres: [],
    });

    expect(await screen.findByText('Nothing to measure yet')).toBeOnTheScreen();
  });

  it('should offer a retry when the stats fail', async () => {
    await renderStats(500);

    expect(
      await screen.findByText("Couldn't load your stats."),
    ).toBeOnTheScreen();
  });
});

describe('When we tap the stats on the home', () => {
  it('should open the dashboard', async () => {
    await renderRouter(
      {
        index: () => (
          <StatsOverview stats={STATS} isError={false} onRetry={jest.fn()} />
        ),
        stats: () => <Text>Dashboard screen</Text>,
      },
      { initialUrl: '/' },
    );

    await fireEvent.press(
      screen.getByRole('link', { name: 'Open your dashboard' }),
    );

    expect(await screen.findByText('Dashboard screen')).toBeOnTheScreen();
  });

  it('should open the dashboard from the movies per month chart', async () => {
    await renderRouter(
      {
        index: () => <MoviesPerMonth stats={STATS} />,
        stats: () => <Text>Dashboard screen</Text>,
      },
      { initialUrl: '/' },
    );

    await fireEvent.press(
      screen.getByRole('link', { name: /^Movies per month/ }),
    );

    expect(await screen.findByText('Dashboard screen')).toBeOnTheScreen();
  });
});
