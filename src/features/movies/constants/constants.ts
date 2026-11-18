import type { IListMoviesQuery } from '@/api/types';
import type { IOption } from '@/components/option-sheet';

export type TMovieSortKey =
  'latest' | 'rating' | 'title' | 'releaseYear' | 'watchCount';

export interface IMovieFilters {
  favorite: boolean;
  genreId?: string;
  sort: TMovieSortKey;
}

export const MOVIE_DEFAULT_FILTERS: IMovieFilters = {
  favorite: false,
  sort: 'latest',
};

export const MOVIE_SORT_OPTIONS: IOption<TMovieSortKey>[] = [
  { label: 'Latest watched', value: 'latest' },
  { label: 'Highest rating', value: 'rating' },
  { label: 'Title A–Z', value: 'title' },
  { label: 'Release year', value: 'releaseYear' },
  { label: 'Most rewatched', value: 'watchCount' },
];

const SORT_QUERIES: Record<
  TMovieSortKey,
  Pick<IListMoviesQuery, 'sort' | 'order'>
> = {
  latest: { sort: 'watchedAt', order: 'desc' },
  rating: { sort: 'rating', order: 'desc' },
  title: { sort: 'title', order: 'asc' },
  releaseYear: { sort: 'releaseYear', order: 'desc' },
  watchCount: { sort: 'watchCount', order: 'desc' },
};

export function toMoviesQuery(
  filters: IMovieFilters,
  search: string,
): IListMoviesQuery {
  return {
    ...SORT_QUERIES[filters.sort],
    ...(search && { search }),
    ...(filters.favorite && { favorite: true }),
    ...(filters.genreId && { genreId: filters.genreId }),
  };
}

export function hasActiveFilters(filters: IMovieFilters): boolean {
  return filters.favorite || Boolean(filters.genreId);
}
