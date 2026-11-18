import type { IListMoviesQuery } from '@/api/types';
import type { IOption } from '@/components/option-sheet';

export type TMovieSortKey =
  'latest' | 'rating' | 'title' | 'releaseYear' | 'watchCount';

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

export function movieSortQuery(
  sort: TMovieSortKey,
): Pick<IListMoviesQuery, 'sort' | 'order'> {
  return SORT_QUERIES[sort];
}

export function movieSortLabel(sort: TMovieSortKey): string {
  return (
    MOVIE_SORT_OPTIONS.find((option) => option.value === sort)?.label ?? ''
  );
}
