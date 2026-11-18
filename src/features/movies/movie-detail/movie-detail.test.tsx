import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Share, Text } from 'react-native';
import { toast } from 'sonner-native';
import { MOVIE_ID } from '@/test/constants';
import { A_MOVIE } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { MovieDetailScreen } from './movie-detail';

const FULL_MOVIE = {
  ...A_MOVIE,
  director: 'Denis Villeneuve',
  durationMinutes: 166,
  review: 'A masterpiece.',
};

async function renderDetail() {
  mockApi
    .onGet('/genres')
    .reply(200, [{ id: 'genre-1', name: 'Science Fiction' }]);
  const client = createTestQueryClient();
  await renderRouter(
    {
      index: () => null,
      'movies/[movieId]/index': () => (
        <QueryClientProvider client={client}>
          <MovieDetailScreen />
        </QueryClientProvider>
      ),
      'movies/[movieId]/edit': () => <Text>Edit movie screen</Text>,
    },
    { initialUrl: `/movies/${MOVIE_ID}` },
  );
}

describe('When we open a movie', () => {
  it('should show its information like the mockup', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, FULL_MOVIE);
    await renderDetail();

    expect(
      await screen.findByRole('header', { name: 'Duna: Parte 2' }),
    ).toBeOnTheScreen();
    expect(
      screen.getByText('2024 · 2h 46m · Denis Villeneuve'),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText('Rating 9 of 10')).toBeOnTheScreen();
    expect(screen.getByText('9.0')).toBeOnTheScreen();
    expect(await screen.findByText('Science Fiction')).toBeOnTheScreen();
    expect(
      screen.getByText('Watched 2 times · last on Oct 12, 2026'),
    ).toBeOnTheScreen();
    expect(screen.getByText('My review')).toBeOnTheScreen();
    expect(screen.getByText('A masterpiece.')).toBeOnTheScreen();
    expect(screen.getByText(A_MOVIE.synopsis)).toBeOnTheScreen();
  });

  it('should leave out what was not filled', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, A_MOVIE);
    await renderDetail();

    expect(await screen.findByText('2024')).toBeOnTheScreen();
    expect(screen.queryByText('My review')).toBeNull();
  });

  it('should tell when the movie no longer exists', async () => {
    mockApi
      .onGet(`/movies/${MOVIE_ID}`)
      .reply(...apiErrorReply(404, 'MOVIE_NOT_FOUND'));
    await renderDetail();

    expect(
      await screen.findByText('This movie no longer exists.'),
    ).toBeOnTheScreen();
  });

  it('should offer a retry when it fails to load', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(500);
    await renderDetail();

    expect(
      await screen.findByText("Couldn't load this movie."),
    ).toBeOnTheScreen();
  });
});

describe('When we act on a movie from its page', () => {
  it('should mark it as favorite', async () => {
    let isFavorite = false;
    mockApi
      .onGet(`/movies/${MOVIE_ID}`)
      .reply(() => [200, { ...A_MOVIE, isFavorite }]);
    mockApi.onPatch(`/movies/${MOVIE_ID}/favorite`).reply(() => {
      isFavorite = true;
      return [200, { ...A_MOVIE, isFavorite }];
    });
    await renderDetail();

    await fireEvent.press(
      await screen.findByRole('switch', { name: 'Favorite' }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('switch', { name: 'Favorite' }).props
          .accessibilityState,
      ).toMatchObject({ checked: true });
    });
  });

  it('should add one more watch', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, A_MOVIE);
    mockApi
      .onPost(`/movies/${MOVIE_ID}/rewatch`)
      .reply(200, { ...A_MOVIE, watchCount: 3 });
    await renderDetail();

    await fireEvent.press(
      await screen.findByRole('button', { name: 'Watched again' }),
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Added one more watch');
    });
  });

  it('should share the public review link', async () => {
    const share = jest.spyOn(Share, 'share').mockResolvedValue({
      action: Share.sharedAction,
      activityType: undefined,
    });
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, A_MOVIE);
    await renderDetail();

    await fireEvent.press(await screen.findByRole('button', { name: 'Share' }));

    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining(
          `/users/${A_MOVIE.userId}/movies/${MOVIE_ID}`,
        ) as string,
      }),
    );
    share.mockRestore();
  });

  it('should delete it from the more options menu after confirming', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, A_MOVIE);
    mockApi.onDelete(`/movies/${MOVIE_ID}`).reply(204);
    await renderDetail();

    await fireEvent.press(
      await screen.findByRole('button', { name: 'More options' }),
    );
    await fireEvent.press(
      await screen.findByRole('button', { name: 'Delete movie' }),
    );
    expect(
      await screen.findByText(
        '"Duna: Parte 2" will be removed from your movies.',
      ),
    ).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Movie deleted');
    });
    expect(mockApi.history.delete).toHaveLength(1);
  });

  it('should open the edit screen from the more options menu', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, A_MOVIE);
    await renderDetail();

    await fireEvent.press(
      await screen.findByRole('button', { name: 'More options' }),
    );
    await fireEvent.press(
      await screen.findByRole('button', { name: 'Edit movie' }),
    );

    expect(await screen.findByText('Edit movie screen')).toBeOnTheScreen();
  });
});
