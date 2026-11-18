import { renderHook, waitFor } from '@testing-library/react-native';
import { MOVIE_ID, USER_ID } from '@/test/constants';
import { A_MOVIE } from '@/test/fixtures';
import { mockApi } from '@/test/mock-api';
import { createWrapper } from '@/test/render';
import { useUserMovieQuery } from './get-user-movie';
import { useUserMoviePagesQuery } from './get-user-movies';
import { useUserProfileQuery } from './get-user-profile';
import { useUserPagesQuery } from './get-users';

describe('When we read public data', () => {
  it('should load users, a profile, its movies and one review', async () => {
    mockApi
      .onGet('/users')
      .reply(200, { items: [], total: 0, page: 1, limit: 20 });
    mockApi.onGet(`/users/${USER_ID}`).reply(200, { id: USER_ID });
    mockApi
      .onGet(`/users/${USER_ID}/movies`)
      .reply(200, { items: [A_MOVIE], total: 1, page: 1, limit: 20 });
    mockApi.onGet(`/users/${USER_ID}/movies/${MOVIE_ID}`).reply(200, A_MOVIE);

    const { result } = await renderHook(
      () => ({
        users: useUserPagesQuery({}),
        profile: useUserProfileQuery(USER_ID),
        movies: useUserMoviePagesQuery(USER_ID, {}),
        movie: useUserMovieQuery(USER_ID, MOVIE_ID),
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.users.isSuccess).toBe(true);
      expect(result.current.profile.isSuccess).toBe(true);
      expect(result.current.movies.data?.pages[0]?.items).toEqual([A_MOVIE]);
      expect(result.current.movie.data).toEqual(A_MOVIE);
    });
  });
});
