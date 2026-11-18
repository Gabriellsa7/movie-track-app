import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';
import { A_MOVIE } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { UserProfileScreen } from './user-profile';

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
  rating: 9.5,
  review: 'The last scene is devastating.',
};

async function renderProfile() {
  const client = createTestQueryClient();
  await renderRouter(
    {
      index: () => null,
      'users/[userId]/index': () => (
        <QueryClientProvider client={client}>
          <UserProfileScreen />
        </QueryClientProvider>
      ),
      'users/[userId]/movies/[movieId]': () => <Text>Review screen</Text>,
    },
    { initialUrl: `/users/${MARINA_ID}` },
  );
}

describe('When we open a profile', () => {
  it('should show the person, their numbers and their reviews', async () => {
    mockApi.onGet(`/users/${MARINA_ID}`).reply(200, MARINA);
    mockApi
      .onGet(`/users/${MARINA_ID}/movies`)
      .reply(200, { items: [AFTERSUN], total: 1, page: 1, limit: 50 });
    await renderProfile();

    expect(
      await screen.findByRole('header', { name: 'Marina Costa' }),
    ).toBeOnTheScreen();
    expect(screen.getByText('Member since March 2025')).toBeOnTheScreen();
    expect(screen.getByLabelText('214 movies')).toBeOnTheScreen();
    expect(screen.getByLabelText('7.9 average rating')).toBeOnTheScreen();
    expect(screen.getByLabelText('41 favorites')).toBeOnTheScreen();
    expect(await screen.findByText('Aftersun')).toBeOnTheScreen();
    expect(
      screen.getByText('The last scene is devastating.'),
    ).toBeOnTheScreen();
    expect(mockApi.history.get.at(-1)?.params).toMatchObject({
      sort: 'rating',
      order: 'desc',
    });
  });

  it('should sort the movies and open a review', async () => {
    mockApi.onGet(`/users/${MARINA_ID}`).reply(200, MARINA);
    mockApi
      .onGet(`/users/${MARINA_ID}/movies`)
      .reply(200, { items: [AFTERSUN], total: 1, page: 1, limit: 50 });
    await renderProfile();

    await fireEvent.press(
      await screen.findByRole('button', { name: 'Highest rating' }),
    );
    await fireEvent.press(await screen.findByText('Latest watched'));
    await waitFor(() => {
      expect(mockApi.history.get.at(-1)?.params).toMatchObject({
        sort: 'watchedAt',
      });
    });

    await fireEvent.press(
      await screen.findByRole('link', { name: 'Aftersun, rating 9.5' }),
    );
    expect(await screen.findByText('Review screen')).toBeOnTheScreen();
  });

  it('should say when the person no longer exists', async () => {
    mockApi
      .onGet(`/users/${MARINA_ID}`)
      .reply(...apiErrorReply(404, 'USER_NOT_FOUND'));
    mockApi.onGet(`/users/${MARINA_ID}/movies`).reply(404);
    await renderProfile();

    expect(
      await screen.findByText('This user no longer exists.'),
    ).toBeOnTheScreen();
  });
});
