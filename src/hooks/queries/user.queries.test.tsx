import { act, renderHook, waitFor } from '@testing-library/react-native';
import { readStoredUser } from '@/lib/session/session.storage';
import { MOVIE_ID, USER_ID } from '@/test/constants';
import { A_MOVIE, A_USER } from '@/test/fixtures';
import { mockApi } from '@/test/mock-api';
import { createWrapper } from '@/test/render';
import { useSessionStore } from '@/stores/session.store';
import { useGenresQuery } from './genre.queries';
import { useTmdbSearchQuery } from './tmdb.queries';
import {
  useChangePasswordMutation,
  useRemoveAvatarMutation,
  useUpdateAccountMutation,
  useUploadAvatarMutation,
  useUserMovieQuery,
  useUserMoviesQuery,
  useUserProfileQuery,
  useUsersQuery,
  useUserStatsQuery,
} from './user.queries';

describe('When we read public data', () => {
  it('should load users, a profile, its stats, movies and one review', async () => {
    mockApi.onGet('/users').reply(200, { items: [] });
    mockApi.onGet(`/users/${USER_ID}`).reply(200, { id: USER_ID });
    mockApi.onGet(`/users/${USER_ID}/stats`).reply(200, { totalMovies: 1 });
    mockApi.onGet(`/users/${USER_ID}/movies`).reply(200, { items: [A_MOVIE] });
    mockApi.onGet(`/users/${USER_ID}/movies/${MOVIE_ID}`).reply(200, A_MOVIE);
    mockApi.onGet('/genres').reply(200, [{ id: 'g', name: 'Drama' }]);
    mockApi.onGet('/tmdb/search').reply(200, { items: [] });

    const { result } = await renderHook(
      () => ({
        users: useUsersQuery({}),
        profile: useUserProfileQuery(USER_ID),
        stats: useUserStatsQuery(USER_ID),
        movies: useUserMoviesQuery(USER_ID, {}),
        movie: useUserMovieQuery(USER_ID, MOVIE_ID),
        genres: useGenresQuery(),
        tmdb: useTmdbSearchQuery({ query: 'duna' }),
        tooShort: useTmdbSearchQuery({ query: 'd' }),
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.users.isSuccess).toBe(true);
      expect(result.current.profile.isSuccess).toBe(true);
      expect(result.current.stats.isSuccess).toBe(true);
      expect(result.current.movies.isSuccess).toBe(true);
      expect(result.current.movie.data).toEqual(A_MOVIE);
      expect(result.current.genres.data).toHaveLength(1);
      expect(result.current.tmdb.isSuccess).toBe(true);
    });
    expect(result.current.tooShort.fetchStatus).toBe('idle');
  });
});

describe('When we change my account', () => {
  it('should keep the session and the stored account in sync', async () => {
    useSessionStore.setState({ userId: USER_ID, status: 'authenticated' });
    const updated = { ...A_USER, name: 'Gabi' };
    mockApi.onPut(`/users/${USER_ID}`).reply(200, updated);
    mockApi.onPut(`/users/${USER_ID}/avatar`).reply(200, updated);
    mockApi.onDelete(`/users/${USER_ID}/avatar`).reply(200, updated);
    mockApi.onPatch(`/users/${USER_ID}/password`).reply(204);

    const { result } = await renderHook(
      () => ({
        update: useUpdateAccountMutation(),
        upload: useUploadAvatarMutation(),
        removeAvatar: useRemoveAvatarMutation(),
        password: useChangePasswordMutation(),
      }),
      { wrapper: createWrapper() },
    );
    await act(async () => {
      await result.current.update.mutateAsync({ name: 'Gabi' });
      await result.current.upload.mutateAsync({
        uri: 'file:///a.png',
        name: 'a.png',
        type: 'image/png',
      });
      await result.current.removeAvatar.mutateAsync(undefined);
      await result.current.password.mutateAsync({
        currentPassword: 'a',
        newPassword: 'b',
      });
    });

    expect(useSessionStore.getState().user).toEqual(updated);
    expect(await readStoredUser()).toEqual(updated);
  });

  it('should refuse without a session', async () => {
    const { result } = await renderHook(
      () => ({
        update: useUpdateAccountMutation(),
        password: useChangePasswordMutation(),
      }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await expect(
        result.current.update.mutateAsync({ name: 'x' }),
      ).rejects.toThrow('Not logged in');
      await expect(
        result.current.password.mutateAsync({
          currentPassword: 'a',
          newPassword: 'b',
        }),
      ).rejects.toThrow('Not logged in');
    });
  });
});
