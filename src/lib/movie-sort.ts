import type { IListMoviesQuery } from '@/api/types';
import type { IOption } from '@/components/option-sheet';
import { tFor, type TLanguage } from '@/i18n';

export type TMovieSortKey =
  'latest' | 'rating' | 'title' | 'releaseYear' | 'watchCount';

const SORT_KEYS: TMovieSortKey[] = [
  'latest',
  'rating',
  'title',
  'releaseYear',
  'watchCount',
];

export function movieSortOptions(
  language: TLanguage,
): IOption<TMovieSortKey>[] {
  return SORT_KEYS.map((value) => ({
    value,
    label: movieSortLabel(value, language),
  }));
}

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

export function movieSortLabel(
  sort: TMovieSortKey,
  language: TLanguage,
): string {
  return tFor(language)(`movies.sort.${sort === 'title' ? 'titleAz' : sort}`);
}
