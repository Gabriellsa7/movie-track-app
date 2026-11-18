import { z, type input as TInput, type output as TOutput } from 'zod';
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

// Empty optional fields are left out of the request instead of sent as "".
function optionalText(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength, `Use no máximo ${String(maxLength)} caracteres`)
    .transform((value) => value || undefined);
}

// Mirrors POST /movies; number inputs are typed as text and converted here.
export const MOVIE_FORM_SCHEMA = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Informe o título')
    .max(
      TITLE_MAX_LENGTH,
      `Use no máximo ${String(TITLE_MAX_LENGTH)} caracteres`,
    ),
  synopsis: z
    .string()
    .trim()
    .min(1, 'Escreva uma sinopse')
    .max(
      SYNOPSIS_MAX_LENGTH,
      `Use no máximo ${String(SYNOPSIS_MAX_LENGTH)} caracteres`,
    ),
  releaseYear: z
    .string()
    .trim()
    .min(1, 'Informe o ano')
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
        .number('Informe a duração em minutos')
        .int('Informe a duração em minutos')
        .min(1, 'Informe a duração em minutos')
        .max(
          MAX_DURATION_MINUTES,
          `Use no máximo ${String(MAX_DURATION_MINUTES)} minutos`,
        )
        .optional(),
    ),
  review: optionalText(REVIEW_MAX_LENGTH),
  isFavorite: z.boolean(),
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
] as const;

// A function, so "today" is the day the form opens and not the day the app started.
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
  created: 'Filme registrado',
  noConnection:
    'Sem conexão com o servidor. Verifique sua internet e tente de novo.',
  unexpected: 'Não foi possível registrar o filme. Tente de novo.',
} as const;
