import { z, type input as TInput, type output as TOutput } from 'zod';
import type {
  INewWatchlistItemBody,
  IUpdateWatchlistItemBody,
  IWatchlistItem,
} from '@/api/types';
import type { IUploadFile } from '@/api/upload-file';
import { MOVIE_DETAILS_SHAPE } from '@/lib/validation/movie-details';
import { isoDateSchema } from '@/lib/validation/rules';

const NOTE_MAX_LENGTH = 500;

export const ITEM_FORM_SCHEMA = z.object({
  ...MOVIE_DETAILS_SHAPE,
  priority: z.enum(['high', 'medium', 'low']),
  plannedFor: z.union([z.literal(''), isoDateSchema]),
  note: z
    .string()
    .trim()
    .max(NOTE_MAX_LENGTH, `Use at most ${String(NOTE_MAX_LENGTH)} characters`),
  tmdbId: z.number().optional(),
  posterUrl: z.string().optional(),
  poster: z.custom<IUploadFile>().optional(),
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

export const ITEM_FORM_MESSAGES = {
  added: 'Added to your watchlist',
  updated: 'Watchlist item updated',
  posterNotSent: 'Saved, but the poster was not uploaded.',
  unexpected: "Couldn't save it. Try again.",
} as const;

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

export function isItemComplete(item: IWatchlistItem | undefined): boolean {
  return Boolean(
    item?.synopsis && item.releaseYear !== undefined && item.genreIds?.length,
  );
}

export function toNewItemBody(values: IItemFormOutput): INewWatchlistItemBody {
  return {
    title: values.title,
    priority: values.priority,
    releaseYear: values.releaseYear,
    genreIds: values.genreIds,
    synopsis: values.synopsis,
    ...(values.plannedFor && { plannedFor: values.plannedFor }),
    ...(values.note && { note: values.note }),
    ...(values.director && { director: values.director }),
    ...(values.durationMinutes !== undefined && {
      durationMinutes: values.durationMinutes,
    }),
    ...(values.tmdbId !== undefined && { tmdbId: values.tmdbId }),
    ...(values.posterUrl && !values.poster && { posterUrl: values.posterUrl }),
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
    releaseYear: values.releaseYear,
    genreIds: values.genreIds,
    synopsis: values.synopsis,
    director: values.director ?? '',
    durationMinutes: values.durationMinutes ?? null,
    tmdbId: values.tmdbId ?? null,
    posterUrl: values.posterUrl ?? null,
  };
}
