import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { toast } from 'sonner-native';
import { pickImage } from '@/lib/pick-image';
import { MOVIE_ID } from '@/test/constants';
import { A_MOVIE } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { MovieEditScreen } from './movie-edit';

jest.mock('@/lib/pick-image', () => ({ pickImage: jest.fn() }));

const LOGGED_MOVIE = {
  ...A_MOVIE,
  director: 'Denis Villeneuve',
  durationMinutes: 166,
  review: 'A masterpiece.',
  isFavorite: true,
  posterUrl: 'https://cdn.example.com/posters/dune.png',
};

async function renderEdit() {
  mockApi.onGet('/genres').reply(200, [
    { id: 'genre-1', name: 'Science Fiction' },
    { id: 'genre-2', name: 'Drama' },
  ]);
  const client = createTestQueryClient();
  await renderRouter(
    {
      index: () => null,
      'movies/[movieId]/edit': () => (
        <QueryClientProvider client={client}>
          <MovieEditScreen />
        </QueryClientProvider>
      ),
    },
    { initialUrl: `/movies/${MOVIE_ID}/edit` },
  );
}

function save() {
  return fireEvent.press(screen.getByRole('button', { name: 'Save' }));
}

beforeEach(() => {
  jest.mocked(toast.success).mockClear();
});

describe('When we edit a movie we watched', () => {
  it('should prefill it and send every field back with the changes', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, LOGGED_MOVIE);
    mockApi.onPut(`/movies/${MOVIE_ID}`).reply(200, LOGGED_MOVIE);
    await renderEdit();

    expect(
      await screen.findByRole('header', { name: 'Edit movie' }),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText('Title').props.value).toBe('Duna: Parte 2');
    expect(screen.getByLabelText('Your review').props.value).toBe(
      'A masterpiece.',
    );
    expect(screen.getByText('Current poster')).toBeOnTheScreen();
    await fireEvent.changeText(screen.getByLabelText('Your review'), '');
    await fireEvent.changeText(screen.getByLabelText('Runtime (minutes)'), '');
    await fireEvent.press(await screen.findByText('Drama'));
    await save();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Movie updated');
    });
    expect(JSON.parse(mockApi.history.put[0]?.data as string)).toEqual({
      title: 'Duna: Parte 2',
      synopsis: 'Paul Atreides se une aos Fremen.',
      releaseYear: 2024,
      genreIds: ['genre-1', 'genre-2'],
      rating: 9,
      watchedAt: '2026-10-12',
      director: 'Denis Villeneuve',
      durationMinutes: null,
      watchCount: 2,
      review: '',
      isFavorite: true,
      posterUrl: LOGGED_MOVIE.posterUrl,
    });
  });

  it('should replace the poster with a new photo', async () => {
    jest.mocked(pickImage).mockResolvedValue({
      status: 'picked',
      file: { uri: 'file:///new.jpg', name: 'new.jpg', type: 'image/jpeg' },
    });
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, LOGGED_MOVIE);
    mockApi.onPut(`/movies/${MOVIE_ID}`).reply(200, LOGGED_MOVIE);
    mockApi.onPut(`/movies/${MOVIE_ID}/poster`).reply(200, LOGGED_MOVIE);
    await renderEdit();

    await fireEvent.press(
      await screen.findByRole('button', { name: 'Remove poster' }),
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Choose photo' }));
    await screen.findByText('Photo from your phone');
    await save();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Movie updated');
    });
    expect(
      JSON.parse(mockApi.history.put[0]?.data as string),
    ).not.toHaveProperty('posterUrl');
    expect(mockApi.history.put[1]?.url).toBe(`/movies/${MOVIE_ID}/poster`);
  });

  it('should remove the poster', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, LOGGED_MOVIE);
    mockApi.onPut(`/movies/${MOVIE_ID}`).reply(200, A_MOVIE);
    await renderEdit();

    await fireEvent.press(
      await screen.findByRole('button', { name: 'Remove poster' }),
    );
    await save();

    await waitFor(() => {
      expect(mockApi.history.put).toHaveLength(1);
    });
    expect(JSON.parse(mockApi.history.put[0]?.data as string)).toMatchObject({
      posterUrl: null,
    });
  });

  it('should keep the required movie fields', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, LOGGED_MOVIE);
    await renderEdit();

    await fireEvent.changeText(await screen.findByLabelText('Synopsis'), '');
    await save();

    expect(await screen.findByText('Write a synopsis')).toBeOnTheScreen();
    expect(mockApi.history.put).toHaveLength(0);
  });

  it('should warn when the changes turn it into a movie already logged', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, LOGGED_MOVIE);
    mockApi
      .onPut(`/movies/${MOVIE_ID}`)
      .reply(...apiErrorReply(409, 'MOVIE_ALREADY_LOGGED'));
    await renderEdit();

    await screen.findByLabelText('Title');
    await save();

    expect(
      await screen.findByText("You've already logged this movie"),
    ).toBeOnTheScreen();
  });

  it('should say when the movie no longer exists', async () => {
    mockApi
      .onGet(`/movies/${MOVIE_ID}`)
      .reply(...apiErrorReply(404, 'MOVIE_NOT_FOUND'));
    await renderEdit();

    expect(
      await screen.findByText('This movie no longer exists.'),
    ).toBeOnTheScreen();
  });
});
