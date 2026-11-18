import type {
  IListMoviesQuery,
  IListUsersQuery,
  IListWatchlistQuery,
  ITmdbSearchQuery,
} from '@/api/types';

export const queryKeys = {
  genres: ['genres'] as const,
  account: (userId: string) => ['account', userId] as const,
  movies: {
    all: ['movies'] as const,
    list: (query: IListMoviesQuery) => ['movies', 'list', query] as const,
    detail: (movieId: string) => ['movies', 'detail', movieId] as const,
  },
  watchlist: {
    all: ['watchlist'] as const,
    list: (query: IListWatchlistQuery) => ['watchlist', 'list', query] as const,
    item: (itemId: string) => ['watchlist', 'item', itemId] as const,
  },
  users: {
    all: ['users'] as const,
    list: (query: IListUsersQuery) => ['users', 'list', query] as const,
    profile: (userId: string) => ['users', userId, 'profile'] as const,
    stats: (userId: string) => ['users', userId, 'stats'] as const,
    movies: (userId: string, query: IListMoviesQuery) =>
      ['users', userId, 'movies', query] as const,
    movie: (userId: string, movieId: string) =>
      ['users', userId, 'movies', 'detail', movieId] as const,
  },
  tmdb: {
    search: (query: ITmdbSearchQuery) => ['tmdb', 'search', query] as const,
  },
};
