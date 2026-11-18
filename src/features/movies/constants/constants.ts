import type { IListMoviesQuery } from '@/api/types';
import { movieSortQuery, type TMovieSortKey } from '@/lib/movie-sort';

export interface IMovieFilters {
  favorite: boolean;
  genreId?: string;
  sort: TMovieSortKey;
}

export const MOVIE_DEFAULT_FILTERS: IMovieFilters = {
  favorite: false,
  sort: 'latest',
};

export function toMoviesQuery(
  filters: IMovieFilters,
  search: string,
): IListMoviesQuery {
  return {
    ...movieSortQuery(filters.sort),
    ...(search && { search }),
    ...(filters.favorite && { favorite: true }),
    ...(filters.genreId && { genreId: filters.genreId }),
  };
}

export function hasActiveFilters(filters: IMovieFilters): boolean {
  return filters.favorite || Boolean(filters.genreId);
}
