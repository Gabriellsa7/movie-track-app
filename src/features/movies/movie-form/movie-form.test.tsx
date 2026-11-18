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
  { id: 'genre-2', name: 'Ficção científica' },
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
  await fireEvent.changeText(
    screen.getByLabelText('Título'),
    ' Duna: Parte 2 ',
  );
  await fireEvent.changeText(
    screen.getByLabelText('Ano de lançamento'),
    '2024',
  );
  await fireEvent.press(screen.getByText('Ficção científica'));
  await fireEvent.changeText(
    screen.getByLabelText('Sinopse'),
    'Paul Atreides se une aos Fremen.',
  );
  await fireEvent.press(screen.getByLabelText('Nota 9,5'));
}

function submit() {
  return fireEvent.press(
    screen.getByRole('button', { name: 'Registrar filme' }),
  );
}

describe('When we register a movie', () => {
  it('should send only the filled fields and close the form', async () => {
    mockApi.onPost('/movies').reply(201, A_MOVIE);
    await renderForm();

    await fillRequiredFields();
    await submit();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Filme registrado');
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toEqual({
      title: 'Duna: Parte 2',
      synopsis: 'Paul Atreides se une aos Fremen.',
      releaseYear: 2024,
      genreIds: ['genre-2'],
      rating: 9.5,
      watchedAt: toIsoDate(new Date()),
      isFavorite: false,
    });
  });

  it('should show the required fields and not call the API', async () => {
    await renderForm();

    await submit();

    expect(await screen.findByText('Informe o título')).toBeOnTheScreen();
    expect(screen.getByText('Informe o ano')).toBeOnTheScreen();
    expect(screen.getByText('Escolha pelo menos um gênero')).toBeOnTheScreen();
    expect(screen.getByText('Escreva uma sinopse')).toBeOnTheScreen();
    expect(screen.getByText('Dê uma nota')).toBeOnTheScreen();
    expect(mockApi.history.post).toHaveLength(0);
  });

  it('should send the optional fields when filled', async () => {
    mockApi.onPost('/movies').reply(201, A_MOVIE);
    await renderForm();

    await fillRequiredFields();
    await fireEvent.changeText(
      screen.getByLabelText('Direção'),
      'Denis Villeneuve',
    );
    await fireEvent.changeText(
      screen.getByLabelText('Duração (minutos)'),
      '166',
    );
    await fireEvent(screen.getByLabelText('Favorito'), 'valueChange', true);
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
      await screen.findByText('Você já registrou esse filme'),
    ).toBeOnTheScreen();
  });

  it('should warn in a toast when the server cannot be reached', async () => {
    mockApi.onPost('/movies').networkError();
    await renderForm();

    await fillRequiredFields();
    await submit();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Sem conexão com o servidor. Verifique sua internet e tente de novo.',
      );
    });
  });

  it('should let the user pick up to five genres', async () => {
    mockApi.onGet('/genres').reply(
      200,
      Array.from({ length: 6 }, (_, index) => ({
        id: `genre-${String(index)}`,
        name: `Gênero ${String(index)}`,
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
      await fireEvent.press(await screen.findByText(`Gênero ${String(index)}`));
    }

    expect(
      screen.getByRole('checkbox', { name: 'Gênero 5' }).props
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
    await fireEvent.changeText(screen.getByLabelText('Buscar no TMDB'), 'duna');
    await fireEvent.press(
      await screen.findByLabelText(
        'Preencher com Duna: Parte Dois, 2024',
        {},
        {
          timeout: 2000,
        },
      ),
    );
  }

  it('should fill the movie and send the TMDB poster as a link', async () => {
    mockApi.onPost('/movies').reply(201, A_MOVIE);
    await renderForm();

    await pickFromTmdb();
    expect(screen.getByLabelText('Título').props.value).toBe(
      'Duna: Parte Dois',
    );
    await fireEvent.press(screen.getByLabelText('Nota 9'));
    await submit();

    await waitFor(() => {
      expect(mockApi.history.post).toHaveLength(1);
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toMatchObject({
      title: 'Duna: Parte Dois',
      releaseYear: 2024,
      synopsis: TMDB_DUNE.synopsis,
      genreIds: ['genre-2'],
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
      screen.getByRole('button', { name: 'Escolher foto' }),
    );
    expect(await screen.findByText('Foto do celular')).toBeOnTheScreen();
    await fireEvent.press(screen.getByLabelText('Nota 9'));
    await submit();

    await waitFor(() => {
      expect(mockApi.history.put).toHaveLength(1);
    });
    expect(
      JSON.parse(mockApi.history.post[0]?.data as string),
    ).not.toHaveProperty('posterUrl');
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Filme registrado');
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
    await fireEvent.press(
      screen.getByRole('button', { name: 'Escolher foto' }),
    );
    await screen.findByText('Foto do celular');
    await submit();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Filme registrado, mas a capa não foi enviada.',
      );
    });
  });

  it('should remove the poster and reject an invalid image', async () => {
    jest
      .mocked(pickImage)
      .mockResolvedValueOnce({ status: 'picked', file: PHOTO })
      .mockResolvedValueOnce({
        status: 'invalid',
        message: 'A imagem pode ter até 5 MB',
      });
    await renderForm();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Escolher foto' }),
    );
    await fireEvent.press(
      await screen.findByRole('button', { name: 'Remover capa' }),
    );
    expect(
      screen.getByText('Opcional · JPEG, PNG ou WebP até 5 MB'),
    ).toBeOnTheScreen();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Escolher foto' }),
    );
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('A imagem pode ter até 5 MB');
    });
  });

  it('should keep the form usable when TMDB is unavailable', async () => {
    mockApi
      .onGet('/tmdb/search')
      .reply(...apiErrorReply(503, 'MOVIE_CATALOG_UNAVAILABLE'));
    await renderForm();

    await fireEvent.changeText(screen.getByLabelText('Buscar no TMDB'), 'duna');

    expect(
      await screen.findByText(
        'Busca indisponível no momento. Preencha os campos abaixo.',
        {},
        { timeout: 2000 },
      ),
    ).toBeOnTheScreen();
  });
});
