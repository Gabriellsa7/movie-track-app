import { z } from 'zod';
import { genreIdsSchema, releaseYearSchema } from './rules';

const TITLE_MAX_LENGTH = 200;
const SYNOPSIS_MAX_LENGTH = 2000;
const DIRECTOR_MAX_LENGTH = 200;
const MAX_DURATION_MINUTES = 1000;

export function optionalText(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength, `Use at most ${String(maxLength)} characters`)
    .transform((value) => value || undefined);
}

export const MOVIE_DETAILS_SHAPE = {
  title: z
    .string()
    .trim()
    .min(1, 'Enter the title')
    .max(
      TITLE_MAX_LENGTH,
      `Use at most ${String(TITLE_MAX_LENGTH)} characters`,
    ),
  synopsis: z
    .string()
    .trim()
    .min(1, 'Write a synopsis')
    .max(
      SYNOPSIS_MAX_LENGTH,
      `Use at most ${String(SYNOPSIS_MAX_LENGTH)} characters`,
    ),
  releaseYear: z
    .string()
    .trim()
    .min(1, 'Enter the year')
    .transform(Number)
    .pipe(releaseYearSchema),
  genreIds: genreIdsSchema,
  director: optionalText(DIRECTOR_MAX_LENGTH),
  durationMinutes: z
    .string()
    .trim()
    .transform((value) => (value ? Number(value) : undefined))
    .pipe(
      z
        .number('Enter the runtime in minutes')
        .int('Enter the runtime in minutes')
        .min(1, 'Enter the runtime in minutes')
        .max(
          MAX_DURATION_MINUTES,
          `Use at most ${String(MAX_DURATION_MINUTES)} minutes`,
        )
        .optional(),
    ),
};

export const MOVIE_DETAIL_FIELDS = [
  'title',
  'releaseYear',
  'genreIds',
  'synopsis',
  'director',
  'durationMinutes',
] as const;
