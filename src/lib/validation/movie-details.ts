import { messageKey } from '@/i18n/message';
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
    .max(maxLength, messageKey('validation.maxLength', { count: maxLength }))
    .transform((value) => value || undefined);
}

export const MOVIE_DETAILS_SHAPE = {
  title: z
    .string()
    .trim()
    .min(1, 'validation.titleRequired')
    .max(
      TITLE_MAX_LENGTH,
      messageKey('validation.maxLength', { count: TITLE_MAX_LENGTH }),
    ),
  synopsis: z
    .string()
    .trim()
    .min(1, 'validation.synopsisRequired')
    .max(
      SYNOPSIS_MAX_LENGTH,
      messageKey('validation.maxLength', { count: SYNOPSIS_MAX_LENGTH }),
    ),
  releaseYear: z
    .string()
    .trim()
    .min(1, 'validation.yearRequired')
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
        .number('validation.runtime')
        .int('validation.runtime')
        .min(1, 'validation.runtime')
        .max(
          MAX_DURATION_MINUTES,
          messageKey('validation.maxMinutes', { count: MAX_DURATION_MINUTES }),
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
