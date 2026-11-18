import { act, renderHook, waitFor } from '@testing-library/react-native';
import { queryKeys } from '@/api/query-keys';
import type { TMovie } from '@/api/types';
import { MOVIE_ID } from '@/test/constants';
import { A_MOVIE } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient, createWrapper } from '@/test/render';
import { useDeleteMovieMutation } from './delete-movie';
import { useRemovePosterMutation } from './delete-movie-poster';
import { useMovieQuery } from './get-movie';
import { useSetFavoriteMutation } from './patch-movie-favorite';
import { useCreateMovieMutation } from './post-movie';
import { useRewatchMovieMutation } from './post-movie-rewatch';
import { useUpdateMovieMutation } from './put-movie';
import { useUploadPosterMutation } from './put-movie-poster';

const PAGE = { items: [A_MOVIE], total: 1, page: 1, limit: 20 };
const NEW_MOVIE = {
  title: 'T',
  synopsis: 'S',
  releaseYear: 2024,
  genreIds: ['g'],
  rating: 8,
};

describe('When we read one of my movies', () => {
  it('should load it', async () => {
    mockApi.onGet(`/movies/${MOVIE_ID}`).reply(200, A_MOVIE);

    const { result } = await renderHook(() => useMovieQuery(MOVIE_ID), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(A_MOVIE);
    });
  });
});

describe('When we change my movies', () => {
  it('should create, update, rewatch, delete and change the poster, invalidating the lists', async () => {
    mockApi.onPost('/movies').reply(201, A_MOVIE);
    mockApi.onPut(`/movies/${MOVIE_ID}`).reply(200, A_MOVIE);
    mockApi.onPost(`/movies/${MOVIE_ID}/rewatch`).reply(200, A_MOVIE);
    mockApi.onDelete(`/movies/${MOVIE_ID}`).reply(204);
    mockApi.onPut(`/movies/${MOVIE_ID}/poster`).reply(200, A_MOVIE);
    mockApi.onDelete(`/movies/${MOVIE_ID}/poster`).reply(200, A_MOVIE);
    const client = createTestQueryClient();
    client.setQueryData(queryKeys.movies.list({}), PAGE);

    const { result } = await renderHook(
      () => ({
        create: useCreateMovieMutation(),
        update: useUpdateMovieMutation(MOVIE_ID),
        rewatch: useRewatchMovieMutation(MOVIE_ID),
        remove: useDeleteMovieMutation(),
        upload: useUploadPosterMutation(MOVIE_ID),
        removePoster: useRemovePosterMutation(MOVIE_ID),
      }),
      { wrapper: createWrapper(client) },
    );

    await act(async () => {
      await result.current.create.mutateAsync(NEW_MOVIE);
      await result.current.update.mutateAsync({ ...NEW_MOVIE, rating: 8.5 });
      await result.current.rewatch.mutateAsync(undefined);
      await result.current.upload.mutateAsync({
        uri: 'file:///p.png',
        name: 'p.png',
        type: 'image/png',
      });
      await result.current.removePoster.mutateAsync();
      await result.current.remove.mutateAsync(MOVIE_ID);
    });

    expect(client.getQueryState(queryKeys.movies.list({}))?.isInvalidated).toBe(
      true,
    );
  });
});

describe('When we mark a movie as favorite', () => {
  it('should flip the heart at once', async () => {
    mockApi
      .onPatch(`/movies/${MOVIE_ID}/favorite`)
      .reply(200, { ...A_MOVIE, isFavorite: true });
    const client = createTestQueryClient();
    client.setQueryData(queryKeys.movies.detail(MOVIE_ID), A_MOVIE);

    const { result } = await renderHook(
      () => useSetFavoriteMutation(MOVIE_ID),
      {
        wrapper: createWrapper(client),
      },
    );
    await act(() => {
      result.current.mutate(true);
    });

    expect(
      client.getQueryData<TMovie>(queryKeys.movies.detail(MOVIE_ID))
        ?.isFavorite,
    ).toBe(true);
  });

  it('should roll back when the API refuses', async () => {
    mockApi
      .onPatch(`/movies/${MOVIE_ID}/favorite`)
      .reply(...apiErrorReply(404, 'MOVIE_NOT_FOUND'));
    const client = createTestQueryClient();
    client.setQueryData(queryKeys.movies.detail(MOVIE_ID), A_MOVIE);

    const { result } = await renderHook(
      () => useSetFavoriteMutation(MOVIE_ID),
      {
        wrapper: createWrapper(client),
      },
    );
    await act(async () => {
      await result.current.mutateAsync(true).catch(() => undefined);
    });

    expect(
      client.getQueryData<TMovie>(queryKeys.movies.detail(MOVIE_ID))
        ?.isFavorite,
    ).toBe(false);
  });
});
