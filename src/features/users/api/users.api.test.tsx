import { renderHook, waitFor } from '@testing-library/react-native';
import { MOVIE_ID, USER_ID } from '@/test/constants';
import { A_MOVIE } from '@/test/fixtures';
import { mockApi } from '@/test/mock-api';
import { createWrapper } from '@/test/render';
import { useUserMovieQuery } from './get-user-movie';
import { useUserMoviesQuery } from './get-user-movies';
import { useUserProfileQuery } from './get-user-profile';
import { useUsersQuery } from './get-users';

describe('When we read public data', () => {
  it('should load users, a profile, its movies and one review', async () => {
    mockApi.onGet('/users').reply(200, { items: [] });
    mockApi.onGet(`/users/${USER_ID}`).reply(200, { id: USER_ID });
    mockApi.onGet(`/users/${USER_ID}/movies`).reply(200, { items: [A_MOVIE] });
    mockApi.onGet(`/users/${USER_ID}/movies/${MOVIE_ID}`).reply(200, A_MOVIE);

    const { result } = await renderHook(
      () => ({
        users: useUsersQuery({}),
        profile: useUserProfileQuery(USER_ID),
        movies: useUserMoviesQuery(USER_ID, {}),
        movie: useUserMovieQuery(USER_ID, MOVIE_ID),
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.users.isSuccess).toBe(true);
      expect(result.current.profile.isSuccess).toBe(true);
      expect(result.current.movies.isSuccess).toBe(true);
      expect(result.current.movie.data).toEqual(A_MOVIE);
    });
  });
});
