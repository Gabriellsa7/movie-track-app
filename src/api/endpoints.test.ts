import { ITEM_ID, MOVIE_ID, USER_ID } from '@/test/constants';
import { mockApi } from '@/test/mock-api';
import { deleteAccount } from '@/features/account/api/delete-account';
import { removeAvatar } from '@/features/account/api/delete-avatar';
import { changePassword } from '@/features/account/api/patch-password';
import { resendEmailVerification } from '@/features/account/api/post-email-verification';
import { updateAccount } from '@/features/account/api/put-account';
import { uploadAvatar } from '@/features/account/api/put-avatar';
import { requestPasswordReset } from '@/features/auth/api/post-forgot-password';
import { resetPassword } from '@/features/auth/api/post-reset-password';
import { signUp } from '@/features/auth/api/post-sign-up';
import { verifyEmail } from '@/features/auth/api/post-verify-email';
import { deleteMovie } from '@/features/movies/api/delete-movie';
import { removeMoviePoster } from '@/features/movies/api/delete-movie-poster';
import { getMovie } from '@/features/movies/api/get-movie';
import { setMovieFavorite } from '@/features/movies/api/patch-movie-favorite';
import { createMovie } from '@/features/movies/api/post-movie';
import { rewatchMovie } from '@/features/movies/api/post-movie-rewatch';
import { updateMovie } from '@/features/movies/api/put-movie';
import { uploadMoviePoster } from '@/features/movies/api/put-movie-poster';
import { getUserMovie } from '@/features/users/api/get-user-movie';
import { listUserMovies } from '@/features/users/api/get-user-movies';
import { getUserProfile } from '@/features/users/api/get-user-profile';
import { listUsers } from '@/features/users/api/get-users';
import { removeWatchlistItem } from '@/features/watchlist/api/delete-watchlist-item';
import { addWatchlistItem } from '@/features/watchlist/api/post-watchlist-item';
import { markWatchlistItemWatched } from '@/features/watchlist/api/post-watchlist-item-watched';
import { updateWatchlistItem } from '@/features/watchlist/api/put-watchlist-item';
import { getAccount } from './get-account';
import { listGenres } from './get-genres';
import { listMovies } from './get-movies';
import { searchTmdbMovies } from './get-tmdb-search';
import { getUserStats } from './get-user-stats';
import { listWatchlist } from './get-watchlist';
import { login } from './post-login';
import { logout } from './post-logout';
import { refreshTokens } from './post-refresh-token';

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
    () => login({ email: 'a@b.com', password: 'x' }),
    {
      method: 'POST',
      url: '/auth/login',
      body: { email: 'a@b.com', password: 'x' },
    },
  ],
  [
    'refreshTokens',
    () => refreshTokens('rt'),
    { method: 'POST', url: '/auth/refresh', body: { refreshToken: 'rt' } },
  ],
  [
    'logout',
    () => logout('rt'),
    { method: 'POST', url: '/auth/logout', body: { refreshToken: 'rt' } },
  ],
  [
    'verifyEmail',
    () => verifyEmail('tk'),
    { method: 'POST', url: '/auth/verify-email', body: { token: 'tk' } },
  ],
  [
    'requestPasswordReset',
    () => requestPasswordReset('a@b.com'),
    {
      method: 'POST',
      url: '/auth/forgot-password',
      body: { email: 'a@b.com' },
    },
  ],
  [
    'resetPassword',
    () => resetPassword({ token: 'tk', newPassword: 'abc12345' }),
    {
      method: 'POST',
      url: '/auth/reset-password',
      body: { token: 'tk', newPassword: 'abc12345' },
    },
  ],
  [
    'signUp',
    () => signUp({ name: 'G', email: 'a@b.com', password: 'abc12345' }),
    {
      method: 'POST',
      url: '/users',
      body: { name: 'G', email: 'a@b.com', password: 'abc12345' },
    },
  ],
  [
    'listUsers',
    () => listUsers({ search: 'ma' }),
    { method: 'GET', url: '/users', params: { search: 'ma' }, body: null },
  ],
  [
    'getUserProfile',
    () => getUserProfile(USER_ID),
    { method: 'GET', url: `/users/${USER_ID}`, body: null },
  ],
  [
    'getAccount',
    () => getAccount(USER_ID),
    { method: 'GET', url: `/users/${USER_ID}/account`, body: null },
  ],
  [
    'updateAccount',
    () => updateAccount(USER_ID, { name: 'G' }),
    { method: 'PUT', url: `/users/${USER_ID}`, body: { name: 'G' } },
  ],
  [
    'changePassword',
    () => changePassword(USER_ID, { currentPassword: 'a', newPassword: 'b' }),
    {
      method: 'PATCH',
      url: `/users/${USER_ID}/password`,
      body: { currentPassword: 'a', newPassword: 'b' },
    },
  ],
  [
    'deleteAccount',
    () => deleteAccount(USER_ID, 'pw'),
    { method: 'DELETE', url: `/users/${USER_ID}`, body: { password: 'pw' } },
  ],
  [
    'resendEmailVerification',
    () => resendEmailVerification(USER_ID),
    { method: 'POST', url: `/users/${USER_ID}/email-verification`, body: null },
  ],
  [
    'uploadAvatar',
    () => uploadAvatar(USER_ID, PICKED),
    { method: 'PUT', url: `/users/${USER_ID}/avatar`, body: ['avatar'] },
  ],
  [
    'removeAvatar',
    () => removeAvatar(USER_ID),
    { method: 'DELETE', url: `/users/${USER_ID}/avatar`, body: null },
  ],
  [
    'getUserStats',
    () => getUserStats(USER_ID),
    { method: 'GET', url: `/users/${USER_ID}/stats`, body: null },
  ],
  [
    'listUserMovies',
    () => listUserMovies(USER_ID, { favorite: true }),
    {
      method: 'GET',
      url: `/users/${USER_ID}/movies`,
      params: { favorite: true },
      body: null,
    },
  ],
  [
    'getUserMovie',
    () => getUserMovie(USER_ID, MOVIE_ID),
    { method: 'GET', url: `/users/${USER_ID}/movies/${MOVIE_ID}`, body: null },
  ],
  [
    'listMovies',
    () => listMovies({ sort: 'rating' }),
    { method: 'GET', url: '/movies', params: { sort: 'rating' }, body: null },
  ],
  [
    'getMovie',
    () => getMovie(MOVIE_ID),
    { method: 'GET', url: `/movies/${MOVIE_ID}`, body: null },
  ],
  [
    'createMovie',
    () => createMovie(NEW_MOVIE),
    { method: 'POST', url: '/movies', body: NEW_MOVIE },
  ],
  [
    'updateMovie',
    () => updateMovie(MOVIE_ID, { ...NEW_MOVIE, rating: 7.5 }),
    {
      method: 'PUT',
      url: `/movies/${MOVIE_ID}`,
      body: { ...NEW_MOVIE, rating: 7.5 },
    },
  ],
  [
    'deleteMovie',
    () => deleteMovie(MOVIE_ID),
    { method: 'DELETE', url: `/movies/${MOVIE_ID}`, body: null },
  ],
  [
    'setMovieFavorite',
    () => setMovieFavorite(MOVIE_ID, true),
    {
      method: 'PATCH',
      url: `/movies/${MOVIE_ID}/favorite`,
      body: { isFavorite: true },
    },
  ],
  [
    'rewatchMovie',
    () => rewatchMovie(MOVIE_ID),
    { method: 'POST', url: `/movies/${MOVIE_ID}/rewatch`, body: {} },
  ],
  [
    'uploadMoviePoster',
    () => uploadMoviePoster(MOVIE_ID, PICKED),
    { method: 'PUT', url: `/movies/${MOVIE_ID}/poster`, body: ['poster'] },
  ],
  [
    'removeMoviePoster',
    () => removeMoviePoster(MOVIE_ID),
    { method: 'DELETE', url: `/movies/${MOVIE_ID}/poster`, body: null },
  ],
  [
    'listWatchlist',
    () => listWatchlist({ planned: true }),
    { method: 'GET', url: '/watchlist', params: { planned: true }, body: null },
  ],
  [
    'addWatchlistItem',
    () => addWatchlistItem({ title: 'T' }),
    { method: 'POST', url: '/watchlist', body: { title: 'T' } },
  ],
  [
    'updateWatchlistItem',
    () => updateWatchlistItem(ITEM_ID, { priority: 'high' }),
    { method: 'PUT', url: `/watchlist/${ITEM_ID}`, body: { priority: 'high' } },
  ],
  [
    'removeWatchlistItem',
    () => removeWatchlistItem(ITEM_ID),
    { method: 'DELETE', url: `/watchlist/${ITEM_ID}`, body: null },
  ],
  [
    'markWatchlistItemWatched',
    () => markWatchlistItemWatched(ITEM_ID, { rating: 9 }),
    {
      method: 'POST',
      url: `/watchlist/${ITEM_ID}/watched`,
      body: { rating: 9 },
    },
  ],
  [
    'searchTmdbMovies',
    () => searchTmdbMovies({ query: 'duna' }),
    {
      method: 'GET',
      url: '/tmdb/search',
      params: { query: 'duna' },
      body: null,
    },
  ],
  [
    'listGenres',
    () => listGenres(),
    { method: 'GET', url: '/genres', body: null },
  ],
];

describe('When we call each API endpoint', () => {
  it.each(CASES)(
    'should send %s to the right route',
    async (_name, call, expected) => {
      await call();

      expect(recorded).toEqual(expected);
    },
  );
});
