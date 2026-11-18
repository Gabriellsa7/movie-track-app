import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Alert, type AlertButton } from 'react-native';
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
    },
    { initialUrl: `/movies/${MOVIE_ID}` },
  );
}

describe('When we open a movie', () => {
  it('should show its information', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, FULL_MOVIE);
    await renderDetail();

    expect(
      await screen.findByRole('header', { name: 'Duna: Parte 2' }),
    ).toBeOnTheScreen();
    expect(screen.getByText('2024 · 2h 46m')).toBeOnTheScreen();
    expect(screen.getByText('Directed by Denis Villeneuve')).toBeOnTheScreen();
    expect(screen.getByLabelText('Rating 9 of 10')).toBeOnTheScreen();
    expect(await screen.findByText('Science Fiction')).toBeOnTheScreen();
    expect(screen.getByText('Oct 12, 2026')).toBeOnTheScreen();
    expect(screen.getByText('2 times')).toBeOnTheScreen();
    expect(screen.getByText(A_MOVIE.synopsis)).toBeOnTheScreen();
    expect(screen.getByText('A masterpiece.')).toBeOnTheScreen();
  });

  it('should leave out what was not filled', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, A_MOVIE);
    await renderDetail();

    expect(await screen.findByText('2024')).toBeOnTheScreen();
    expect(screen.queryByText(/Directed by/)).toBeNull();
    expect(screen.queryByText('Your review')).toBeNull();
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

describe('When we change a movie from its page', () => {
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
    expect(JSON.parse(mockApi.history.patch[0]?.data as string)).toEqual({
      isFavorite: true,
    });
  });

  it('should delete it after confirming', async () => {
    const alert = jest.spyOn(Alert, 'alert');
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, A_MOVIE);
    mockApi.onDelete(`/movies/${MOVIE_ID}`).reply(204);
    await renderDetail();

    await fireEvent.press(
      await screen.findByRole('button', { name: 'Delete movie' }),
    );
    const buttons = alert.mock.calls[0]?.[2] as AlertButton[];
    buttons.find((button) => button.style === 'destructive')?.onPress?.();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Movie deleted');
    });
    expect(mockApi.history.delete).toHaveLength(1);
    alert.mockRestore();
  });
});
