import { renderHook, waitFor } from '@testing-library/react-native';
import { USER_ID } from '@/test/constants';
import { A_MOVIE, A_WATCHLIST_PAGE } from '@/test/fixtures';
import { mockApi } from '@/test/mock-api';
import { createWrapper } from '@/test/render';
import { useGenresQuery } from './get-genres';
import { useMoviesQuery } from './get-movies';
import { useTmdbSearchQuery } from './get-tmdb-search';
import { useUserStatsQuery } from './get-user-stats';
import { useWatchlistQuery } from './get-watchlist';

const PAGE = { items: [A_MOVIE], total: 1, page: 1, limit: 20 };

describe('When we read the data shared by several screens', () => {
  it('should load my movies, my watchlist, stats, genres and TMDB results', async () => {
    mockApi.onGet('/movies').reply(200, PAGE);
    mockApi.onGet('/watchlist').reply(200, A_WATCHLIST_PAGE);
    mockApi.onGet(`/users/${USER_ID}/stats`).reply(200, { totalMovies: 1 });
    mockApi.onGet('/genres').reply(200, [{ id: 'g', name: 'Drama' }]);
    mockApi.onGet('/tmdb/search').reply(200, { items: [] });

    const { result } = await renderHook(
      () => ({
        movies: useMoviesQuery({ sort: 'rating' }),
        watchlist: useWatchlistQuery({}),
        stats: useUserStatsQuery(USER_ID),
        genres: useGenresQuery(),
        tmdb: useTmdbSearchQuery({ query: 'duna' }),
        tooShort: useTmdbSearchQuery({ query: 'd' }),
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.movies.data).toEqual(PAGE);
      expect(result.current.watchlist.data).toEqual(A_WATCHLIST_PAGE);
      expect(result.current.stats.isSuccess).toBe(true);
      expect(result.current.genres.data).toHaveLength(1);
      expect(result.current.tmdb.isSuccess).toBe(true);
    });
    expect(result.current.tooShort.fetchStatus).toBe('idle');
  });
});
