import { messageKey } from '@/i18n/message';
import { z } from 'zod';

export const FIRST_FILM_YEAR = 1888;
export const RATING_STEP = 0.5;
export const MAX_GENRES = 5;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('validation.email'));

export const passwordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    messageKey('validation.minLength', { count: PASSWORD_MIN_LENGTH }),
  )
  .max(
    PASSWORD_MAX_LENGTH,
    messageKey('validation.maxLength', { count: PASSWORD_MAX_LENGTH }),
  )
  .regex(/[A-Za-z]/, 'validation.oneLetter')
  .regex(/\d/, 'validation.oneNumber');

export const PASSWORD_RULES = [
  {
    label: messageKey('validation.passwordRules.length', {
      min: PASSWORD_MIN_LENGTH,
      max: PASSWORD_MAX_LENGTH,
    }),
    test: (password: string) =>
      password.length >= PASSWORD_MIN_LENGTH &&
      password.length <= PASSWORD_MAX_LENGTH,
  },
  {
    label: 'validation.passwordRules.letter',
    test: (password: string) => /[A-Za-z]/.test(password),
  },
  {
    label: 'validation.passwordRules.number',
    test: (password: string) => /\d/.test(password),
  },
] as const;

export const nameSchema = z
  .string()
  .trim()
  .min(
    NAME_MIN_LENGTH,
    messageKey('validation.minLength', { count: NAME_MIN_LENGTH }),
  )
  .max(
    NAME_MAX_LENGTH,
    messageKey('validation.maxLength', { count: NAME_MAX_LENGTH }),
  );

export const ratingSchema = z
  .number('validation.ratingRequired')
  .min(1, 'validation.ratingRange')
  .max(10, 'validation.ratingRange')
  .multipleOf(RATING_STEP, 'validation.ratingHalf');

export const releaseYearSchema = z
  .number('validation.yearRequired')
  .int('validation.yearValid')
  .min(
    FIRST_FILM_YEAR,
    messageKey('validation.yearFirst', { year: FIRST_FILM_YEAR }),
  )
  .refine(
    (year) => year <= new Date().getFullYear() + 1,
    'validation.yearFuture',
  );

export const genreIdsSchema = z
  .array(z.string())
  .min(1, 'validation.genreMin')
  .max(MAX_GENRES, messageKey('validation.genreMax', { count: MAX_GENRES }));

export const isoDateSchema = z
  .string()
  .regex(ISO_DATE_PATTERN, 'validation.dateValid');

export const watchedAtSchema = isoDateSchema.refine(
  (date) => date <= toIsoDate(new Date()),
  'validation.dateFuture',
);

export const imageAssetSchema = z
  .object({
    uri: z.string(),
    mimeType: z.string().optional(),
    fileSize: z.number().optional(),
  })
  .refine(
    (asset) =>
      asset.mimeType === undefined ||
      (IMAGE_MIME_TYPES as readonly string[]).includes(asset.mimeType),
    'validation.imageType',
  )
  .refine(
    (asset) =>
      asset.fileSize === undefined || asset.fileSize <= MAX_IMAGE_BYTES,
    'validation.imageSize',
  );

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
