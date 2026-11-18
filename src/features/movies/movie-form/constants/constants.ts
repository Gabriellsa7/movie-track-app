import { z, type input as TInput, type output as TOutput } from 'zod';
import type { IUploadFile } from '@/api/upload-file';
import {
  MOVIE_DETAILS_SHAPE,
  optionalText,
} from '@/lib/validation/movie-details';
import {
  ratingSchema,
  toIsoDate,
  watchedAtSchema,
} from '@/lib/validation/rules';

const REVIEW_MAX_LENGTH = 5000;
const MAX_WATCH_COUNT = 1000;

export const MOVIE_FORM_SCHEMA = z.object({
  ...MOVIE_DETAILS_SHAPE,
  rating: ratingSchema,
  watchedAt: watchedAtSchema,
  watchCount: z
    .string()
    .trim()
    .transform((value) => (value ? Number(value) : 1))
    .pipe(
      z
        .number('Enter how many times')
        .int('Enter how many times')
        .min(1, 'Enter how many times')
        .max(MAX_WATCH_COUNT, `Use at most ${String(MAX_WATCH_COUNT)} times`),
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
  'watchCount',
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
    watchCount: '1',
    review: '',
    isFavorite: false,
  };
}

export const MOVIE_FORM_MESSAGES = {
  created: 'Movie logged',
  unexpected: "Couldn't log the movie. Try again.",
  posterNotSent: 'Movie logged, but the poster was not uploaded.',
} as const;
