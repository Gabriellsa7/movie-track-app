import type { TLanguage } from '@/i18n';
import type {
  IListMoviesQuery,
  IListUsersQuery,
  IListWatchlistQuery,
  ITmdbSearchQuery,
} from '@/api/types';

export const queryKeys = {
  genres: (language: TLanguage) => ['genres', language] as const,
  account: (userId: string) => ['account', userId] as const,
  movies: {
    all: ['movies'] as const,
    list: (query: IListMoviesQuery) => ['movies', 'list', query] as const,
    pages: (query: IListMoviesQuery) => ['movies', 'pages', query] as const,
    detail: (movieId: string) => ['movies', 'detail', movieId] as const,
  },
  watchlist: {
    all: ['watchlist'] as const,
    list: (query: IListWatchlistQuery) => ['watchlist', 'list', query] as const,
    pages: (query: IListWatchlistQuery) =>
      ['watchlist', 'pages', query] as const,
    item: (itemId: string) => ['watchlist', 'item', itemId] as const,
  },
  users: {
    all: ['users'] as const,
    pages: (query: IListUsersQuery) => ['users', 'pages', query] as const,
    profile: (userId: string) => ['users', userId, 'profile'] as const,
    account: (userId: string) => ['users', userId, 'account'] as const,
    stats: (userId: string) => ['users', userId, 'stats'] as const,
    moviePages: (userId: string, query: IListMoviesQuery) =>
      ['users', userId, 'movies', 'pages', query] as const,
    movie: (userId: string, movieId: string) =>
      ['users', userId, 'movies', 'detail', movieId] as const,
  },
  tmdb: {
    search: (query: ITmdbSearchQuery, language: TLanguage) =>
      ['tmdb', 'search', language, query] as const,
    details: (tmdbId: number, language: TLanguage) =>
      ['tmdb', 'details', language, tmdbId] as const,
  },
};
