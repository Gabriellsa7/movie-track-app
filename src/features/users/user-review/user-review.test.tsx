import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';
import { toast } from 'sonner-native';
import { useSessionStore } from '@/stores/session.store';
import { USER_ID } from '@/test/constants';
import { A_MOVIE } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { UserReviewScreen } from './user-review';

const MARINA_ID = '64b7f0c2a1b2c3d4e5f607aa';
const MARINA = {
  id: MARINA_ID,
  name: 'Marina Costa',
  memberSince: '2025-03-02T10:00:00.000Z',
  moviesCount: 214,
  averageRating: 7.9,
  favoritesCount: 41,
};
const AFTERSUN = {
  ...A_MOVIE,
  id: 'movie-2',
  userId: MARINA_ID,
  title: 'Aftersun',
  releaseYear: 2022,
  director: 'Charlotte Wells',
  durationMinutes: 102,
  rating: 9.5,
  isFavorite: true,
  watchedAt: '2026-10-03T00:00:00.000Z',
  review: 'The last scene is devastating.',
  posterUrl: 'https://res.cloudinary.com/x/posters/aftersun.png',
};

async function renderReview(userId = MARINA_ID) {
  mockApi.onGet('/genres').reply(200, [{ id: 'genre-1', name: 'Drama' }]);
  const client = createTestQueryClient();
  await renderRouter(
    {
      index: () => null,
      'users/[userId]/movies/[movieId]': () => (
        <QueryClientProvider client={client}>
          <UserReviewScreen />
        </QueryClientProvider>
      ),
      'movies/new': () => <Text>Movie form</Text>,
    },
    { initialUrl: `/users/${userId}/movies/movie-2` },
  );
}

beforeEach(() => {
  useSessionStore.setState({ userId: USER_ID });
  jest.mocked(toast.success).mockClear();
  mockApi.onGet(`/users/${MARINA_ID}`).reply(200, MARINA);
  mockApi.onGet(`/users/${MARINA_ID}/movies/movie-2`).reply(200, AFTERSUN);
});

describe('When we open someone else review', () => {
  it('should show who watched it, the movie, the rating and the review', async () => {
    await renderReview();

    expect(await screen.findByText('watched on Oct 3, 2026')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Aftersun' })).toBeOnTheScreen();
    expect(
      screen.getByText('2022 · 1h 42m · Charlotte Wells'),
    ).toBeOnTheScreen();
    expect(await screen.findByText('Drama')).toBeOnTheScreen();
    expect(screen.getByText('One of their favorites')).toBeOnTheScreen();
    expect(screen.getByText("Marina's review")).toBeOnTheScreen();
    expect(
      screen.getByText('The last scene is devastating.'),
    ).toBeOnTheScreen();
  });

  it('should add the movie to our watchlist without their poster upload', async () => {
    mockApi.onPost('/watchlist').reply(201, {});
    await renderReview();

    await fireEvent.press(
      await screen.findByRole('button', { name: 'Want to watch' }),
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Added to your watchlist');
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toEqual({
      title: 'Aftersun',
      releaseYear: 2022,
      synopsis: A_MOVIE.synopsis,
      genreIds: ['genre-1'],
      director: 'Charlotte Wells',
      durationMinutes: 102,
    });
  });

  it('should warn when the movie is already on our watchlist', async () => {
    mockApi
      .onPost('/watchlist')
      .reply(...apiErrorReply(409, 'ALREADY_IN_WATCHLIST'));
    await renderReview();

    await fireEvent.press(
      await screen.findByRole('button', { name: 'Want to watch' }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'It is already on your watchlist.',
      );
    });
  });

  it('should open the movie form when we already watched it', async () => {
    await renderReview();

    await fireEvent.press(
      await screen.findByRole('button', { name: 'Already watched' }),
    );

    expect(await screen.findByText('Movie form')).toBeOnTheScreen();
  });

  it('should not offer the watchlist on our own review', async () => {
    useSessionStore.setState({ userId: MARINA_ID });
    await renderReview();

    expect(
      await screen.findByRole('header', { name: 'Aftersun' }),
    ).toBeOnTheScreen();
    expect(screen.queryByText("Haven't seen it?")).toBeNull();
  });
});
