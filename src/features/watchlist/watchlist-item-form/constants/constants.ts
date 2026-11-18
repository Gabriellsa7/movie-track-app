import { z, type input as TInput, type output as TOutput } from 'zod';
import type {
  INewWatchlistItemBody,
  IUpdateWatchlistItemBody,
  IWatchlistItem,
} from '@/api/types';
import {
  isoDateSchema,
  MAX_GENRES,
  releaseYearSchema,
} from '@/lib/validation/rules';

const TITLE_MAX_LENGTH = 200;
const NOTE_MAX_LENGTH = 500;
const SYNOPSIS_MAX_LENGTH = 2000;
const DIRECTOR_MAX_LENGTH = 200;
const MAX_DURATION_MINUTES = 1000;

function optionalText(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength, `Use at most ${String(maxLength)} characters`);
}

export const ITEM_FORM_SCHEMA = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Enter the title')
    .max(
      TITLE_MAX_LENGTH,
      `Use at most ${String(TITLE_MAX_LENGTH)} characters`,
    ),
  priority: z.enum(['high', 'medium', 'low']),
  plannedFor: z.union([z.literal(''), isoDateSchema]),
  note: optionalText(NOTE_MAX_LENGTH),
  releaseYear: z
    .string()
    .trim()
    .transform((value) => (value ? Number(value) : undefined))
    .pipe(releaseYearSchema.optional()),
  genreIds: z
    .array(z.string())
    .max(MAX_GENRES, `Pick up to ${String(MAX_GENRES)} genres`),
  synopsis: optionalText(SYNOPSIS_MAX_LENGTH),
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
  tmdbId: z.number().optional(),
  posterUrl: z.string().optional(),
});

export interface IItemFormInput extends TInput<typeof ITEM_FORM_SCHEMA> {}
export interface IItemFormOutput extends TOutput<typeof ITEM_FORM_SCHEMA> {}

export const ITEM_FORM_FIELDS = [
  'title',
  'priority',
  'plannedFor',
  'note',
  'releaseYear',
  'genreIds',
  'synopsis',
  'director',
  'durationMinutes',
] as const;

export const ITEM_DETAIL_FIELDS = [
  'releaseYear',
  'genreIds',
  'synopsis',
  'director',
  'durationMinutes',
] as const;

export function itemFormDefaultValues(
  item?: IWatchlistItem,
): Partial<IItemFormInput> {
  return {
    title: item?.title ?? '',
    priority: item?.priority ?? 'medium',
    plannedFor: item?.plannedFor?.slice(0, 10) ?? '',
    note: item?.note ?? '',
    releaseYear: item?.releaseYear ? String(item.releaseYear) : '',
    genreIds: item?.genreIds ?? [],
    synopsis: item?.synopsis ?? '',
    director: item?.director ?? '',
    durationMinutes: item?.durationMinutes ? String(item.durationMinutes) : '',
    tmdbId: item?.tmdbId,
    posterUrl: item?.posterUrl,
  };
}

export function toNewItemBody(values: IItemFormOutput): INewWatchlistItemBody {
  return {
    title: values.title,
    priority: values.priority,
    ...(values.plannedFor && { plannedFor: values.plannedFor }),
    ...(values.note && { note: values.note }),
    ...(values.releaseYear !== undefined && {
      releaseYear: values.releaseYear,
    }),
    ...(values.genreIds.length > 0 && { genreIds: values.genreIds }),
    ...(values.synopsis && { synopsis: values.synopsis }),
    ...(values.director && { director: values.director }),
    ...(values.durationMinutes !== undefined && {
      durationMinutes: values.durationMinutes,
    }),
    ...(values.tmdbId !== undefined && { tmdbId: values.tmdbId }),
    ...(values.posterUrl && { posterUrl: values.posterUrl }),
  };
}

export function toUpdateItemBody(
  values: IItemFormOutput,
): IUpdateWatchlistItemBody {
  return {
    title: values.title,
    priority: values.priority,
    plannedFor: values.plannedFor || null,
    note: values.note,
    releaseYear: values.releaseYear ?? null,
    genreIds: values.genreIds.length > 0 ? values.genreIds : null,
    synopsis: values.synopsis,
    director: values.director,
    durationMinutes: values.durationMinutes ?? null,
    tmdbId: values.tmdbId ?? null,
    posterUrl: values.posterUrl ?? null,
  };
}
