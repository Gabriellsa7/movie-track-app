import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { toast } from 'sonner-native';
import { pickImage } from '@/lib/pick-image';
import { toIsoDate } from '@/lib/validation/rules';
import { A_MOVIE } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { MovieFormScreen } from './movie-form';

jest.mock('@/lib/pick-image', () => ({ pickImage: jest.fn() }));

const PHOTO = {
  uri: 'file:///poster.jpg',
  name: 'poster.jpg',
  type: 'image/jpeg',
};
const TMDB_DUNE = {
  tmdbId: 693134,
  title: 'Duna: Parte Dois',
  originalTitle: 'Dune: Part Two',
  synopsis: 'Paul Atreides se une a Chani e aos Fremen.',
  releaseYear: 2024,
  posterUrl: 'https://image.tmdb.org/t/p/w500/dune.jpg',
  genreIds: ['genre-2'],
};

const GENRES = [
  { id: 'genre-1', name: 'Drama' },
  { id: 'genre-2', name: 'Science Fiction' },
];

async function renderForm() {
  mockApi.onGet('/genres').reply(200, GENRES);
  const client = createTestQueryClient();
  await renderRouter({
    index: () => (
      <QueryClientProvider client={client}>
        <MovieFormScreen />
      </QueryClientProvider>
    ),
  });
  await screen.findByText('Drama');
}

async function fillRequiredFields() {
  await fireEvent.changeText(screen.getByLabelText('Title'), ' Duna: Parte 2 ');
  await fireEvent.changeText(screen.getByLabelText('Release year'), '2024');
  await fireEvent.press(screen.getByText('Science Fiction'));
  await fireEvent.changeText(
    screen.getByLabelText('Synopsis'),
    'Paul Atreides se une aos Fremen.',
  );
  await rate(9.5);
}

function rate(rating: number) {
  const star = Math.ceil(rating);
  const isHalf = !Number.isInteger(rating);
  return fireEvent.press(screen.getByTestId(`rating-star-${String(star)}`), {
    nativeEvent: { locationX: isHalf ? 0 : 100 },
  });
}

function submit() {
  return fireEvent.press(screen.getByRole('button', { name: 'Save' }));
}

describe('When we register a movie', () => {
  it('should send only the filled fields and close the form', async () => {
    mockApi.onPost('/movies').reply(201, A_MOVIE);
    await renderForm();

    await fillRequiredFields();
    await submit();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Movie logged');
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toEqual({
      title: 'Duna: Parte 2',
      synopsis: 'Paul Atreides se une aos Fremen.',
      releaseYear: 2024,
      genreIds: ['genre-2'],
      rating: 9.5,
      watchedAt: toIsoDate(new Date()),
      watchCount: 1,
      isFavorite: false,
    });
  });

  it('should show the required fields and not call the API', async () => {
    await renderForm();

    await submit();

    expect(await screen.findByText('Enter the title')).toBeOnTheScreen();
    expect(screen.getByText('Enter the year')).toBeOnTheScreen();
    expect(screen.getByText('Pick at least one genre')).toBeOnTheScreen();
    expect(screen.getByText('Write a synopsis')).toBeOnTheScreen();
    expect(screen.getByText('Give it a rating')).toBeOnTheScreen();
    expect(mockApi.history.post).toHaveLength(0);
  });

  it('should send the optional fields when filled', async () => {
    mockApi.onPost('/movies').reply(201, A_MOVIE);
    await renderForm();

    await fillRequiredFields();
    await fireEvent.changeText(
      screen.getByLabelText('Director'),
      'Denis Villeneuve',
    );
    await fireEvent.changeText(
      screen.getByLabelText('Runtime (minutes)'),
      '166',
    );
    await fireEvent(screen.getByLabelText('Favorite'), 'valueChange', true);
    await submit();

    await waitFor(() => {
      expect(mockApi.history.post).toHaveLength(1);
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toMatchObject({
      director: 'Denis Villeneuve',
      durationMinutes: 166,
      isFavorite: true,
    });
  });

  it('should show under the title a movie that was already registered', async () => {
    mockApi
      .onPost('/movies')
      .reply(...apiErrorReply(409, 'MOVIE_ALREADY_LOGGED'));
    await renderForm();

    await fillRequiredFields();
    await submit();

    expect(
      await screen.findByText("You've already logged this movie"),
    ).toBeOnTheScreen();
  });

  it('should warn in a toast when the server cannot be reached', async () => {
    mockApi.onPost('/movies').networkError();
    await renderForm();

    await fillRequiredFields();
    await submit();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Can't reach the server. Check your connection and try again.",
      );
    });
  });

  it('should let the user pick up to five genres', async () => {
    mockApi.onGet('/genres').reply(
      200,
      Array.from({ length: 6 }, (_, index) => ({
        id: `genre-${String(index)}`,
        name: `Genre ${String(index)}`,
      })),
    );
    const client = createTestQueryClient();
    await renderRouter({
      index: () => (
        <QueryClientProvider client={client}>
          <MovieFormScreen />
        </QueryClientProvider>
      ),
    });

    for (const index of [0, 1, 2, 3, 4]) {
      await fireEvent.press(await screen.findByText(`Genre ${String(index)}`));
    }

    expect(
      screen.getByRole('checkbox', { name: 'Genre 5' }).props
        .accessibilityState,
    ).toMatchObject({ checked: false, disabled: true });
  });
});

describe('When we fill the form from TMDB', () => {
  async function pickFromTmdb() {
    mockApi.onGet('/tmdb/search').reply(200, {
      items: [TMDB_DUNE],
      total: 1,
      page: 1,
      limit: 20,
    });
    await fireEvent.changeText(screen.getByLabelText('Search TMDB'), 'duna');
    await fireEvent.press(
      await screen.findByLabelText(
        'Fill with Duna: Parte Dois, 2024',
        {},
        {
          timeout: 2000,
        },
      ),
    );
  }

  it('should fill the movie and send the TMDB poster as a link', async () => {
    mockApi.onPost('/movies').reply(201, A_MOVIE);
    mockApi.onGet('/tmdb/movies/693134').reply(200, {
      tmdbId: 693134,
      director: 'Denis Villeneuve',
      durationMinutes: 166,
    });
    await renderForm();

    await pickFromTmdb();
    expect(
      await screen.findByText('Denis Villeneuve · 166 min'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Duna: Parte Dois')).toBeOnTheScreen();
    expect(screen.getByText('Science Fiction')).toBeOnTheScreen();
    expect(screen.queryByLabelText('Title')).toBeNull();
    await rate(9);
    await submit();

    await waitFor(() => {
      expect(mockApi.history.post).toHaveLength(1);
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toMatchObject({
      title: 'Duna: Parte Dois',
      releaseYear: 2024,
      synopsis: TMDB_DUNE.synopsis,
      genreIds: ['genre-2'],
      director: 'Denis Villeneuve',
      durationMinutes: 166,
      tmdbId: 693134,
      posterUrl: TMDB_DUNE.posterUrl,
    });
    expect(mockApi.history.put).toHaveLength(0);
  });

  it('should prefer the photo from the phone over the TMDB poster', async () => {
    jest.mocked(pickImage).mockResolvedValue({ status: 'picked', file: PHOTO });
    mockApi.onPost('/movies').reply(201, A_MOVIE);
    mockApi.onPut(`/movies/${A_MOVIE.id}/poster`).reply(200, A_MOVIE);
    await renderForm();

    await pickFromTmdb();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Edit movie details' }),
    );
    expect(screen.getByLabelText('Title').props.value).toBe('Duna: Parte Dois');
    await fireEvent.press(screen.getByRole('button', { name: 'Choose photo' }));
    expect(await screen.findByText('Photo from your phone')).toBeOnTheScreen();
    await rate(9);
    await submit();

    await waitFor(() => {
      expect(mockApi.history.put).toHaveLength(1);
    });
    expect(
      JSON.parse(mockApi.history.post[0]?.data as string),
    ).not.toHaveProperty('posterUrl');
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Movie logged');
    });
  });

  it('should tell when the movie was saved but the photo was not', async () => {
    jest.mocked(pickImage).mockResolvedValue({ status: 'picked', file: PHOTO });
    mockApi.onPost('/movies').reply(201, A_MOVIE);
    mockApi
      .onPut(`/movies/${A_MOVIE.id}/poster`)
      .reply(...apiErrorReply(503, 'STORAGE_UNAVAILABLE'));
    await renderForm();

    await fillRequiredFields();
    await fireEvent.press(screen.getByRole('button', { name: 'Choose photo' }));
    await screen.findByText('Photo from your phone');
    await submit();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Movie logged, but the poster was not uploaded.',
      );
    });
  });

  it('should remove the poster and reject an invalid image', async () => {
    jest
      .mocked(pickImage)
      .mockResolvedValueOnce({ status: 'picked', file: PHOTO })
      .mockResolvedValueOnce({
        status: 'invalid',
        message: 'The image can be up to 5 MB',
      });
    await renderForm();

    await fireEvent.press(screen.getByRole('button', { name: 'Choose photo' }));
    await fireEvent.press(
      await screen.findByRole('button', { name: 'Remove poster' }),
    );
    expect(
      screen.getByText('Optional · JPEG, PNG or WebP up to 5 MB'),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Choose photo' }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('The image can be up to 5 MB');
    });
  });

  it('should keep the form usable when TMDB is unavailable', async () => {
    mockApi
      .onGet('/tmdb/search')
      .reply(...apiErrorReply(503, 'MOVIE_CATALOG_UNAVAILABLE'));
    await renderForm();

    await fireEvent.changeText(screen.getByLabelText('Search TMDB'), 'duna');

    expect(
      await screen.findByText(
        'Search is unavailable right now. Fill in the fields below.',
        {},
        { timeout: 2000 },
      ),
    ).toBeOnTheScreen();
  });
});

describe('When we rate a movie and say how many times', () => {
  it('should take half points, accessibility steps and the watch count', async () => {
    mockApi.onPost('/movies').reply(201, A_MOVIE);
    await renderForm();

    await fillRequiredFields();
    await fireEvent(
      screen.getByRole('adjustable', { name: 'Your rating' }),
      'accessibilityAction',
      { nativeEvent: { actionName: 'decrement' } },
    );
    expect(screen.getByText('9')).toBeOnTheScreen();
    await fireEvent.changeText(screen.getByLabelText('Times'), '3');
    await submit();

    await waitFor(() => {
      expect(mockApi.history.post).toHaveLength(1);
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toMatchObject({
      rating: 9,
      watchCount: 3,
    });
  });
});
