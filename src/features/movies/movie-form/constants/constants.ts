import { z, type input as TInput, type output as TOutput } from 'zod';
import type { IUploadFile } from '@/api/upload-file';
import {
  genreIdsSchema,
  ratingSchema,
  releaseYearSchema,
  toIsoDate,
  watchedAtSchema,
} from '@/lib/validation/rules';

const TITLE_MAX_LENGTH = 200;
const SYNOPSIS_MAX_LENGTH = 2000;
const DIRECTOR_MAX_LENGTH = 200;
const REVIEW_MAX_LENGTH = 5000;
const MAX_DURATION_MINUTES = 1000;

function optionalText(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength, `Use at most ${String(maxLength)} characters`)
    .transform((value) => value || undefined);
}

export const MOVIE_FORM_SCHEMA = z.object({
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
  rating: ratingSchema,
  watchedAt: watchedAtSchema,
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
  review: optionalText(REVIEW_MAX_LENGTH),
  isFavorite: z.boolean(),
  tmdbId: z.number().optional(),
  posterUrl: z.string().optional(),
  poster: z.custom<IUploadFile>().optional(),
});

export interface IMovieFormInput extends TInput<typeof MOVIE_FORM_SCHEMA> {}
export interface IMovieFormOutput extends TOutput<typeof MOVIE_FORM_SCHEMA> {}

export const MOVIE_FORM_FIELDS = [
  'title',
  'synopsis',
  'releaseYear',
  'genreIds',
  'rating',
  'watchedAt',
  'director',
  'durationMinutes',
  'review',
  'isFavorite',
  'posterUrl',
] as const;

export function movieFormDefaultValues(): Partial<IMovieFormInput> {
  return {
    title: '',
    synopsis: '',
    releaseYear: '',
    genreIds: [],
    watchedAt: toIsoDate(new Date()),
    director: '',
    durationMinutes: '',
    review: '',
    isFavorite: false,
  };
}

export const MOVIE_FORM_MESSAGES = {
  created: 'Movie logged',
  noConnection: "Can't reach the server. Check your connection and try again.",
  unexpected: "Couldn't log the movie. Try again.",
  posterNotSent: 'Movie logged, but the poster was not uploaded.',
} as const;
