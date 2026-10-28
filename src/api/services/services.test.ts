import { ITEM_ID, MOVIE_ID, USER_ID } from '@/test/constants';
import { mockApi } from '@/test/mock-api';
import * as auth from './auth.service';
import * as genre from './genre.service';
import * as movie from './movie.service';
import * as tmdb from './tmdb.service';
import * as user from './user.service';
import * as watchlist from './watchlist.service';

interface IRecordedRequest {
  method: string;
  url: string;
  params?: unknown;
  body: unknown;
}

interface IFormDataParts {
  getParts: () => { fieldName: string }[];
}

let recorded: IRecordedRequest | null = null;
const PICKED = {
  uri: 'file:///poster.png',
  name: 'poster.png',
  type: 'image/png',
};
// PUT /movies/{id} replaces the movie, so it takes the same required fields as POST.
const NEW_MOVIE = {
  title: 'T',
  synopsis: 'S',
  releaseYear: 2024,
  genreIds: ['g'],
  rating: 8,
};

// React Native's FormData lists its parts with getParts(); Node's (in Jest) with keys().
function readBody(data: unknown): unknown {
  if (data && typeof (data as IFormDataParts).getParts === 'function') {
    return (data as IFormDataParts).getParts().map((part) => part.fieldName);
  }
  if (data instanceof FormData) {
    return [...data.keys()];
  }
  return typeof data === 'string' ? (JSON.parse(data) as unknown) : null;
}

beforeEach(() => {
  recorded = null;
  mockApi.onAny().reply((config) => {
    recorded = {
      method: (config.method ?? '').toUpperCase(),
      url: config.url ?? '',
      ...(config.params ? { params: config.params as unknown } : {}),
      body: readBody(config.data),
    };
    return [200, { ok: true }];
  });
});

const CASES: [string, () => Promise<unknown>, IRecordedRequest][] = [
  [
    'login',
    () => auth.login({ email: 'a@b.com', password: 'x' }),
    {
      method: 'POST',
      url: '/auth/login',
      body: { email: 'a@b.com', password: 'x' },
    },
  ],
  [
    'refreshTokens',
    () => auth.refreshTokens('rt'),
    { method: 'POST', url: '/auth/refresh', body: { refreshToken: 'rt' } },
  ],
  [
    'logout',
    () => auth.logout('rt'),
    { method: 'POST', url: '/auth/logout', body: { refreshToken: 'rt' } },
  ],
  [
    'verifyEmail',
    () => auth.verifyEmail('tk'),
    { method: 'POST', url: '/auth/verify-email', body: { token: 'tk' } },
  ],
  [
    'requestPasswordReset',
    () => auth.requestPasswordReset('a@b.com'),
    {
      method: 'POST',
      url: '/auth/forgot-password',
      body: { email: 'a@b.com' },
    },
  ],
  [
    'resetPassword',
    () => auth.resetPassword({ token: 'tk', newPassword: 'abc12345' }),
    {
      method: 'POST',
      url: '/auth/reset-password',
      body: { token: 'tk', newPassword: 'abc12345' },
    },
  ],
  [
    'signUp',
    () => user.signUp({ name: 'G', email: 'a@b.com', password: 'abc12345' }),
    {
      method: 'POST',
      url: '/users',
      body: { name: 'G', email: 'a@b.com', password: 'abc12345' },
    },
  ],
  [
    'listUsers',
    () => user.listUsers({ search: 'ma' }),
    { method: 'GET', url: '/users', params: { search: 'ma' }, body: null },
  ],
  [
    'getUserProfile',
    () => user.getUserProfile(USER_ID),
    { method: 'GET', url: `/users/${USER_ID}`, body: null },
  ],
  [
    'getAccount',
    () => user.getAccount(USER_ID),
    { method: 'GET', url: `/users/${USER_ID}/account`, body: null },
  ],
  [
    'updateAccount',
    () => user.updateAccount(USER_ID, { name: 'G' }),
    { method: 'PUT', url: `/users/${USER_ID}`, body: { name: 'G' } },
  ],
  [
    'changePassword',
    () =>
      user.changePassword(USER_ID, { currentPassword: 'a', newPassword: 'b' }),
    {
      method: 'PATCH',
      url: `/users/${USER_ID}/password`,
      body: { currentPassword: 'a', newPassword: 'b' },
    },
  ],
  [
    'deleteAccount',
    () => user.deleteAccount(USER_ID, 'pw'),
    { method: 'DELETE', url: `/users/${USER_ID}`, body: { password: 'pw' } },
  ],
  [
    'resendEmailVerification',
    () => user.resendEmailVerification(USER_ID),
    { method: 'POST', url: `/users/${USER_ID}/email-verification`, body: null },
  ],
  [
    'uploadAvatar',
    () => user.uploadAvatar(USER_ID, PICKED),
    { method: 'PUT', url: `/users/${USER_ID}/avatar`, body: ['avatar'] },
  ],
  [
    'removeAvatar',
    () => user.removeAvatar(USER_ID),
    { method: 'DELETE', url: `/users/${USER_ID}/avatar`, body: null },
  ],
  [
    'getUserStats',
    () => user.getUserStats(USER_ID),
    { method: 'GET', url: `/users/${USER_ID}/stats`, body: null },
  ],
  [
    'listUserMovies',
    () => user.listUserMovies(USER_ID, { favorite: true }),
    {
      method: 'GET',
      url: `/users/${USER_ID}/movies`,
      params: { favorite: true },
      body: null,
    },
  ],
  [
    'getUserMovie',
    () => user.getUserMovie(USER_ID, MOVIE_ID),
    { method: 'GET', url: `/users/${USER_ID}/movies/${MOVIE_ID}`, body: null },
  ],
  [
    'listMovies',
    () => movie.listMovies({ sort: 'rating' }),
    { method: 'GET', url: '/movies', params: { sort: 'rating' }, body: null },
  ],
  [
    'getMovie',
    () => movie.getMovie(MOVIE_ID),
    { method: 'GET', url: `/movies/${MOVIE_ID}`, body: null },
  ],
  [
    'createMovie',
    () => movie.createMovie(NEW_MOVIE),
    { method: 'POST', url: '/movies', body: NEW_MOVIE },
  ],
  [
    'updateMovie',
    () => movie.updateMovie(MOVIE_ID, { ...NEW_MOVIE, rating: 7.5 }),
    {
      method: 'PUT',
      url: `/movies/${MOVIE_ID}`,
      body: { ...NEW_MOVIE, rating: 7.5 },
    },
  ],
  [
    'deleteMovie',
    () => movie.deleteMovie(MOVIE_ID),
    { method: 'DELETE', url: `/movies/${MOVIE_ID}`, body: null },
  ],
  [
    'setMovieFavorite',
    () => movie.setMovieFavorite(MOVIE_ID, true),
    {
      method: 'PATCH',
      url: `/movies/${MOVIE_ID}/favorite`,
      body: { isFavorite: true },
    },
  ],
  [
    'rewatchMovie',
    () => movie.rewatchMovie(MOVIE_ID),
    { method: 'POST', url: `/movies/${MOVIE_ID}/rewatch`, body: {} },
  ],
  [
    'uploadMoviePoster',
    () => movie.uploadMoviePoster(MOVIE_ID, PICKED),
    { method: 'PUT', url: `/movies/${MOVIE_ID}/poster`, body: ['poster'] },
  ],
  [
    'removeMoviePoster',
    () => movie.removeMoviePoster(MOVIE_ID),
    { method: 'DELETE', url: `/movies/${MOVIE_ID}/poster`, body: null },
  ],
  [
    'listWatchlist',
    () => watchlist.listWatchlist({ planned: true }),
    { method: 'GET', url: '/watchlist', params: { planned: true }, body: null },
  ],
  [
    'addWatchlistItem',
    () => watchlist.addWatchlistItem({ title: 'T' }),
    { method: 'POST', url: '/watchlist', body: { title: 'T' } },
  ],
  [
    'updateWatchlistItem',
    () => watchlist.updateWatchlistItem(ITEM_ID, { priority: 'high' }),
    { method: 'PUT', url: `/watchlist/${ITEM_ID}`, body: { priority: 'high' } },
  ],
  [
    'removeWatchlistItem',
    () => watchlist.removeWatchlistItem(ITEM_ID),
    { method: 'DELETE', url: `/watchlist/${ITEM_ID}`, body: null },
  ],
  [
    'markWatchlistItemWatched',
    () => watchlist.markWatchlistItemWatched(ITEM_ID, { rating: 9 }),
    {
      method: 'POST',
      url: `/watchlist/${ITEM_ID}/watched`,
      body: { rating: 9 },
    },
  ],
  [
    'searchTmdbMovies',
    () => tmdb.searchTmdbMovies({ query: 'duna' }),
    {
      method: 'GET',
      url: '/tmdb/search',
      params: { query: 'duna' },
      body: null,
    },
  ],
  [
    'listGenres',
    () => genre.listGenres(),
    { method: 'GET', url: '/genres', body: null },
  ],
];

describe('When we call each API service', () => {
  it.each(CASES)(
    'should send %s to the right route',
    async (_name, call, expected) => {
      await call();

      expect(recorded).toEqual(expected);
    },
  );
});
