import { messageKey } from '@/i18n/message';
import { z, type input as TInput, type output as TOutput } from 'zod';
import type { IMovie, IUpdateMovieBody } from '@/api/types';
import type { IUploadFile } from '@/api/upload-file';
import {
  MOVIE_DETAILS_SHAPE,
  optionalText,
} from '@/lib/validation/movie-details';
import { sharedPosterUrl } from '@/lib/shared-poster';
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
        .number('movies.form.timesRequired')
        .int('movies.form.timesRequired')
        .min(1, 'movies.form.timesRequired')
        .max(
          MAX_WATCH_COUNT,
          messageKey('movies.form.maxTimes', { count: MAX_WATCH_COUNT }),
        ),
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

export function movieFormDefaultValues(
  movie?: IMovie,
): Partial<IMovieFormInput> {
  return {
    title: movie?.title ?? '',
    synopsis: movie?.synopsis ?? '',
    releaseYear: movie ? String(movie.releaseYear) : '',
    genreIds: movie?.genreIds ?? [],
    rating: movie?.rating,
    watchedAt: movie ? movie.watchedAt.slice(0, 10) : toIsoDate(new Date()),
    director: movie?.director ?? '',
    durationMinutes: movie?.durationMinutes
      ? String(movie.durationMinutes)
      : '',
    watchCount: movie ? String(movie.watchCount) : '1',
    review: movie?.review ?? '',
    isFavorite: movie?.isFavorite ?? false,
    tmdbId: movie?.tmdbId,
    posterUrl: movie?.posterUrl,
  };
}

export function movieTemplateValues(
  template: IMovie,
): Partial<IMovieFormInput> {
  return {
    ...movieFormDefaultValues(),
    title: template.title,
    synopsis: template.synopsis,
    releaseYear: String(template.releaseYear),
    genreIds: template.genreIds,
    director: template.director ?? '',
    durationMinutes: template.durationMinutes
      ? String(template.durationMinutes)
      : '',
    tmdbId: template.tmdbId,
    posterUrl: sharedPosterUrl(template.posterUrl),
  };
}

export function toUpdateMovieBody({
  poster,
  ...values
}: IMovieFormOutput): IUpdateMovieBody {
  return {
    ...values,
    review: values.review ?? '',
    director: values.director ?? '',
    durationMinutes: values.durationMinutes ?? null,
    posterUrl: poster ? values.posterUrl : (values.posterUrl ?? null),
  };
}

export const MOVIE_FORM_MESSAGES = {
  created: 'movies.form.created',
  updated: 'movies.form.updated',
  saveFailed: 'movies.form.saveFailed',
  posterNotSaved: 'movies.form.posterNotSaved',
  unexpected: 'movies.form.unexpected',
  posterNotSent: 'movies.form.posterNotSent',
} as const;
