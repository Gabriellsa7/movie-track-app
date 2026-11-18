import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { toast } from 'sonner-native';
import { toIsoDate } from '@/lib/validation/rules';
import { A_MOVIE } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { MovieFormScreen } from './movie-form';

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
