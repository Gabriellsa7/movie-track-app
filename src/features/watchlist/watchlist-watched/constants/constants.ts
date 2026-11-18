import { z, type input as TInput, type output as TOutput } from 'zod';
import type { IWatchlistItem } from '@/api/types';
import {
  genreIdsSchema,
  ratingSchema,
  releaseYearSchema,
  toIsoDate,
  watchedAtSchema,
} from '@/lib/validation/rules';

const SYNOPSIS_MAX_LENGTH = 2000;
const REVIEW_MAX_LENGTH = 5000;

export type TMissingField = 'releaseYear' | 'genreIds' | 'synopsis';

export const WATCHED_SCHEMA = z.object({
  rating: ratingSchema,
  watchedAt: watchedAtSchema,
  isFavorite: z.boolean(),
  review: z
    .string()
    .trim()
    .max(
      REVIEW_MAX_LENGTH,
      `Use at most ${String(REVIEW_MAX_LENGTH)} characters`,
    )
    .transform((value) => value || undefined),
  releaseYear: z
    .string()
    .trim()
    .transform((value) => (value ? Number(value) : undefined))
    .pipe(releaseYearSchema.optional()),
  genreIds: z.array(z.string()),
  synopsis: z
    .string()
    .trim()
    .max(
      SYNOPSIS_MAX_LENGTH,
      `Use at most ${String(SYNOPSIS_MAX_LENGTH)} characters`,
    )
    .transform((value) => value || undefined),
});

export interface IWatchedInput extends TInput<typeof WATCHED_SCHEMA> {}
export interface IWatchedOutput extends TOutput<typeof WATCHED_SCHEMA> {}

export function missingFields(item: IWatchlistItem): TMissingField[] {
  return [
    item.releaseYear === undefined ? 'releaseYear' : undefined,
    item.genreIds?.length ? undefined : 'genreIds',
    item.synopsis ? undefined : 'synopsis',
  ].filter((field): field is TMissingField => field !== undefined);
}

export function watchedSchemaFor(missing: TMissingField[]) {
  return WATCHED_SCHEMA.superRefine((values, context) => {
    if (missing.includes('releaseYear') && values.releaseYear === undefined) {
      context.addIssue({
        code: 'custom',
        path: ['releaseYear'],
        message: 'Enter the year',
      });
    }
    if (missing.includes('synopsis') && !values.synopsis) {
      context.addIssue({
        code: 'custom',
        path: ['synopsis'],
        message: 'Write a synopsis',
      });
    }
    if (missing.includes('genreIds')) {
      const checked = genreIdsSchema.safeParse(values.genreIds);
      if (!checked.success) {
        context.addIssue({
          code: 'custom',
          path: ['genreIds'],
          message: checked.error.issues[0]?.message ?? 'Pick a genre',
        });
      }
    }
  });
}

export function watchedDefaultValues(): Partial<IWatchedInput> {
  return {
    watchedAt: toIsoDate(new Date()),
    isFavorite: false,
    review: '',
    releaseYear: '',
    genreIds: [],
    synopsis: '',
  };
}

export const WATCHED_FIELDS = [
  'rating',
  'watchedAt',
  'isFavorite',
  'review',
  'releaseYear',
  'genreIds',
  'synopsis',
] as const;
